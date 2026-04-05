"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Info, CheckCircle2, AlertCircle, Clock, ShieldCheck, TrendingUp, ChevronRight, X, Sparkles, Filter } from "lucide-react";

// ═══════════════════════════════════════════════════
// PolicyPulse Coverage Grid Component - Premium Theme
// Data sourced from: src/app/coverage/page.tsx
// ═══════════════════════════════════════════════════

const COLORS = {
  covered: { bg: "#f0fdf4", border: "#dcfce7", text: "#166534", label: "Covered" },
  preferred: { bg: "#ecfdf5", border: "#d1fae5", text: "#065f46", label: "Preferred" },
  covered_with_pa: { bg: "#fffbeb", border: "#fef3c7", text: "#92400e", label: "PA Required" },
  step_therapy: { bg: "#fff7ed", border: "#ffedd5", text: "#9a3412", label: "Step Therapy" },
  not_covered: { bg: "#fef2f2", border: "#fee2e2", text: "#991b1b", label: "Not Covered" },
  not_addressed: { bg: "#f8fafc", border: "#f1f5f9", text: "#64748b", label: "No Data" },
};

function getStatusInfo(entry: any) {
  if (!entry) return COLORS.not_addressed;
  if (entry.coverage_status === "not_covered") return COLORS.not_covered;
  if (entry.is_preferred) return COLORS.preferred;
  if (entry.step_therapy_required) return COLORS.step_therapy;
  if (entry.coverage_status === "covered_with_pa") return COLORS.covered_with_pa;
  if (entry.coverage_status === "covered") return COLORS.covered;
  return COLORS.not_addressed;
}const MOCK_DRUGS = [
  { id: "d1", brand_name: "Keytruda", generic_name: "pembrolizumab", drug_class: "Monoclonal Antibody" },
  { id: "d2", brand_name: "Humira", generic_name: "adalimumab", drug_class: "TNF Inhibitor" },
  { id: "d3", brand_name: "Opdivo", generic_name: "nivolumab", drug_class: "Monoclonal Antibody" },
  { id: "d4", brand_name: "Tecentriq", generic_name: "atezolizumab", drug_class: "Monoclonal Antibody" },
  { id: "d5", brand_name: "Libtayo", generic_name: "cemiplimab", drug_class: "Monoclonal Antibody" },
  { id: "d6", brand_name: "Skyrizi", generic_name: "risankizumab", drug_class: "IL-23 Inhibitor" },
  { id: "d7", brand_name: "Stelara", generic_name: "ustekinumab", drug_class: "IL-12/23 Inhibitor" }
];

const MOCK_COVERAGE: any = {
  "d1": [
    { indication: "Melanoma", payers: { name: "Aetna" }, coverage_status: "covered", is_preferred: true },
    { indication: "NSCLC", payers: { name: "UnitedHealthcare" }, coverage_status: "covered_with_pa", is_preferred: true, prior_auth_required: true, step_therapy_required: true, clinical_criteria: "Failed one prior systemic therapy." },
    { indication: "Head & Neck Cancer", payers: { name: "Cigna" }, coverage_status: "not_covered" },
    { indication: "Breast Cancer (TNBC)", payers: { name: "Aetna Medicare" }, coverage_status: "covered", is_preferred: true },
    { indication: "Renal Cell Carcinoma", payers: { name: "UnitedHealthcare Community Plan" }, coverage_status: "covered_with_pa", prior_auth_required: true }
  ],
  "d2": [
    { indication: "Rheumatoid Arthritis", payers: { name: "UnitedHealthcare" }, coverage_status: "covered", is_preferred: true },
    { indication: "Crohn's Disease", payers: { name: "Aetna" }, coverage_status: "step_therapy", step_therapy_required: true, step_therapy_drugs: ["Methotrexate"] },
    { indication: "Psoriatic Arthritis", payers: { name: "Cigna" }, coverage_status: "covered", is_preferred: true }
  ],
  "d3": [
    { indication: "Melanoma", payers: { name: "UnitedHealthcare" }, coverage_status: "covered", is_preferred: true },
    { indication: "NSCLC", payers: { name: "Aetna" }, coverage_status: "covered_with_pa", prior_auth_required: true },
    { indication: "Hodgkin Lymphoma", payers: { name: "Cigna" }, coverage_status: "covered" }
  ]
};


function DetailPanel({ entry, onClose }: any) {
  if (!entry) return null;
  const status = getStatusInfo(entry);

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "480px", background: "white", boxShadow: "-20px 0 60px rgba(0,0,0,0.05)", zIndex: 1000, display: "flex", flexDirection: "column", animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      
      <div style={{ padding: "32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}`, padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>{status.label}</span>
          </div>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>{entry.indication}</h3>
          <p style={{ margin: "6px 0 0", fontSize: "0.95rem", color: "#64748b", fontWeight: 500 }}>{entry.payers?.name}</p>
        </div>
        <button onClick={onClose} style={{ background: "#f8fafc", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Prior Auth", value: entry.prior_auth_required ? "Required" : "Not Required", icon: <ShieldCheck size={16} />, color: entry.prior_auth_required ? "#f59e0b" : "#10b981" },
            { label: "Step Therapy", value: entry.step_therapy_required ? "Required" : "No", icon: <AlertCircle size={16} />, color: entry.step_therapy_required ? "#f97316" : "#10b981" },
            { label: "Preferred Status", value: entry.is_preferred ? "Preferred" : "Non-Preferred", icon: <TrendingUp size={16} />, color: entry.is_preferred ? "#059669" : "#64748b" },
            { label: "Auth Window", value: entry.approval_duration || "N/A", icon: <Clock size={16} />, color: "#64748b" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", marginBottom: "6px" }}>
                {s.icon}
                <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
              </div>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {entry.step_therapy_drugs && entry.step_therapy_drugs.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Step Therapy Requirements</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {entry.step_therapy_drugs.map((d: any, i: number) => (
                <span key={i} style={{ background: "#f0fdf4", border: "1px solid #dcfce7", color: "#166534", padding: "6px 14px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 }}>{d}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {entry.clinical_criteria && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Clinical Criteria</p>
              <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#475569", lineHeight: 1.7 }}>
                {entry.clinical_criteria}
              </div>
            </div>
          )}

          {entry.exclusions && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Exclusions</p>
              <div style={{ background: "#fef2f2", borderRadius: "16px", padding: "20px", border: "1px solid #fee2e2", fontSize: "0.9rem", color: "#991b1b", lineHeight: 1.7 }}>
                {entry.exclusions}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ padding: "32px", borderTop: "1px solid #f1f5f9" }}>
        <button style={{ width: "100%", background: "#084d38", color: "white", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}>Download Full Payer PDF</button>
      </div>
    </div>
  );
}

export default function CoverageGrid() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [coverage, setCoverage] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const USE_API = true;

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (USE_API) {
        try {
          const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(search)}`);
          const data = await res.json();
          setSuggestions(data);
        } catch { setSuggestions([]); }
      } else {
        const filtered = search.length < 1 
          ? MOCK_DRUGS 
          : MOCK_DRUGS.filter(d => d.brand_name.toLowerCase().includes(search.toLowerCase()) || d.generic_name.toLowerCase().includes(search.toLowerCase()));
        setSuggestions(filtered);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  async function selectDrug(drug: any) {
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

  const payers = [...new Set(coverage.map(e => e.payers?.name))].filter(Boolean);
  const indications = [...new Set(coverage.map(e => e.indication))].filter(Boolean);

  const totalEntries = coverage.length;
  const coveredEntries = coverage.filter(c => c.coverage_status && c.coverage_status !== "not_covered").length;
  const realCoveredRate = totalEntries > 0 ? Math.round((coveredEntries / totalEntries) * 100) + "%" : "0%";

  function getEntry(payer: string, indication: string) {
    return coverage.find(e => e.payers?.name === payer && e.indication === indication);
  }

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1e293b", letterSpacing: "-0.04em", marginBottom: "8px" }}>Coverage Matrix</h1>
        <p style={{ color: "#64748b", fontSize: "1.05rem" }}>Analyze clinical criteria and coverage status across major national payers.</p>
      </div>

      {/* Modern Search Bar */}
      <div style={{ marginBottom: "40px", position: "relative", maxWidth: "640px" }}>
        <div style={{ 
          background: "#f8fafc", 
          borderRadius: "20px", 
          padding: "16px 24px", 
          border: "1px solid #f1f5f9", 
          display: "flex", 
          alignItems: "center", 
          gap: "14px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
          transition: "all 0.2s"
        }} className="focus-within:border-[#084d38] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#084d38]/5">
          <Search size={22} color="#94a3b8" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedDrug(null); }}
            placeholder="Search for a medication (e.g., Keytruda, Opdivo)..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "1.05rem", background: "transparent", color: "#1e293b", fontWeight: 500 }}
          />
          {search && (
            <button onClick={() => { setSearch(""); setSelectedDrug(null); setCoverage([]); setSuggestions([]); }} style={{ background: "#e2e8f0", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><X size={14} /></button>
          )}
        </div>

        {suggestions.length > 0 && !selectedDrug && (
          <div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, width: "100%", background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", padding: "12px", zIndex: 100, animation: "scaleIn 0.2s ease-out" }}>
            {suggestions.map(drug => (
              <button key={drug.id} onClick={() => selectDrug(drug)} style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", padding: "16px", border: "none", background: "transparent", borderRadius: "16px", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#f8fafc"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, color: "#084d38" }}>{drug.brand_name.charAt(0)}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>{drug.brand_name}</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{drug.generic_name} &middot; {drug.drug_class}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", width: "48px", height: "48px", border: "4px solid #f1f5f9", borderTopColor: "#084d38", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ marginTop: "20px", color: "#64748b", fontWeight: 600 }}>Analyzing payer protocols...</p>
        </div>
      ) : selectedDrug ? (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          {/* Drug Info & Stats Card */}
          <div style={{ background: "#084d38", borderRadius: "24px", padding: "2rem", color: "white", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
            <div style={{ zIndex: 1 }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8, marginBottom: "8px" }}>Selected Medication</p>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{selectedDrug.brand_name}</h2>
              <p style={{ fontSize: "1rem", opacity: 0.9, marginTop: "4px" }}>{selectedDrug.generic_name} &middot; {selectedDrug.drug_class}</p>
            </div>
            <div style={{ display: "flex", gap: "24px", zIndex: 1 }}>
              {[
                { label: "Covered Rate", value: realCoveredRate, icon: <ShieldCheck size={20} /> },
                { label: "Active Payers", value: payers.length, icon: <ChevronRight size={20} /> }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end", opacity: 0.7, fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>{stat.icon} {stat.label}</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <Sparkles size={200} style={{ position: "absolute", right: "-40px", bottom: "-60px", opacity: 0.1 }} />
          </div>

          {/* New Grid View */}
          <div style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "20px 32px", textAlign: "left", fontSize: "0.85rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", width: "240px", position: "sticky", left: 0, background: "#f8fafc", zIndex: 20 }}>Payer Network</th>
                    {indications.map((ind, i) => (
                      <th key={i} style={{ padding: "20px", textAlign: "center", fontSize: "0.85rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "180px" }}>{ind}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payers.map((payer: any, pi: number) => (
                    <tr key={pi} className="group">
                      <td style={{ padding: "20px 32px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, color: "#1e293b", fontSize: "1rem", position: "sticky", left: 0, background: "white", zIndex: 10, boxShadow: "4px 0 10px rgba(0,0,0,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", color: "#084d38" }}>{payer.charAt(0)}</div>
                          {payer}
                        </div>
                      </td>
                      {indications.map((ind: any, ii: number) => {
                        const entry = getEntry(payer, ind);
                        const status = getStatusInfo(entry);
                        const cellKey = `${pi}-${ii}`;
                        return (
                          <td key={ii} style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                            <div
                              onClick={() => entry && setSelectedEntry(entry)}
                              onMouseEnter={() => setHoveredCell(cellKey)}
                              onMouseLeave={() => setHoveredCell(null)}
                              style={{
                                background: status.bg,
                                border: `1px solid ${status.border}`,
                                borderRadius: "12px",
                                padding: "14px 10px",
                                cursor: entry ? "pointer" : "default",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: hoveredCell === cellKey ? "translateY(-2px)" : "none",
                                boxShadow: hoveredCell === cellKey ? "0 8px 20px rgba(0,0,0,0.06)" : "none",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px"
                              }}
                            >
                              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: status.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{status.label}</span>
                              {entry?.is_preferred && <div style={{ fontSize: "0.7rem", color: status.text, background: "white", padding: "2px 8px", borderRadius: "100px", fontWeight: 700 }}>PREFILLED</div>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "100px 0", textAlign: "center", background: "#f8fafc", borderRadius: "32px", border: "1px dashed #e2e8f0" }}>
          <div style={{ background: "#f0fdf4", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Filter size={32} color="#084d38" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Begin Your Search</h2>
          <p style={{ color: "#64748b", maxWidth: "420px", margin: "0 auto 24px", lineHeight: 1.6 }}>Start typing a drug name above to analyze its coverage landscape across our high-fidelity policy database.</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {["Keytruda", "Humira", "Opdivo"].map(name => (
              <button key={name} onClick={() => setSearch(name)} style={{ background: "white", border: "1px solid #f1f5f9", padding: "10px 20px", borderRadius: "100px", fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#084d38"} onMouseOut={e => e.currentTarget.style.borderColor = "#f1f5f9"}>{name}</button>
            ))}
          </div>
        </div>
      )}

      {selectedEntry && (
        <>
          <div onClick={() => setSelectedEntry(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.1)", zIndex: 999, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease-out" }} />
          <DetailPanel entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
