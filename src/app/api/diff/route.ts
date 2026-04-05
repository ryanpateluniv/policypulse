import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { callGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const supabase = getServiceClient()

  try {
    const { old_document_id, new_document_id } = await request.json()

    if (!old_document_id || !new_document_id) {
      return NextResponse.json({ error: 'Missing old_document_id or new_document_id' }, { status: 400 })
    }

    // 1. Fetch coverage entries for both documents
    const { data: oldEntries, error: oldError } = await supabase
      .from('coverage_entries')
      .select('*, drugs(brand_name, generic_name), payers(name)')
      .eq('policy_document_id', old_document_id)

    const { data: newEntries, error: newError } = await supabase
      .from('coverage_entries')
      .select('*, drugs(brand_name, generic_name), payers(name)')
      .eq('policy_document_id', new_document_id)

    if (oldError || newError) {
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    // 2. Compare entries field by field
    const changes = []

    // Check for modifications and removals
    for (const oldEntry of oldEntries || []) {
      const match = (newEntries || []).find(
        n => n.drugs?.brand_name === oldEntry.drugs?.brand_name && n.indication === oldEntry.indication
      )

      if (!match) {
        changes.push({
          drug: oldEntry.drugs?.brand_name,
          indication: oldEntry.indication,
          change_type: 'removed',
          old_value: oldEntry.coverage_status,
          new_value: null,
          details: oldEntry,
        })
      } else {
        // Check each field for changes
        const fields = ['coverage_status', 'is_preferred', 'prior_auth_required', 'step_therapy_required', 'clinical_criteria', 'approval_duration']
        for (const field of fields) {
          if (JSON.stringify(oldEntry[field]) !== JSON.stringify(match[field])) {
            changes.push({
              drug: oldEntry.drugs?.brand_name,
              indication: oldEntry.indication,
              change_type: 'modified',
              field_changed: field,
              old_value: oldEntry[field],
              new_value: match[field],
            })
          }
        }

        // Check step therapy drugs
        const oldDrugs = JSON.stringify(oldEntry.step_therapy_drugs || [])
        const newDrugs = JSON.stringify(match.step_therapy_drugs || [])
        if (oldDrugs !== newDrugs) {
          changes.push({
            drug: oldEntry.drugs?.brand_name,
            indication: oldEntry.indication,
            change_type: 'modified',
            field_changed: 'step_therapy_drugs',
            old_value: oldEntry.step_therapy_drugs,
            new_value: match.step_therapy_drugs,
          })
        }
      }
    }

    // Check for additions
    for (const newEntry of newEntries || []) {
      const match = (oldEntries || []).find(
        o => o.drugs?.brand_name === newEntry.drugs?.brand_name && o.indication === newEntry.indication
      )

      if (!match) {
        changes.push({
          drug: newEntry.drugs?.brand_name,
          indication: newEntry.indication,
          change_type: 'added',
          old_value: null,
          new_value: newEntry.coverage_status,
          details: newEntry,
        })
      }
    }

    // 3. Generate AI summary of changes
    let summary = 'No changes detected.'
    if (changes.length > 0) {
      const summaryPrompt = `You are a medical policy change analyst. Summarize these policy changes in 3-5 bullet points. Focus on what impacts patient access to medications. Be specific with drug names and payer names.

CHANGES:
${JSON.stringify(changes, null, 2)}

Return a plain text summary, no JSON, no markdown. Just clear bullet points starting with •`

      summary = await callGemini(summaryPrompt)
    }

    // 4. Store changes in policy_changes table
    const payer_id = oldEntries?.[0]?.payers?.name ? 
      (await supabase.from('payers').select('id').eq('name', oldEntries[0].payers.name).single())?.data?.id : null

    for (const change of changes) {
      const drug_id = oldEntries?.find(e => e.drugs?.brand_name === change.drug)?.drug_id ||
        newEntries?.find(e => e.drugs?.brand_name === change.drug)?.drug_id

      await supabase.from('policy_changes').insert({
        payer_id,
        drug_id,
        old_document_id,
        new_document_id,
        change_type: change.change_type,
        field_changed: change.field_changed || null,
        old_value: JSON.stringify(change.old_value),
        new_value: JSON.stringify(change.new_value),
        change_summary: `${change.drug}: ${change.indication} - ${change.change_type}`,
      })
    }

    return NextResponse.json({
      total_changes: changes.length,
      changes,
      summary,
      old_entries_count: oldEntries?.length || 0,
      new_entries_count: newEntries?.length || 0,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}