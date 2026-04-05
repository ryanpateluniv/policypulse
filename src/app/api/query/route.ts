import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { callGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const { question } = await request.json()

  if (!question) {
    return NextResponse.json({ error: 'Missing question' }, { status: 400 })
  }

  // Search for relevant drugs mentioned in the question
  const { data: coverageData, error } = await supabase
    .from('coverage_entries')
    .select(`
      indication, coverage_status, is_preferred, prior_auth_required,
      step_therapy_required, step_therapy_drugs, clinical_criteria,
      approval_duration, exclusions, age_restrictions,
      payers (name),
      drugs (brand_name, generic_name)
    `)
    .limit(250) // Increased limit for better context

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Simplify the data to reduce token usage
  const simplified = (coverageData || []).map((e: any) => ({
    drug: e.drugs?.brand_name,
    payer: e.payers?.name,
    indication: e.indication,
    status: e.coverage_status,
    preferred: e.is_preferred,
    pa: e.prior_auth_required,
    step_therapy: e.step_therapy_required,
    step_drugs: e.step_therapy_drugs,
    criteria: e.clinical_criteria,
  }))

  const prompt = `You are PulseAI, a sophisticated medical policy analysis AI. Your goal is to help users understand complex drug coverage landscapes. Use the provided coverage data to answer questions accurately and professionally.

GUIDELINES:
- Provide clear, detailed answers using Markdown for readability.
- Use tables or bullet points when comparing multiple payers or drugs.
- If the data is empty or irrelevant, politely inform the user and offer to help with general drug policy knowledge.
- Be precise about clinical criteria and step therapy requirements if they exist in the data.

COVERAGE DATA FROM DATABASE:
${JSON.stringify(simplified)}

USER QUESTION: ${question}`

  const answer = await callGemini(prompt)

  return NextResponse.json({ question, answer, sources: coverageData?.length || 0 })
}