"use client";

import React, { useState } from "react";
import { GitCompare, ArrowRight, Sparkles, AlertCircle, CheckCircle2, ChevronRight, FileText } from "lucide-react";

interface DiffViewerProps {
  documents: any[];
}

export default function DiffViewer({ documents }: DiffViewerProps) {
  const [doc1, setDoc1] = useState("");
  const [doc2, setDoc2] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompare = async () => {
    if (!doc1 || !doc2) return;
    setIsComparing(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setResult({
      summary: "Significant changes detected in PD-1 inhibitor criteria. Step therapy requirements have been added for Keytruda in NSCLC. Prior authorization window for melanoma treatment has been extended from 12 to 24 months.",
      changes: [
        { drug: "Keytruda", indication: "Non-small cell lung cancer", type: "modified", field: "step_therapy", old: "None", new: "Required (2 biosimilars)" },
        { drug: "Opdivo", indication: "Adjuvant Melanoma", type: "modified", field: "auth_duration", old: "12 months", new: "24 months" },
        { drug: "Stelara", indication: "Plaque Psoriasis", type: "added", field: "coverage", old: "Not covered", new: "Covered with PA" },
        { drug: "Humira", indication: "Rheumatoid Arthritis", type: "removed", field: "preference", old: "Preferred", new: "Non-preferred" }
      ]
    });
    setIsComparing(false);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Document Difference</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Compare policy updates and see exactly what changed in patient access protocols.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        {/* Selector Cards */}
        <div style={{ background: "white", borderRadius: "24px", padding: "2rem", border: "1px solid #f1f5f9", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Previous Version</p>
          <select 
            value={doc1} 
            onChange={(e) => setDoc1(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none", background: "#f8fafc" }}
          >
            <option value="">Select Document...</option>
            {documents.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>

        <div style={{ background: "white", borderRadius: "24px", padding: "2rem", border: "1px solid #f1f5f9", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Current Version</p>
          <select 
            value={doc2} 
            onChange={(e) => setDoc2(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none", background: "#f8fafc" }}
          >
            <option value="">Select Document...</option>
            {documents.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <button 
          onClick={handleCompare}
          disabled={!doc1 || !doc2 || isComparing}
          style={{ 
            background: isComparing ? "#94a3b8" : "#084d38", 
            color: "white", 
            padding: "16px 48px", 
            borderRadius: "16px", 
            border: "none", 
            fontWeight: 700, 
            fontSize: "1.1rem", 
            cursor: "pointer", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "12px", 
            boxShadow: "0 10px 30px rgba(8, 77, 56, 0.2)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => !isComparing && (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => !isComparing && (e.currentTarget.style.transform = "translateY(0)")}
        >
          {isComparing ? "Analyzing Change Matrix..." : <><GitCompare size={20} /> Run PulseAI Comparison</>}
        </button>
      </div>

      {result && (
        <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
          {/* AI Summary Card */}
          <div style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "32px", padding: "2.5rem", marginBottom: "3rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                <Sparkles size={20} color="#084d38" />
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#084d38", textTransform: "uppercase", letterSpacing: "0.05em" }}>PulseAI Change Summary</span>
              </div>
              <p style={{ fontSize: "1.2rem", color: "#166534", lineHeight: 1.6, fontWeight: 500 }}>
                {result.summary}
              </p>
            </div>
            <div style={{ position: "absolute", right: "-30px", bottom: "-30px", opacity: 0.1 }}>
              <Sparkles size={200} color="#084d38" />
            </div>
          </div>

          {/* Detailed Changes Table */}
          <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>Specific Protocol Adjustments</h3>
            </div>
            <div>
              {result.changes.map((change: any, i: number) => (
                <div key={i} style={{ padding: "1.5rem 2rem", borderBottom: i < result.changes.length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ 
                        fontSize: "0.65rem", 
                        fontWeight: 800, 
                        textTransform: "uppercase", 
                        padding: "4px 8px", 
                        borderRadius: "6px",
                        background: change.type === "added" ? "#dcfce7" : change.type === "removed" ? "#fee2e2" : "#fef3c7",
                        color: change.type === "added" ? "#166534" : change.type === "removed" ? "#991b1b" : "#92400e",
                        letterSpacing: "0.05em"
                      }}>
                        {change.type}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>{change.drug}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{change.indication}</p>
                  </div>

                  <div style={{ flex: 2, display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ flex: 1, padding: "10px", background: "#f8fafc", borderRadius: "10px", fontSize: "0.85rem", color: "#64748b" }}>
                      <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", opacity: 0.6, marginBottom: "2px" }}>Previous</span>
                      {change.old}
                    </div>
                    <ArrowRight size={18} color="#94a3b8" />
                    <div style={{ flex: 1, padding: "10px", background: "#f0fdf4", borderRadius: "10px", fontSize: "0.85rem", color: "#084d38", fontWeight: 600 }}>
                      <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", opacity: 0.6, marginBottom: "2px" }}>Current</span>
                      {change.new}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
