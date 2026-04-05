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
  const text = pdfText.substring(0, 100000)

  const prompt = `You are a medical policy document parser. Extract drug coverage information from this document.

IMPORTANT RULES:
- Focus ONLY on these drugs: Keytruda (pembrolizumab), Opdivo (nivolumab), Humira (adalimumab), Tecentriq (atezolizumab), Libtayo (cemiplimab), Keytruda Qlex
- If a drug above is not in the document, skip it
- Return ONLY valid JSON with NO markdown backticks, NO explanation, NO extra text
- Start your response with { and end with }
- NEVER use "All indications" or "All conditions" as an indication name. Always list each indication separately.
- If a drug is blanket not-covered, expand into individual indications:
  For Humira: Rheumatoid Arthritis, Psoriatic Arthritis, Ankylosing Spondylitis, Crohn's Disease, Ulcerative Colitis, Plaque Psoriasis, Hidradenitis Suppurativa, Uveitis
  For Keytruda: NSCLC, Melanoma, Head & Neck Cancer, Breast Cancer (TNBC), Renal Cell Carcinoma, Urothelial Carcinoma, Colorectal Cancer, Endometrial Carcinoma
- Keep clinical_criteria under 200 chars
- Use these EXACT indication names (standardized):
  Rheumatoid Arthritis, Psoriatic Arthritis, Ankylosing Spondylitis, Crohn's Disease, Ulcerative Colitis, Plaque Psoriasis, Hidradenitis Suppurativa, Uveitis, Juvenile Idiopathic Arthritis, Behcet's Disease, NSCLC, Melanoma, Head & Neck Cancer, Breast Cancer (TNBC), Renal Cell Carcinoma, Urothelial Carcinoma, Colorectal Cancer, Endometrial Carcinoma, Cervical Cancer, Gastric Cancer, Esophageal Cancer, Hepatocellular Carcinoma, Merkel Cell Carcinoma, Biliary Tract Cancer, Squamous Cell Skin Cancer, Hodgkin Lymphoma, Small Cell Lung Cancer

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
          "indication_name": "use exact standardized name from list above",
          "coverage_status": "covered | covered_with_pa | not_covered",
          "is_preferred": true/false,
          "prior_auth_required": true/false,
          "step_therapy_required": true/false,
          "step_therapy_drugs": [],
          "clinical_criteria": "brief requirements (max 200 chars)",
          "approval_duration": "string or null",
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