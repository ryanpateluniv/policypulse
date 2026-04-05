"use client";

import React, { useState, useEffect } from "react";
import { GitCompare, Sparkles, ChevronDown, ArrowRight, ShieldCheck, AlertCircle, Clock, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CoverageEntry {
  indication: string;
  coverage_status: string;
  is_preferred: boolean;
  prior_auth_required: boolean;
  step_therapy_required: boolean;
  step_therapy_drugs: string[];
  clinical_criteria: string;
  approval_duration: string;
  exclusions: string;
  payers: { name: string };
  drugs: { brand_name: string; generic_name: string };
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  covered: { bg: "#dcfce7", text: "#166534", label: "Covered" },
  covered_with_pa: { bg: "#fef3c7", text: "#92400e", label: "PA Required" },
  not_covered: { bg: "#fee2e2", text: "#991b1b", label: "Not Covered" },
  not_addressed: { bg: "#f1f5f9", text: "#64748b", label: "No Data" },
};

function getStatus(entry: CoverageEntry | undefined) {
  if (!entry) return statusColors.not_addressed;
  if (entry.step_therapy_required) return { bg: "#ffedd5", text: "#9a3412", label: "Step Therapy" };
  return statusColors[entry.coverage_status] || statusColors.not_addressed;
}

export default function PolicyDiffViewer() {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState("");
  const [payer1, setPayer1] = useState("");
  const [payer2, setPayer2] = useState("");
  const [payers, setPayers] = useState<string[]>([]);
  const [coverage, setCoverage] = useState<CoverageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [compared, setCompared] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [searchDrug, setSearchDrug] = useState("");

  // Load drugs on mount
  useEffect(() => {
    async function loadDrugs() {
      const { data } = await supabase.from("drugs").select("id, brand_name, generic_name").order("brand_name");
      if (data) setDrugs(data);
    }
    loadDrugs();
  }, []);

  // Load payers when drug is selected
  useEffect(() => {
    if (!selectedDrug) { setPayers([]); return; }
    async function loadPayers() {
      const { data } = await supabase
        .from("coverage_entries")
        .select("payers(name)")
        .eq("drug_id", selectedDrug);
      if (data) {
        const uniquePayers = [...new Set(data.map((d: any) => d.payers?.name).filter(Boolean))];
        setPayers(uniquePayers);
        setPayer1("");
        setPayer2("");
      }
    }
    loadPayers();
  }, [selectedDrug]);

  async function runComparison() {
    if (!selectedDrug || !payer1 || !payer2) return;
    setLoading(true);
    setCompared(false);

    const { data } = await supabase
      .from("coverage_entries")
      .select(`
        indication, coverage_status, is_preferred, prior_auth_required,
        step_therapy_required, step_therapy_drugs, clinical_criteria,
        approval_duration, exclusions,
        payers(name),
        drugs(brand_name, generic_name)
      `)
      .eq("drug_id", selectedDrug);

    if (data) {
      setCoverage(data as CoverageEntry[]);

      // Generate AI summary
      const p1Entries = data.filter((e: any) => e.payers?.name === payer1);
      const p2Entries = data.filter((e: any) => e.payers?.name === payer2);

      const diffs: string[] = [];
      const allIndications = [...new Set([...p1Entries, ...p2Entries].map((e: any) => e.indication))];

      let criticalCount = 0;
      let moderateCount = 0;

      allIndications.forEach(ind => {
        const e1 = p1Entries.find((e: any) => e.indication === ind);
        const e2 = p2Entries.find((e: any) => e.indication === ind);
        if (!e1 && e2) { diffs.push(`${ind}: only in ${payer2}`); moderateCount++; }
        else if (e1 && !e2) { diffs.push(`${ind}: only in ${payer1}`); moderateCount++; }
        else if (e1 && e2) {
          if (e1.coverage_status !== e2.coverage_status) {
            diffs.push(`${ind}: ${payer1} = ${e1.coverage_status}, ${payer2} = ${e2.coverage_status}`);
            criticalCount++;
          }
          if (e1.step_therapy_required !== e2.step_therapy_required) {
            diffs.push(`${ind}: step therapy differs`);
            moderateCount++;
          }
        }
      });

      const drugName = data[0]?.drugs?.brand_name || "this drug";
      if (diffs.length === 0) {
        setAiSummary(`${payer1} and ${payer2} have identical coverage policies for ${drugName} across all indications.`);
      } else {
        setAiSummary(`PulseAI detected ${diffs.length} difference${diffs.length > 1 ? "s" : ""} between ${payer1} and ${payer2} for ${drugName}. ${criticalCount > 0 ? `${criticalCount} critical (coverage status differences). ` : ""}${moderateCount > 0 ? `${moderateCount} moderate (step therapy or availability differences). ` : ""}Review the comparison below for details.`);
      }
    }

    setLoading(false);
    setCompared(true);
  }

  const p1Data = coverage.filter(e => e.payers?.name === payer1);
  const p2Data = coverage.filter(e => e.payers?.name === payer2);
  const allIndications = [...new Set(coverage.map(e => e.indication))].sort();
  const drugName = drugs.find(d => d.id === selectedDrug)?.brand_name || "";

  const filteredDrugs = searchDrug.length >= 1
    ? drugs.filter(d => d.brand_name.toLowerCase().includes(searchDrug.toLowerCase()))
    : drugs;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#084d38", marginBottom: "10px", background: "#f0fdf4", padding: "6px 14px", borderRadius: "100px", border: "1px solid #dcfce7" }}>
          <GitCompare size={14} />
          <span style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Payer Comparison</span>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", margin: "0 0 10px" }}>Policy Difference Viewer</h1>
        <p style={{ color: "#64748b", fontSize: "1rem", margin: 0, maxWidth: "520px", lineHeight: 1.6 }}>
          Compare how different payers cover the same drug — see where coverage, prior auth, and step therapy requirements differ.
        </p>
      </div>

      {/* Selection Bar */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", padding: "1.8rem 2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1.2rem", alignItems: "flex-end" }}>
          {/* Drug Select */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Drug</label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedDrug}
                onChange={e => { setSelectedDrug(e.target.value); setCompared(false); }}
                style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", fontWeight: 600, color: selectedDrug ? "#0f172a" : "#94a3b8", background: "white", cursor: "pointer", appearance: "none", outline: "none" }}
              >
                <option value="">— Select Drug —</option>
                {drugs.map(d => (
                  <option key={d.id} value={d.id}>{d.brand_name} ({d.generic_name})</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Payer 1 */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Payer A</label>
            <div style={{ position: "relative" }}>
              <select
                value={payer1}
                onChange={e => { setPayer1(e.target.value); setCompared(false); }}
                disabled={!selectedDrug}
                style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", fontWeight: 600, color: payer1 ? "#0f172a" : "#94a3b8", background: !selectedDrug ? "#f8fafc" : "white", cursor: !selectedDrug ? "not-allowed" : "pointer", appearance: "none", outline: "none", opacity: !selectedDrug ? 0.6 : 1 }}
              >
                <option value="">— Select Payer —</option>
                {payers.filter(p => p !== payer2).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Payer 2 */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Payer B</label>
            <div style={{ position: "relative" }}>
              <select
                value={payer2}
                onChange={e => { setPayer2(e.target.value); setCompared(false); }}
                disabled={!selectedDrug}
                style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", fontWeight: 600, color: payer2 ? "#0f172a" : "#94a3b8", background: !selectedDrug ? "#f8fafc" : "white", cursor: !selectedDrug ? "not-allowed" : "pointer", appearance: "none", outline: "none", opacity: !selectedDrug ? 0.6 : 1 }}
              >
                <option value="">— Select Payer —</option>
                {payers.filter(p => p !== payer1).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Compare Button */}
          <button
            onClick={runComparison}
            disabled={!selectedDrug || !payer1 || !payer2}
            style={{
              background: selectedDrug && payer1 && payer2 ? "#084d38" : "#e2e8f0",
              color: selectedDrug && payer1 && payer2 ? "white" : "#94a3b8",
              padding: "14px 28px", borderRadius: "14px", border: "none", fontWeight: 700,
              cursor: selectedDrug && payer1 && payer2 ? "pointer" : "not-allowed",
              fontSize: "0.95rem", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px",
              boxShadow: selectedDrug && payer1 && payer2 ? "0 4px 14px rgba(8,77,56,0.25)" : "none",
              transition: "all 0.2s"
            }}
          >
            <GitCompare size={17} /> Compare
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", width: "48px", height: "48px", border: "4px solid #f1f5f9", borderTopColor: "#084d38", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ marginTop: "20px", color: "#64748b", fontWeight: 600 }}>Comparing payer policies...</p>
        </div>
      )}

      {/* Results */}
      {compared && !loading && (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          {/* AI Summary */}
          <div style={{ background: "linear-gradient(135deg, #084d38 0%, #0a5f45 100%)", borderRadius: "20px", padding: "2rem 2.2rem", marginBottom: "1.8rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", opacity: 0.85 }}>
                <Sparkles size={16} color="white" />
                <span style={{ fontWeight: 800, fontSize: "0.72rem", color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>PulseAI Analysis</span>
              </div>
              <p style={{ fontSize: "1.05rem", color: "white", margin: 0, lineHeight: 1.65, maxWidth: "80%" }}>{aiSummary}</p>
            </div>
            <Sparkles size={200} style={{ position: "absolute", right: "-30px", bottom: "-50px", opacity: 0.07, color: "white" }} />
          </div>

          {/* Comparison Table */}
          <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "200px" }}>Indication</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "220px" }}>{payer1}</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.8rem", fontWeight: 700, borderBottom: "1px solid #f1f5f9", width: "40px", color: "#94a3b8" }}></th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "220px" }}>{payer2}</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "100px" }}>Match?</th>
                  </tr>
                </thead>
                <tbody>
                  {allIndications.map((ind, i) => {
                    const e1 = p1Data.find(e => e.indication === ind);
                    const e2 = p2Data.find(e => e.indication === ind);
                    const s1 = getStatus(e1);
                    const s2 = getStatus(e2);
                    const match = e1 && e2 && e1.coverage_status === e2.coverage_status && e1.step_therapy_required === e2.step_therapy_required;
                    const mismatch = e1 && e2 && (e1.coverage_status !== e2.coverage_status || e1.step_therapy_required !== e2.step_therapy_required);

                    return (
                      <tr key={i} style={{ background: mismatch ? "#fffbeb" : "transparent" }}>
                        <td style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{ind}</td>
                        <td style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            <span style={{ background: s1.bg, color: s1.text, padding: "4px 14px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700 }}>{s1.label}</span>
                            {e1?.step_therapy_drugs?.length > 0 && (
                              <span style={{ fontSize: "0.7rem", color: "#9a3412" }}>Try: {e1.step_therapy_drugs.join(", ").substring(0, 40)}</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                          {mismatch ? <AlertCircle size={16} color="#f59e0b" /> : <ArrowRight size={14} color="#d1d5db" />}
                        </td>
                        <td style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            <span style={{ background: s2.bg, color: s2.text, padding: "4px 14px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700 }}>{s2.label}</span>
                            {e2?.step_therapy_drugs?.length > 0 && (
                              <span style={{ fontSize: "0.7rem", color: "#9a3412" }}>Try: {e2.step_therapy_drugs.join(", ").substring(0, 40)}</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                          {match && <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>MATCH</span>}
                          {mismatch && <span style={{ background: "#fee2e2", color: "#991b1b", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>DIFF</span>}
                          {(!e1 || !e2) && <span style={{ background: "#f1f5f9", color: "#64748b", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>N/A</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Cards for Mismatches */}
          {allIndications.filter(ind => {
            const e1 = p1Data.find(e => e.indication === ind);
            const e2 = p2Data.find(e => e.indication === ind);
            return e1 && e2 && (e1.coverage_status !== e2.coverage_status || e1.step_therapy_required !== e2.step_therapy_required);
          }).length > 0 && (
            <div style={{ marginTop: "1.8rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={18} color="#f59e0b" /> Key Differences
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {allIndications.filter(ind => {
                  const e1 = p1Data.find(e => e.indication === ind);
                  const e2 = p2Data.find(e => e.indication === ind);
                  return e1 && e2 && (e1.coverage_status !== e2.coverage_status || e1.step_therapy_required !== e2.step_therapy_required);
                }).map((ind, i) => {
                  const e1 = p1Data.find(e => e.indication === ind)!;
                  const e2 = p2Data.find(e => e.indication === ind)!;
                  return (
                    <div key={i} style={{ background: "white", borderRadius: "16px", border: "1px solid #fef3c7", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                      <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>{ind}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px" }}>
                          <p style={{ margin: "0 0 8px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{payer1}</p>
                          <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#1e293b" }}>Status: <strong>{getStatus(e1).label}</strong></p>
                          {e1.clinical_criteria && <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{e1.clinical_criteria.substring(0, 150)}{e1.clinical_criteria.length > 150 ? "..." : ""}</p>}
                          {e1.step_therapy_drugs?.length > 0 && <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#9a3412" }}>Step therapy: {e1.step_therapy_drugs.join(", ")}</p>}
                        </div>
                        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px" }}>
                          <p style={{ margin: "0 0 8px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{payer2}</p>
                          <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#1e293b" }}>Status: <strong>{getStatus(e2).label}</strong></p>
                          {e2.clinical_criteria && <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{e2.clinical_criteria.substring(0, 150)}{e2.clinical_criteria.length > 150 ? "..." : ""}</p>}
                          {e2.step_therapy_drugs?.length > 0 && <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#9a3412" }}>Step therapy: {e2.step_therapy_drugs.join(", ")}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!compared && !loading && (
        <div style={{ padding: "100px 0", textAlign: "center", background: "#f8fafc", borderRadius: "32px", border: "1px dashed #e2e8f0" }}>
          <div style={{ background: "#f0fdf4", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <GitCompare size={32} color="#084d38" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Compare Payer Policies</h2>
          <p style={{ color: "#64748b", maxWidth: "420px", margin: "0 auto", lineHeight: 1.6 }}>
            Select a drug and two payers above to see exactly how their coverage policies differ — coverage status, step therapy, prior auth, and clinical criteria side by side.
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
