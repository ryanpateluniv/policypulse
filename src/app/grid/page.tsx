"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════
// PolicyPulse Coverage Grid Page
// Hospital-inspired: milky greens, soft blues, clean whites
// Drop this file into your Next.js project or render as artifact
// ═══════════════════════════════════════════════════

const COLORS = {
  covered: { bg: "#dcfce7", border: "#86efac", text: "#166534", label: "Covered" },
  preferred: { bg: "#bbf7d0", border: "#4ade80", text: "#14532d", label: "Preferred" },
  covered_with_pa: { bg: "#fef9c3", border: "#fde047", text: "#854d0e", label: "PA Required" },
  step_therapy: { bg: "#fed7aa", border: "#fb923c", text: "#9a3412", label: "Step Therapy" },
  not_covered: { bg: "#fecaca", border: "#f87171", text: "#991b1b", label: "Not Covered" },
  not_addressed: { bg: "#f3f4f6", border: "#d1d5db", text: "#6b7280", label: "No Data" },
};

function getStatusInfo(entry: any) {
  if (!entry) return COLORS.not_addressed;
  if (entry.coverage_status === "not_covered") return COLORS.not_covered;
  if (entry.is_preferred) return COLORS.preferred;
  if (entry.step_therapy_required) return COLORS.step_therapy;
  if (entry.coverage_status === "covered_with_pa") return COLORS.covered_with_pa;
  if (entry.coverage_status === "covered") return COLORS.covered;
  return COLORS.not_addressed;
}

// ─── Mock data for standalone demo ───
const MOCK_DRUGS = [
  { id: "1", brand_name: "Keytruda", generic_name: "pembrolizumab", drug_class: "PD-1 inhibitor" },
  { id: "2", brand_name: "Humira", generic_name: "adalimumab", drug_class: "TNF inhibitor" },
  { id: "3", brand_name: "Opdivo", generic_name: "nivolumab", drug_class: "PD-1 inhibitor" },
];

const MOCK_COVERAGE = {
  "1": [
    { payers: { name: "Aetna" }, indication: "Non-small cell lung cancer (NSCLC)", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Various criteria for recurrent/advanced/metastatic NSCLC. PD-L1 positive. No EGFR/ALK unless testing not feasible.", approval_duration: "24 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Aetna" }, indication: "Cutaneous melanoma", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Unresectable/metastatic single agent or adjuvant post-resection stage IIB+.", approval_duration: "12-24 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Aetna" }, indication: "Head and neck cancer", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Various criteria for HNSCC including neoadjuvant/adjuvant and recurrent settings.", approval_duration: "12-24 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Aetna" }, indication: "Breast cancer (TNBC)", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Recurrent/unresectable/metastatic TNBC with PD-L1 or high-risk early-stage neoadjuvant.", approval_duration: "12-24 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Aetna" }, indication: "Renal cell carcinoma", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "First-line with axitinib/lenvatinib or adjuvant post-nephrectomy.", approval_duration: "12-24 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Aetna" }, indication: "Multiple myeloma", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Experimental, investigational, or unproven.", approval_duration: null, exclusions: "Increased mortality risk", age_restrictions: null },
    { payers: { name: "UnitedHealthcare" }, indication: "Non-small cell lung cancer (NSCLC)", coverage_status: "covered_with_pa", is_preferred: true, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "NCCN category 1, 2A, 2B. PD-L1 expression positive >= 50%.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "UnitedHealthcare" }, indication: "Head and neck cancer", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: true, step_therapy_drugs: ["Loqtorzi (toripalimab-tpzi)"], clinical_criteria: "Nasopharyngeal carcinoma: requires trial of Loqtorzi first. History of intolerance or contraindication needed.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "UnitedHealthcare" }, indication: "Squamous cell skin cancer", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: true, step_therapy_drugs: ["Libtayo (cemiplimab-rwlc)"], clinical_criteria: "Requires trial of Libtayo first. History of intolerance or contraindication needed.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Non-small cell lung cancer (NSCLC)", coverage_status: "covered_with_pa", is_preferred: true, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "FDA approved indication or NCCN category 1, 2A, 2B recommendation.", approval_duration: "up to 12 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Head and neck cancer", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: true, step_therapy_drugs: ["Loqtorzi (toripalimab)"], clinical_criteria: "Nasopharyngeal carcinoma: must try Loqtorzi first or demonstrate intolerance/contraindication.", approval_duration: "up to 12 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Breast cancer (TNBC)", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "FDA approved indication or NCCN recommendation.", approval_duration: "up to 12 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Cutaneous melanoma", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "FDA approved indication or NCCN recommendation.", approval_duration: "up to 12 months", exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Renal cell carcinoma", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "FDA approved indication or NCCN recommendation.", approval_duration: "up to 12 months", exclusions: null, age_restrictions: null },
  ],
  "2": [
    { payers: { name: "Aetna" }, indication: "Rheumatoid arthritis", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: true, step_therapy_drugs: ["methotrexate", "Rinvoq", "Xeljanz"], clinical_criteria: "Adults with moderately to severely active RA. Prior biologic or failed MTX required.", approval_duration: null, exclusions: "Active TB", age_restrictions: "18+" },
    { payers: { name: "Aetna" }, indication: "Crohn's disease", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Moderately to severely active CD. Negative TB test required.", approval_duration: null, exclusions: "Active TB", age_restrictions: "6+" },
    { payers: { name: "Aetna" }, indication: "Plaque psoriasis", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: true, step_therapy_drugs: ["Sotyktu", "Otezla", "methotrexate"], clinical_criteria: "Moderate to severe. Prior biologic or failed phototherapy/MTX/cyclosporine.", approval_duration: null, exclusions: "Active TB", age_restrictions: "18+" },
    { payers: { name: "Aetna" }, indication: "Ulcerative colitis", coverage_status: "covered_with_pa", is_preferred: false, prior_auth_required: true, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Moderately to severely active UC.", approval_duration: null, exclusions: "Active TB", age_restrictions: "5+" },
    { payers: { name: "UnitedHealthcare" }, indication: "Rheumatoid arthritis", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Brand Humira excluded. Biosimilar adalimumab products preferred.", approval_duration: null, exclusions: "Brand Humira not covered", age_restrictions: null },
    { payers: { name: "UnitedHealthcare" }, indication: "Crohn's disease", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Brand Humira excluded. Biosimilar products preferred.", approval_duration: null, exclusions: "Brand Humira not covered", age_restrictions: null },
    { payers: { name: "UnitedHealthcare" }, indication: "Plaque psoriasis", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Brand Humira excluded.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "UnitedHealthcare" }, indication: "Ulcerative colitis", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Brand Humira excluded.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Rheumatoid arthritis", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Not covered for Employer Plans. Biosimilar required.", approval_duration: null, exclusions: "Brand not covered for employer plans", age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Crohn's disease", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Not covered for Employer Plans.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Plaque psoriasis", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Not covered for Employer Plans.", approval_duration: null, exclusions: null, age_restrictions: null },
    { payers: { name: "Cigna" }, indication: "Ulcerative colitis", coverage_status: "not_covered", is_preferred: false, prior_auth_required: false, step_therapy_required: false, step_therapy_drugs: [], clinical_criteria: "Not covered for Employer Plans.", approval_duration: null, exclusions: null, age_restrictions: null },
  ],
};

// ─── Detail Panel Component ───
function DetailPanel({ entry, onClose }) {
  if (!entry) return null;
  const status = getStatusInfo(entry);

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "440px", background: "white", boxShadow: "-8px 0 30px rgba(0,0,0,0.08)", zIndex: 1000, display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease-out" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}`, padding: "3px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{status.label}</span>
          </div>
          <h3 style={{ margin: "8px 0 0", fontSize: "1rem", fontWeight: 600, color: "#111" }}>{entry.indication}</h3>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>{entry.payers?.name}</p>
        </div>
        <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#6b7280" }}>&times;</button>
      </div>

      {/* Content */}
      <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Prior Auth", value: entry.prior_auth_required ? "Required" : "Not Required", color: entry.prior_auth_required ? "#f59e0b" : "#10b981" },
            { label: "Step Therapy", value: entry.step_therapy_required ? "Required" : "Not Required", color: entry.step_therapy_required ? "#f97316" : "#10b981" },
            { label: "Preferred", value: entry.is_preferred ? "Yes" : "No", color: entry.is_preferred ? "#10b981" : "#6b7280" },
            { label: "Duration", value: entry.approval_duration || "Not specified", color: "#6b7280" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: s.color, margin: "4px 0 0" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Step Therapy Drugs */}
        {entry.step_therapy_drugs && entry.step_therapy_drugs.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Must Try First</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {entry.step_therapy_drugs.map((d, i) => (
                <span key={i} style={{ background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 500 }}>{d}</span>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Criteria */}
        {entry.clinical_criteria && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Clinical Criteria</p>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "14px", fontSize: "0.85rem", color: "#166534", lineHeight: 1.6 }}>
              {entry.clinical_criteria}
            </div>
          </div>
        )}

        {/* Exclusions */}
        {entry.exclusions && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Exclusions</p>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "14px", fontSize: "0.85rem", color: "#991b1b", lineHeight: 1.6 }}>
              {entry.exclusions}
            </div>
          </div>
        )}

        {/* Age */}
        {entry.age_restrictions && (
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Age Restrictions</p>
            <p style={{ fontSize: "0.85rem", color: "#374151" }}>{entry.age_restrictions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Coverage Grid Page ───
export default function CoverageGridPage() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const searchRef = useRef(null);
  const USE_API = false; // Set to true when backend is running

  // Search handler
  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      if (USE_API) {
        try {
          const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(search)}`);
          const data = await res.json();
          setSuggestions(data);
        } catch { setSuggestions([]); }
      } else {
        setSuggestions(MOCK_DRUGS.filter(d => d.brand_name.toLowerCase().includes(search.toLowerCase()) || d.generic_name.toLowerCase().includes(search.toLowerCase())));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  async function selectDrug(drug) {
    setSelectedDrug(drug);
    setSearch(drug.brand_name);
    setSuggestions([]);
    setLoading(true);
    if (USE_API) {
      try {
        const res = await fetch(`/api/drugs/${drug.id}/coverage`);
        const data = await res.json();
        setCoverage(data);
      } catch { setCoverage([]); }
    } else {
      await new Promise(r => setTimeout(r, 600));
      setCoverage(MOCK_COVERAGE[drug.id] || []);
    }
    setLoading(false);
  }

  // Build grid data
  const payers = [...new Set(coverage.map(e => e.payers?.name))].filter(Boolean);
  const indications = [...new Set(coverage.map(e => e.indication))].filter(Boolean);

  function getEntry(payer, indication) {
    return coverage.find(e => e.payers?.name === payer && e.indication === indication);
  }

  // Count stats
  const coveredCount = coverage.filter(e => e.coverage_status === "covered" || e.coverage_status === "covered_with_pa").length;
  const notCoveredCount = coverage.filter(e => e.coverage_status === "not_covered").length;
  const stepTherapyCount = coverage.filter(e => e.step_therapy_required).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f0fdf4 0%, #ecfeff 40%, #f8fafc 100%)" }}>
      {/* Subtle grid pattern overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,180,120,0.03) 1px, transparent 0)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "32px", borderRadius: "4px", background: "linear-gradient(180deg, #34d399, #06b6d4)" }} />
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              Coverage Grid
            </h1>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#64748b", marginLeft: "20px", marginTop: "4px" }}>
            Compare drug coverage across insurance plans at a glance
          </p>
        </div>

        {/* Search Section */}
        <div style={{ marginBottom: "28px", position: "relative" }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "6px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,180,120,0.04)",
            display: "flex",
            alignItems: "center",
            maxWidth: "640px",
          }}>
            <div style={{ padding: "10px 16px", display: "flex", alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedDrug(null); }}
              placeholder="Search for a drug (e.g., Keytruda, Humira)..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.95rem",
                color: "#1e293b",
                background: "transparent",
                padding: "10px 0",
              }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setSelectedDrug(null); setCoverage([]); setSuggestions([]); }} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "8px", color: "#94a3b8", fontSize: "1rem" }}>&times;</button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && !selectedDrug && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, maxWidth: "640px", width: "100%", background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "6px", zIndex: 50 }}>
              {suggestions.map(drug => (
                <button key={drug.id} onClick={() => selectDrug(drug)} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", border: "none", background: "transparent", borderRadius: "10px", cursor: "pointer", textAlign: "left" }}
                  onMouseOver={e => e.currentTarget.style.background = "#f0fdf4"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #dcfce7, #cffafe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#059669" }}>
                    {drug.brand_name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#111" }}>{drug.brand_name}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>{drug.generic_name} &middot; {drug.drug_class}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drug Info Bar */}
        {selectedDrug && !loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #34d399, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: "white" }}>
                {selectedDrug.brand_name.charAt(0)}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "#0f172a" }}>{selectedDrug.brand_name}</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>{selectedDrug.generic_name} &middot; {selectedDrug.drug_class}</p>
              </div>
            </div>

            {/* Quick Stats Pills */}
            <div style={{ display: "flex", gap: "8px", marginLeft: "auto", flexWrap: "wrap" }}>
              <span style={{ background: "#dcfce7", color: "#166534", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
                {coveredCount} Covered
              </span>
              <span style={{ background: "#fecaca", color: "#991b1b", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
                {notCoveredCount} Not Covered
              </span>
              {stepTherapyCount > 0 && (
                <span style={{ background: "#fed7aa", color: "#9a3412", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
                  {stepTherapyCount} Step Therapy
                </span>
              )}
              <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
                {payers.length} Payers
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        {selectedDrug && !loading && coverage.length > 0 && (
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            {Object.entries(COLORS).map(([key, val]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: val.bg, border: `1.5px solid ${val.border}` }} />
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>{val.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ display: "inline-block", width: "40px", height: "40px", border: "3px solid #e2e8f0", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: "16px", color: "#64748b", fontSize: "0.9rem" }}>Loading coverage data...</p>
          </div>
        )}

        {/* Empty State */}
        {!selectedDrug && !loading && (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "linear-gradient(135deg, #dcfce7, #cffafe)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1e293b", margin: "0 0 8px" }}>Search for a Drug</h2>
            <p style={{ fontSize: "0.9rem", color: "#94a3b8", maxWidth: "400px", margin: "0 auto 28px", lineHeight: 1.5 }}>
              Type a drug name above to see coverage comparison across all insurance plans
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {MOCK_DRUGS.map(d => (
                <button key={d.id} onClick={() => { setSearch(d.brand_name); selectDrug(d); }}
                  style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 18px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, color: "#374151", transition: "all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#34d399"; e.currentTarget.style.background = "#f0fdf4"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}
                >
                  {d.brand_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ THE GRID ═══ */}
        {selectedDrug && !loading && coverage.length > 0 && (
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: `${200 + indications.length * 150}px` }}>
                <thead>
                  <tr>
                    <th style={{ position: "sticky", left: 0, zIndex: 10, background: "#f8fafb", padding: "14px 20px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #e2e8f0", minWidth: "180px" }}>
                      Payer
                    </th>
                    {indications.map((ind, i) => (
                      <th key={i} style={{ background: "#f8fafb", padding: "14px 12px", textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: "#475569", borderBottom: "2px solid #e2e8f0", minWidth: "140px", maxWidth: "180px", lineHeight: 1.3 }}>
                        {ind.length > 40 ? ind.substring(0, 38) + "..." : ind}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payers.map((payer, pi) => (
                    <tr key={pi}>
                      <td style={{ position: "sticky", left: 0, zIndex: 5, background: "white", padding: "12px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: pi === 0 ? "#dbeafe" : pi === 1 ? "#dcfce7" : "#fce7f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: pi === 0 ? "#1e40af" : pi === 1 ? "#166534" : "#9d174d" }}>
                            {payer.charAt(0)}
                          </div>
                          {payer}
                        </div>
                      </td>
                      {indications.map((ind, ii) => {
                        const entry = getEntry(payer, ind);
                        const status = getStatusInfo(entry);
                        const cellKey = `${pi}-${ii}`;
                        return (
                          <td key={ii} style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                            <div
                              onClick={() => entry && setSelectedEntry(entry)}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                                setHoveredCell(cellKey);
                              }}
                              onMouseLeave={() => setHoveredCell(null)}
                              style={{
                                background: status.bg,
                                border: `1.5px solid ${status.border}`,
                                borderRadius: "10px",
                                padding: "10px 8px",
                                cursor: entry ? "pointer" : "default",
                                transition: "all 0.15s ease",
                                transform: hoveredCell === cellKey ? "scale(1.05)" : "scale(1)",
                                boxShadow: hoveredCell === cellKey ? `0 4px 12px ${status.border}40` : "none",
                                position: "relative",
                              }}
                            >
                              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: status.text, letterSpacing: "0.02em" }}>
                                {status.label.toUpperCase()}
                              </span>
                              {entry?.step_therapy_required && (
                                <div style={{ marginTop: "4px", fontSize: "0.6rem", color: status.text, opacity: 0.8 }}>
                                  &#x26A0; Try first: {entry.step_therapy_drugs?.[0]?.split(" ")[0] || "Other"}
                                </div>
                              )}
                              {entry?.is_preferred && (
                                <div style={{ marginTop: "4px", fontSize: "0.6rem", color: status.text }}>&#x2605; Preferred</div>
                              )}
                            </div>

                            {/* Tooltip */}
                            {hoveredCell === cellKey && entry && (
                              <div style={{
                                position: "fixed",
                                left: tooltipPos.x,
                                top: tooltipPos.y,
                                transform: "translate(-50%, -100%)",
                                background: "#1e293b",
                                color: "white",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                fontSize: "0.78rem",
                                maxWidth: "280px",
                                zIndex: 100,
                                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                pointerEvents: "none",
                                lineHeight: 1.4,
                              }}>
                                <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{entry.payers?.name} &middot; {status.label}</p>
                                {entry.prior_auth_required && <p style={{ margin: 0, opacity: 0.8 }}>&#x1F4CB; Prior authorization required</p>}
                                {entry.step_therapy_required && <p style={{ margin: 0, opacity: 0.8 }}>&#x26A0; Must try: {entry.step_therapy_drugs?.join(", ")}</p>}
                                {entry.approval_duration && <p style={{ margin: 0, opacity: 0.8 }}>&#x23F0; Approval: {entry.approval_duration}</p>}
                                <p style={{ margin: "4px 0 0", opacity: 0.5, fontSize: "0.7rem" }}>Click for full details</p>
                                <div style={{ position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)", width: "10px", height: "10px", background: "#1e293b" }} />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid Footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#94a3b8" }}>
              <span>{payers.length} payers &middot; {indications.length} indications &middot; {coverage.length} data points</span>
              <span>Click any cell for full details</span>
            </div>
          </div>
        )}

        {/* No Coverage Found */}
        {selectedDrug && !loading && coverage.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#374151" }}>No coverage data found for {selectedDrug.brand_name}</p>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "8px" }}>Upload policy documents on the Documents page to see coverage data here.</p>
          </div>
        )}
      </div>

      {/* Detail Panel Overlay */}
      {selectedEntry && (
        <>
          <div onClick={() => setSelectedEntry(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 999, backdropFilter: "blur(2px)" }} />
          <DetailPanel entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        </>
      )}
    </div>
  );
}
