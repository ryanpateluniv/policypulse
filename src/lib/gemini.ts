const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function callGemini(prompt: string) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 65536,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Gemini API error: ${JSON.stringify(data)}`)
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function parsePolicyDocument(pdfText: string) {
  const prompt = `You are a medical policy document parser. Extract drug coverage information from this document.

IMPORTANT RULES:
- Focus ONLY on these drugs: Keytruda (pembrolizumab), Opdivo (nivolumab), Humira (adalimumab), Tecentriq (atezolizumab), Libtayo (cemiplimab), Keytruda Qlex
- If a drug above is not in the document, skip it
- Return ONLY valid JSON with NO markdown backticks, NO explanation, NO extra text
- Start your response with { and end with }

Return this exact JSON format:
{
  "payer_name": "string",
  "document_title": "string",
  "effective_date": "YYYY-MM-DD or null",
  "drugs": [
    {
      "brand_name": "string",
      "generic_name": "string",
      "indications": [
        {
          "indication_name": "string",
          "coverage_status": "covered | covered_with_pa | not_covered | not_addressed",
          "is_preferred": true/false,
          "prior_auth_required": true/false,
          "step_therapy_required": true/false,
          "step_therapy_drugs": ["drug names that must be tried first"],
          "clinical_criteria": "brief summary of approval criteria (max 200 chars)",
          "approval_duration": "e.g. 12 months",
          "exclusions": "exclusion criteria or null",
          "age_restrictions": "e.g. 18+ or null"
        }
      ]
    }
  ]
}

DOCUMENT TEXT:
${pdfText}`

  const result = await callGemini(prompt)

  try {
    // Remove any markdown backticks if present
    let cleaned = result.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }
    return JSON.parse(cleaned)
  } catch (e) {
    throw new Error(`Failed to parse Gemini response as JSON: ${result.substring(0, 500)}`)
  }
}