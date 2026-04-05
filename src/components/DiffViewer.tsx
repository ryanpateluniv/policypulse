"use client";

import React, { useState, useEffect } from "react";
import { GitCompare, Sparkles, ChevronDown, ArrowRight, AlertCircle } from "lucide-react";
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
  const [documents, setDocuments] = useState<any[]>([]);
  const [doc1, setDoc1] = useState("");
  const [doc2, setDoc2] = useState("");
  const [p1Data, setP1Data] = useState<CoverageEntry[]>([]);
  const [p2Data, setP2Data] = useState<CoverageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [compared, setCompared] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [doc1Label, setDoc1Label] = useState("");
  const [doc2Label, setDoc2Label] = useState("");

  useEffect(() => {
    async function loadDrugs() {
      const { data } = await supabase.from("drugs").select("id, brand_name, generic_name").order("brand_name");
      if (data) setDrugs(data);
    }
    loadDrugs();
  }, []);

  useEffect(() => {
    if (!selectedDrug) { setDocuments([]); return; }
    async function loadDocs() {
      const { data } = await supabase
        .from("coverage_entries")
        .select("policy_document_id, payers(name), policy_documents(title, effective_date, created_at)")
        .eq("drug_id", selectedDrug);
      if (data) {
        const seen = new Set();
        const uniqueDocs = data.filter((d: any) => {
          if (seen.has(d.policy_document_id)) return false;
          seen.add(d.policy_document_id);
          return true;
        }).map((d: any) => ({
          id: d.policy_document_id,
          label: `${d.payers?.name} — ${d.policy_documents?.title || "Untitled"} (${d.policy_documents?.effective_date || "unknown date"})`,
          payer: d.payers?.name,
        }));
        setDocuments(uniqueDocs);
        setDoc1("");
        setDoc2("");
        setCompared(false);
      }
    }
    loadDocs();
  }, [selectedDrug]);

  async function runComparison() {
    if (!selectedDrug || !doc1 || !doc2) return;
    setLoading(true);
    setCompared(false);

    const [res1, res2] = await Promise.all([
      supabase.from("coverage_entries").select("indication, coverage_status, is_preferred, prior_auth_required, step_therapy_required, step_therapy_drugs, clinical_criteria, approval_duration, exclusions, payers(name), drugs(brand_name, generic_name)").eq("drug_id", selectedDrug).eq("policy_document_id", doc1),
      supabase.from("coverage_entries").select("indication, coverage_status, is_preferred, prior_auth_required, step_therapy_required, step_therapy_drugs, clinical_criteria, approval_duration, exclusions, payers(name), drugs(brand_name, generic_name)").eq("drug_id", selectedDrug).eq("policy_document_id", doc2),
    ]);

    const d1 = (res1.data || []) as CoverageEntry[];
    const d2 = (res2.data || []) as CoverageEntry[];
    setP1Data(d1);
    setP2Data(d2);

    const label1 = documents.find(d => d.id === doc1)?.label || "Document A";
    const label2 = documents.find(d => d.id === doc2)?.label || "Document B";
    setDoc1Label(label1);
    setDoc2Label(label2);

    const allInds = [...new Set([...d1, ...d2].map(e => e.indication))];
    let criticalCount = 0, moderateCount = 0;
    const diffs: string[] = [];

    allInds.forEach(ind => {
      const e1 = d1.find(e => e.indication === ind);
      const e2 = d2.find(e => e.indication === ind);
      if (!e1 && e2) { diffs.push(`${ind}: added`); moderateCount++; }
      else if (e1 && !e2) { diffs.push(`${ind}: removed`); criticalCount++; }
      else if (e1 && e2) {
        if (e1.coverage_status !== e2.coverage_status) { diffs.push(`${ind}: status changed`); criticalCount++; }
        if (e1.step_therapy_required !== e2.step_therapy_required) { diffs.push(`${ind}: step therapy changed`); moderateCount++; }
      }
    });

    const drugName = d1[0]?.drugs?.brand_name || d2[0]?.drugs?.brand_name || "this drug";
    if (diffs.length === 0) {
      setAiSummary(`No differences found between the two policy versions for ${drugName}.`);
    } else {
      setAiSummary(`PulseAI detected ${diffs.length} change${diffs.length > 1 ? "s" : ""} between policy versions for ${drugName}. ${criticalCount > 0 ? `${criticalCount} critical (coverage added/removed). ` : ""}${moderateCount > 0 ? `${moderateCount} moderate (criteria or step therapy changes). ` : ""}Review below.`);
    }

    setLoading(false);
    setCompared(true);
  }

  const allIndications = [...new Set([...p1Data, ...p2Data].map(e => e.indication))].sort();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#084d38", marginBottom: "10px", background: "#f0fdf4", padding: "6px 14px", borderRadius: "100px", border: "1px solid #dcfce7" }}>
          <GitCompare size={14} />
          <span style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Policy Diff</span>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", margin: "0 0 10px" }}>Policy Difference Viewer</h1>
        <p style={{ color: "#64748b", fontSize: "1rem", margin: 0, maxWidth: "520px", lineHeight: 1.6 }}>
          Compare old vs new policy versions or different payers for the same drug — see exactly what changed.
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", padding: "1.8rem 2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1.2rem", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Drug</label>
            <div style={{ position: "relative" }}>
              <select value={selectedDrug} onChange={e => { setSelectedDrug(e.target.value); setCompared(false); }}
                style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", fontWeight: 600, color: selectedDrug ? "#0f172a" : "#94a3b8", background: "white", cursor: "pointer", appearance: "none", outline: "none" }}>
                <option value="">— Select Drug —</option>
                {drugs.map(d => (<option key={d.id} value={d.id}>{d.brand_name} ({d.generic_name})</option>))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Older Policy</label>
            <div style={{ position: "relative" }}>
              <select value={doc1} onChange={e => { setDoc1(e.target.value); setCompared(false); }} disabled={!selectedDrug}
                style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, color: doc1 ? "#0f172a" : "#94a3b8", background: !selectedDrug ? "#f8fafc" : "white", cursor: !selectedDrug ? "not-allowed" : "pointer", appearance: "none", outline: "none", opacity: !selectedDrug ? 0.6 : 1 }}>
                <option value="">— Select Document —</option>
                {documents.filter(d => d.id !== doc2).map(d => (<option key={d.id} value={d.id}>{d.label}</option>))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Newer Policy</label>
            <div style={{ position: "relative" }}>
              <select value={doc2} onChange={e => { setDoc2(e.target.value); setCompared(false); }} disabled={!selectedDrug}
                style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, color: doc2 ? "#0f172a" : "#94a3b8", background: !selectedDrug ? "#f8fafc" : "white", cursor: !selectedDrug ? "not-allowed" : "pointer", appearance: "none", outline: "none", opacity: !selectedDrug ? 0.6 : 1 }}>
                <option value="">— Select Document —</option>
                {documents.filter(d => d.id !== doc1).map(d => (<option key={d.id} value={d.id}>{d.label}</option>))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            </div>
          </div>

          <button onClick={runComparison} disabled={!selectedDrug || !doc1 || !doc2}
            style={{
              background: selectedDrug && doc1 && doc2 ? "#084d38" : "#e2e8f0",
              color: selectedDrug && doc1 && doc2 ? "white" : "#94a3b8",
              padding: "14px 28px", borderRadius: "14px", border: "none", fontWeight: 700,
              cursor: selectedDrug && doc1 && doc2 ? "pointer" : "not-allowed",
              fontSize: "0.95rem", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px",
              boxShadow: selectedDrug && doc1 && doc2 ? "0 4px 14px rgba(8,77,56,0.25)" : "none",
              transition: "all 0.2s"
            }}>
            <GitCompare size={17} /> Compare
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", width: "48px", height: "48px", border: "4px solid #f1f5f9", borderTopColor: "#084d38", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ marginTop: "20px", color: "#64748b", fontWeight: 600 }}>Comparing policy versions...</p>
        </div>
      )}

      {compared && !loading && (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
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

          <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "200px" }}>Indication</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.7rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "220px" }}>{doc1Label}</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.8rem", fontWeight: 700, borderBottom: "1px solid #f1f5f9", width: "40px", color: "#94a3b8" }}></th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.7rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "220px" }}>{doc2Label}</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9", minWidth: "100px" }}>Status</th>
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
                    const added = !e1 && e2;
                    const removed = e1 && !e2;

                    return (
                      <tr key={i} style={{ background: mismatch ? "#fffbeb" : added ? "#f0fdf4" : removed ? "#fef2f2" : "transparent" }}>
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
                          {(mismatch || added || removed) ? <AlertCircle size={16} color="#f59e0b" /> : <ArrowRight size={14} color="#d1d5db" />}
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
                          {mismatch && <span style={{ background: "#fee2e2", color: "#991b1b", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>CHANGED</span>}
                          {added && <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>ADDED</span>}
                          {removed && <span style={{ background: "#fee2e2", color: "#991b1b", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>REMOVED</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {allIndications.filter(ind => {
            const e1 = p1Data.find(e => e.indication === ind);
            const e2 = p2Data.find(e => e.indication === ind);
            return (e1 && e2 && (e1.coverage_status !== e2.coverage_status || e1.step_therapy_required !== e2.step_therapy_required)) || (!e1 && e2) || (e1 && !e2);
          }).length > 0 && (
            <div style={{ marginTop: "1.8rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={18} color="#f59e0b" /> Key Changes
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {allIndications.filter(ind => {
                  const e1 = p1Data.find(e => e.indication === ind);
                  const e2 = p2Data.find(e => e.indication === ind);
                  return (e1 && e2 && (e1.coverage_status !== e2.coverage_status || e1.step_therapy_required !== e2.step_therapy_required)) || (!e1 && e2) || (e1 && !e2);
                }).slice(0, 10).map((ind, i) => {
                  const e1 = p1Data.find(e => e.indication === ind);
                  const e2 = p2Data.find(e => e.indication === ind);
                  return (
                    <div key={i} style={{ background: "white", borderRadius: "16px", border: "1px solid #fef3c7", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>{ind}</p>
                        {!e1 && e2 && <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>NEW</span>}
                        {e1 && !e2 && <span style={{ background: "#fee2e2", color: "#991b1b", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>REMOVED</span>}
                        {e1 && e2 && <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>MODIFIED</span>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ background: e1 ? "#fef2f2" : "#f8fafc", borderRadius: "12px", padding: "14px", borderLeft: "3px solid #fca5a5" }}>
                          <p style={{ margin: "0 0 8px", fontSize: "0.7rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase" }}>Old Policy</p>
                          {e1 ? (<>
                            <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#1e293b" }}>Status: <strong>{getStatus(e1).label}</strong></p>
                            {e1.clinical_criteria && <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{e1.clinical_criteria.substring(0, 150)}{e1.clinical_criteria.length > 150 ? "..." : ""}</p>}
                          </>) : <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>Not in old policy</p>}
                        </div>
                        <div style={{ background: e2 ? "#f0fdf4" : "#f8fafc", borderRadius: "12px", padding: "14px", borderLeft: "3px solid #86efac" }}>
                          <p style={{ margin: "0 0 8px", fontSize: "0.7rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>New Policy</p>
                          {e2 ? (<>
                            <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#1e293b" }}>Status: <strong>{getStatus(e2).label}</strong></p>
                            {e2.clinical_criteria && <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{e2.clinical_criteria.substring(0, 150)}{e2.clinical_criteria.length > 150 ? "..." : ""}</p>}
                          </>) : <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>Removed in new policy</p>}
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

      {!compared && !loading && (
        <div style={{ padding: "100px 0", textAlign: "center", background: "#f8fafc", borderRadius: "32px", border: "1px dashed #e2e8f0" }}>
          <div style={{ background: "#f0fdf4", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <GitCompare size={32} color="#084d38" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Compare Policy Versions</h2>
          <p style={{ color: "#64748b", maxWidth: "420px", margin: "0 auto", lineHeight: 1.6 }}>
            Select a drug, then pick two policy documents to compare. See exactly what changed between versions — added indications, removed coverage, and modified criteria.
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
