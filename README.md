<p align="center">
  <img src="https://img.shields.io/badge/PolicyPulse-AI%20Powered-084d38?style=for-the-badge&labelColor=f0fdf4" alt="PolicyPulse" />
</p>

<h1 align="center">PolicyPulse</h1>
<h3 align="center">The Bloomberg Terminal for Medical Drug Coverage</h3>

<p align="center">
  AI-powered platform that ingests insurance policy PDFs and instantly shows which drugs are covered, what's required, and what changed — across every major payer.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/ElevenLabs-000?style=flat-square" />
  <img src="https://img.shields.io/badge/Auth0-EB5424?style=flat-square&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <strong>Innovation Hacks 2.0 — Anton RX Track (Gold Sponsor)</strong>
</p>

---

## 🎯 The Problem

Every day, pharmacists and healthcare providers waste hours digging through 50-page insurance policy PDFs to answer one question:

> *"Does this patient's insurance cover this drug?"*

There are **300+ payers** in the US, each with different policies that change quarterly. There is **no centralized, searchable source** for drug coverage data. Providers resort to manually reading PDFs, calling insurance companies, or guessing — delaying patient care by days or weeks.

## 💡 The Solution

**PolicyPulse** turns any insurance policy PDF into structured, searchable, comparable data in seconds.

Upload a PDF → AI extracts every drug, indication, and coverage rule → See it all on a visual dashboard.

---

## ✨ Features

### 📊 Coverage Grid
Search any drug and instantly see a **color-coded heatmap** across all payers.
- 🟢 **Green** = Covered / Preferred
- 🟡 **Yellow** = Prior Authorization Required
- 🟠 **Orange** = Step Therapy Required
- 🔴 **Red** = Not Covered
- ⚪ **Gray** = No Data

Click any cell to see full clinical criteria, step therapy drugs, approval duration, and exclusions.

### 🔍 Policy Diff Engine
Compare **old vs new** policy versions side-by-side — like GitHub diffs but for drug coverage.
- See exactly which indications were **added**, **removed**, or **modified**
- AI-generated summary highlights the most critical changes
- Compare across payers OR across time periods

### 🤖 PulseAI Chat
Ask questions in plain English:
- *"Is Keytruda covered by Cigna for NSCLC?"*
- *"Which payers require step therapy for Humira?"*
- *"What changed in Aetna's Keytruda policy?"*

Powered by **Google Gemini 2.5 Flash** for accurate, cited answers.

### 🎙️ Voice Assistant
Talk to PulseAI hands-free using **ElevenLabs Conversational AI**. Built for busy clinicians who need answers while reviewing charts or seeing patients.

### 📁 Policy Vault
Secure document management with:
- Drag-and-drop PDF upload
- Real-time AI parsing progress
- Per-document analytics (drugs found, coverage entries extracted)
- One-click navigation to Coverage Grid

### 🔐 Secure Authentication
**Auth0** provides healthcare-grade authentication with role-based access control.

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js 14    │────▶│  API Routes       │────▶│   Supabase      │
│   Frontend      │     │  (TypeScript)     │     │   PostgreSQL    │
│   Tailwind CSS  │     └────────┬─────────┘     └─────────────────┘
└─────────────────┘              │
                                 ├──▶ Gemini 2.5 Flash (PDF parsing + NLP)
                                 ├──▶ Python PyMuPDF (PDF text extraction)
                                 ├──▶ ElevenLabs (Voice AI agent)
                                 └──▶ Auth0 (Authentication)
```

### Data Flow
1. User uploads a medical policy PDF
2. Python PyMuPDF extracts raw text
3. Gemini 2.5 Flash parses text into structured JSON (drugs, indications, coverage status, criteria)
4. Normalized data stored in Supabase PostgreSQL
5. Frontend renders Coverage Grid, Diff View, and search results
6. PulseAI chat and voice powered by Gemini + ElevenLabs

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Web application UI |
| AI/ML | Google Gemini 2.5 Flash | PDF parsing, NLP queries, diff analysis |
| PDF Processing | Python, PyMuPDF | Text extraction from policy PDFs |
| Voice | ElevenLabs Conversational AI | Hands-free voice assistant |
| Auth | Auth0 | Secure authentication & RBAC |
| Database | Supabase (PostgreSQL) | Structured policy data storage |
| Deployment | Vercel | Frontend hosting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account
- API keys: Gemini, ElevenLabs, Auth0

### Installation

```bash
# Clone the repo
git clone https://github.com/ryanpateluniv/policypulse.git
cd policypulse

# Install dependencies
npm install

# Install Python dependencies
pip install PyMuPDF

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys

# Run the development server
npm run dev
```

### Environment Variables

```env
# Gemini
GEMINI_API_KEY=your_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Auth0
AUTH0_SECRET=your_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_id
AUTH0_CLIENT_SECRET=your_secret

# ElevenLabs
ELEVENLABS_API_KEY=your_key
```

### Upload Policy Data

```bash
# Upload a policy PDF via curl
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@data/Keytruda_Cigna.pdf" \
  -F "payer=Cigna"
```

---

## 📊 Demo Data

Real, publicly available policy documents from major US health insurers:

| Drug | Aetna | UnitedHealthcare | Cigna |
|------|-------|-----------------|-------|
| **Keytruda** (pembrolizumab) | ✅ | ✅ | ✅ |
| **Humira** (adalimumab) | ✅ | ✅ | ✅ |
| **Opdivo** (nivolumab) | ✅ | ✅ | ✅ |
| **Tecentriq** (atezolizumab) | ✅ | ✅ | ✅ |

### Key Findings from Real Data
- 🔴 Cigna requires **Loqtorzi trial** before Keytruda for nasopharyngeal carcinoma — Aetna doesn't
- 🟡 UHC requires **step therapy** for Keytruda in squamous cell skin cancer
- 🔴 Humira brand **not covered** by Cigna for employer plans — biosimilars required
- 🟢 Aetna has the most granular coverage with 60+ indication-specific entries for Keytruda

---

## 🏆 Prize Targets

| Prize | How We Use It |
|-------|--------------|
| **Anton RX Track** (Gold Sponsor) | Core product — medical benefit drug policy tracker |
| **MLH Best Use of Gemini API** | PDF parsing, NLP queries, diff analysis |
| **MLH Best Use of ElevenLabs** | Voice-powered policy assistant |
| **MLH Best Use of Auth0** | Healthcare-grade authentication |

---

## 👥 Team

Built in 48 hours at **Innovation Hacks 2.0** by a team of 4 using Claude AI as our coding co-pilot.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>PolicyPulse</strong> — Turning the most opaque part of healthcare into something transparent, searchable, and audible.
</p>
