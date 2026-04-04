import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { callGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const { question } = await request.json()

  if (!question) {
    return NextResponse.json({ error: 'Missing question' }, { status: 400 })
  }

  const { data: coverageData, error } = await supabase
    .from('coverage_entries')
    .select(`
      *,
      payers (name, type),
      drugs (brand_name, generic_name)
    `)
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const prompt = `You are a medical policy coverage expert. Based on the following parsed policy data from multiple health insurance plans, answer the user's question accurately. Cite specific payer names and policy details.

COVERAGE DATA:
${JSON.stringify(coverageData, null, 2)}

USER QUESTION: ${question}

Respond with:
1. A direct answer
2. Supporting evidence from specific policies
3. Any caveats or gaps in the data`

  const answer = await callGemini(prompt)

  return NextResponse.json({ question, answer, sources: coverageData?.length || 0 })
}