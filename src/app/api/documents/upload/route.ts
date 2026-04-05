import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { parsePolicyDocument } from '@/lib/gemini'
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const supabase = getServiceClient()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const payerName = formData.get('payer') as string

    if (!file || !payerName) {
      return NextResponse.json({ error: 'Missing file or payer name' }, { status: 400 })
    }

    // 1. Find the payer
    const { data: payer, error: payerError } = await supabase
      .from('payers')
      .select('id')
      .eq('name', payerName)
      .single()

    if (payerError || !payer) {
      return NextResponse.json({ error: `Payer not found: ${payerName}` }, { status: 404 })
    }

    // 2. Create policy_documents record
    const { data: doc, error: docError } = await supabase
      .from('policy_documents')
      .insert({
        payer_id: payer.id,
        title: file.name,
        status: 'pending',
      })
      .select()
      .single()

    if (docError || !doc) {
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    // 3. Save PDF to temp file and extract text with Python
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const tmpPath = join('/tmp', `upload_${Date.now()}.pdf`)
    writeFileSync(tmpPath, buffer)

    let cleanText = ''
    try {
      cleanText = execSync(`python3 python-service/extract.py "${tmpPath}"`, {
        maxBuffer: 50 * 1024 * 1024,
      }).toString().substring(0, 100000)
    } finally {
      try { unlinkSync(tmpPath) } catch {}
    }

    // 4. Update status to 'parsing'
    await supabase
      .from('policy_documents')
      .update({ status: 'parsing', raw_text: cleanText.substring(0, 10000) })
      .eq('id', doc.id)

    // 5. Send to Gemini
    const parsed = await parsePolicyDocument(cleanText)

    // 6. Store coverage entries
    const coverageEntries = []

    for (const drug of parsed.drugs || []) {
      let { data: existingDrug } = await supabase
        .from('drugs')
        .select('id')
        .ilike('brand_name', drug.brand_name)
        .single()

      if (!existingDrug) {
        const { data: newDrug } = await supabase
          .from('drugs')
          .insert({
            brand_name: drug.brand_name,
            generic_name: drug.generic_name || null,
          })
          .select()
          .single()
        existingDrug = newDrug
      }

      if (!existingDrug) continue

      for (const indication of drug.indications || []) {
        const entry = {
          policy_document_id: doc.id,
          drug_id: existingDrug.id,
          payer_id: payer.id,
          indication: indication.indication_name,
          coverage_status: indication.coverage_status,
          is_preferred: indication.is_preferred || false,
          prior_auth_required: indication.prior_auth_required || false,
          step_therapy_required: indication.step_therapy_required || false,
          step_therapy_drugs: indication.step_therapy_drugs || [],
          clinical_criteria: indication.clinical_criteria || null,
          approval_duration: indication.approval_duration || null,
          exclusions: indication.exclusions || null,
          age_restrictions: indication.age_restrictions || null,
          raw_source_text: JSON.stringify(indication),
        }

        const { data: inserted } = await supabase
          .from('coverage_entries')
          .insert(entry)
          .select()
          .single()

        if (inserted) coverageEntries.push(inserted)
      }
    }

    // 7. Update status to 'parsed'
    await supabase
      .from('policy_documents')
      .update({
        status: 'parsed',
        title: file.name,
        effective_date: parsed.effective_date || null,
      })
      .eq('id', doc.id)

    return NextResponse.json({
      success: true,
      document_id: doc.id,
      payer: payerName,
      drugs_found: parsed.drugs?.length || 0,
      coverage_entries: coverageEntries.length,
      parsed_data: parsed,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}