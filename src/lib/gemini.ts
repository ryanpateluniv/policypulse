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
  const text = pdfText.substring(0, 60000)

  const prompt = `You are a medical policy document parser. Your job is to extract ALL drug coverage information from this health insurance policy document.

RULES:
1. Extract the TOP 20 most clinically significant drugs mentioned in this document that have coverage criteria, prior authorization requirements, or step therapy requirements. Prioritize cancer drugs, biologics, and specialty medications.
2. Do NOT limit to specific drugs. Extract ALL of them.
3. Return ONLY valid JSON. No markdown backticks. No explanation. Start with { end with }
4. List EACH medical indication separately. NEVER combine them as "All indications" or "All conditions".
5. If a drug is blanket not-covered for all uses, list the individual FDA-approved indications for that drug as separate not_covered entries.
6. Include BOTH covered AND not-covered indications.
7. Keep clinical_criteria under 200 characters but include key requirements.
8. Keep clinical_criteria under 200 characters but include key requirements.
9. If the document covers many similar products (biosimilars, generics), extract ONLY the original brand-name drug and up to 3 biosimilars. Skip the rest to keep output concise.
10. Limit total output to a maximum of 20 drugs. Prioritize the most clinically significant ones.


JSON format:
{
  "payer_name": "string",
  "document_title": "string",
  "effective_date": "YYYY-MM-DD or null",
  "drugs": [
    {
      "brand_name": "string",
      "generic_name": "string or null",
      "indications": [
        {
          "indication_name": "specific disease name",
          "coverage_status": "covered | covered_with_pa | not_covered",
          "is_preferred": true/false,
          "prior_auth_required": true/false,
          "step_therapy_required": true/false,
          "step_therapy_drugs": ["drugs that must be tried first"],
          "clinical_criteria": "brief approval requirements (max 200 chars)",
          "approval_duration": "e.g. 12 months or null",
          "exclusions": "string or null",
          "age_restrictions": "string or null"
        }
      ]
    }
  ]
}

DOCUMENT TEXT:
${text}`

  const result = await callGemini(prompt)

  try {
    let cleaned = result.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }
    return JSON.parse(cleaned)
  } catch (e) {
    throw new Error(`Failed to parse Gemini response as JSON: ${result.substring(0, 500)}`)
  }
}