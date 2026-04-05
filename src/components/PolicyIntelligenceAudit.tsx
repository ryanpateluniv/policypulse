"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ArrowRight,
  GitCompare,
  MinusCircle,
  PlusCircle,
  Info,
} from "lucide-react";

interface DiffEntry {
  field: string;
  oldValue: string;
  newValue: string;
  severity: "high" | "medium" | "low";
  changeType: "added" | "removed" | "modified";
}

const payers = ["Aetna", "UHC", "Cigna"];

const drugs: Record<string, string[]> = {
  Aetna: ["Keytruda", "Opdivo", "Tecentriq", "Yervoy"],
  UHC: ["Keytruda", "Opdivo", "Incivek", "Sofosbuvir"],
  Cigna: ["Keytruda", "Tecentriq", "Pembrolizumab biosimilar", "Atezolizumab"],
};

const mockPolicies: Record<string, Record<string, any>> = {
  Aetna_Keytruda: {
    older: {
      "Prior Auth Required": "No",
      Indications: "NSCLC, Melanoma",
      Criteria: "First-line or after chemo with PD-L1 ≥1%",
      "Clinical Trial": "Optional",
      "Maximum Duration": "24 months",
      Coverage: "80%",
    },
    newer: {
      "Prior Auth Required": "Yes",
      Indications: "NSCLC, Melanoma, Gastric Cancer",
      Criteria: "All indications require prior auth for adjuvant settings",
      "Clinical Trial": "Required for off-label use",
      "Maximum Duration": "Unlimited",
      Coverage: "90%",
    },
  },
  Cigna_Keytruda: {
    older: {
      "Prior Auth Required": "No",
      Indications: "NSCLC, Melanoma",
      Criteria: "Standard coverage for approved indications",
      "Clinical Trial": "Not required",
      "Maximum Duration": "36 months",
      Coverage: "75%",
    },
    newer: {
      "Prior Auth Required": "Yes",
      Indications: "NSCLC, Melanoma, Nasopharyngeal Carcinoma",
      Criteria: "Biosimilar trial required for NSCLC combination therapy",
      "Clinical Trial": "Mandatory for new indications",
      "Maximum Duration": "24 months",
      Coverage: "75%",
    },
  },
  UHC_Keytruda: {
    older: {
      "Prior Auth Required": "Yes",
      Indications: "NSCLC, Melanoma",
      Criteria: "PD-L1 ≥1%, second-line after platinum therapy",
      "Clinical Trial": "Encouraged",
      "Maximum Duration": "18 months",
      Coverage: "85%",
    },
    newer: {
      "Prior Auth Required": "Yes",
      Indications: "NSCLC, Melanoma, Head & Neck Cancer",
      Criteria: "Now preferred as first-line for NSCLC with PD-L1 ≥50%",
      "Clinical Trial": "Required for new indications",
      "Maximum Duration": "24 months",
      Coverage: "88%",
    },
  },
};

const severityConfig = {
  high: { bg: "#fef2f2", color: "#dc2626", badgeBg: "#fee2e2", label: "HIGH" },
  medium: { bg: "#fffbeb", color: "#d97706", badgeBg: "#fef3c7", label: "MEDIUM" },
  low: { bg: "#eff6ff", color: "#2563eb", badgeBg: "#dbeafe", label: "LOW" },
};

function generateMockFullText(data: any): string[] {
  if (!data) return [];
  return `POLICY DOCUMENT: COMPLIANCE GUIDELINE
===========================================

INDICATIONS COVERED:
${data["Indications"] || ""}

CLINICAL CRITERIA:
${data["Criteria"] || ""}

PRIOR AUTHORIZATION REQUIRED:
${data["Prior Auth Required"] || ""}

CLINICAL TRIAL REQUIREMENTS:
${data["Clinical Trial"] || ""}

MAXIMUM TREATMENT DURATION:
${data["Maximum Duration"] || ""}

COVERAGE RATIO LIMIT:
${data["Coverage"] || ""}
`.split('\n');
}

function StyledSelect({
  value,
  onChange,
  disabled,
  children,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "14px 44px 14px 16px",
          borderRadius: "14px",
          border: "1.5px solid #e2e8f0",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: value ? "#0f172a" : "#94a3b8",
          background: disabled ? "#f8fafc" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          opacity: disabled ? 0.6 : 1,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#084d38";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,77,56,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        style={{
          position: "absolute",
          right: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#94a3b8",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function PolicyIntelligenceAudit() {
  const [selectedPayer, setSelectedPayer] = useState("");
  const [selectedDrug, setSelectedDrug] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [diffData, setDiffData] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [entries, setEntries] = useState<DiffEntry[]>([]);

  const handlePayerChange = (payer: string) => {
    setSelectedPayer(payer);
    setSelectedDrug("");
    setShowDiff(false);
  };

  const performComparison = () => {
    if (!selectedPayer || !selectedDrug) return;

    const key = `${selectedPayer}_${selectedDrug}`;
    const policyData = mockPolicies[key];

    if (!policyData) {
      setDiffData(null);
      setEntries([]);
      setAiSummary("");
      setShowDiff(true);
      return;
    }

    const { older, newer } = policyData;
    const diffs: DiffEntry[] = [];

    Object.keys(older).forEach((field) => {
      if (older[field] !== newer[field]) {
        let severity: "high" | "medium" | "low" = "low";
        if (field === "Prior Auth Required" && newer[field] === "Yes" && older[field] === "No") severity = "high";
        else if (field === "Clinical Trial" && newer[field] !== older[field]) severity = "high";
        else if (field === "Maximum Duration") severity = "medium";
        else if (field === "Coverage" && parseFloat(newer[field]) < parseFloat(older[field])) severity = "medium";

        diffs.push({ field, oldValue: older[field], newValue: newer[field], severity, changeType: "modified" });
      }
    });

    // check for added keys in newer
    Object.keys(newer).forEach((field) => {
      if (!(field in older)) {
        diffs.push({ field, oldValue: "—", newValue: newer[field], severity: "medium", changeType: "added" });
      }
    });

    setEntries(diffs);
    setDiffData({ older, newer });

    const highCount = diffs.filter((d) => d.severity === "high").length;
    const midCount = diffs.filter((d) => d.severity === "medium").length;
    setAiSummary(
      `${selectedPayer} updated its ${selectedDrug} coverage policy. PulseAI detected ${diffs.length} change${diffs.length !== 1 ? "s" : ""}: ${
        highCount > 0 ? `${highCount} critical (prior auth or trial modifications)` : ""
      }${highCount > 0 && midCount > 0 ? ", " : ""}${
        midCount > 0 ? `${midCount} moderate (duration or coverage shifts)` : ""
      }. Review highlighted fields carefully before updating patient access workflows.`
    );
    setShowDiff(true);
  };

  const highCount = entries.filter((e) => e.severity === "high").length;
  const medCount = entries.filter((e) => e.severity === "medium").length;
  const lowCount = entries.filter((e) => e.severity === "low").length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 0" }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            color: "#084d38",
            marginBottom: "10px",
            background: "#f0fdf4",
            padding: "6px 14px",
            borderRadius: "100px",
            border: "1px solid #dcfce7",
          }}
        >
          <GitCompare size={14} />
          <span style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Policy Difference
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.04em",
            margin: "0 0 10px 0",
            lineHeight: 1.1,
          }}
        >
          Policy Difference Viewer
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem", margin: 0, maxWidth: "520px", lineHeight: 1.6 }}>
          Compare two policy versions side by side and see exactly what changed — like code differences, but for drug coverage.
        </p>
      </header>

      {/* ── Selection Bar ── */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #f1f5f9",
          padding: "1.8rem 2rem",
          marginBottom: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: "1.2rem",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: "8px",
              }}
            >
              Payer
            </label>
            <StyledSelect value={selectedPayer} onChange={handlePayerChange} placeholder="Select Payer">
              <option value="">— Select Payer —</option>
              {payers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </StyledSelect>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: "8px",
              }}
            >
              Drug
            </label>
            <StyledSelect
              value={selectedDrug}
              onChange={setSelectedDrug}
              disabled={!selectedPayer}
              placeholder="Select Drug"
            >
              <option value="">— Select Drug —</option>
              {selectedPayer &&
                drugs[selectedPayer]?.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </StyledSelect>
          </div>

          <button
            onClick={performComparison}
            disabled={!selectedPayer || !selectedDrug}
            style={{
              background: selectedPayer && selectedDrug ? "#084d38" : "#e2e8f0",
              color: selectedPayer && selectedDrug ? "white" : "#94a3b8",
              padding: "14px 28px",
              borderRadius: "14px",
              border: "none",
              fontWeight: 700,
              cursor: selectedPayer && selectedDrug ? "pointer" : "not-allowed",
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: selectedPayer && selectedDrug ? "0 4px 14px rgba(8,77,56,0.25)" : "none",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              selectedPayer && selectedDrug && (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <GitCompare size={17} />
            Compare
          </button>
        </div>
      </div>

      {/* ── Diff Results ── */}
      {showDiff && (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          {/* No data state */}
          {!diffData ? (
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "5rem 2rem",
                textAlign: "center",
                border: "1.5px dashed #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "#fffbeb",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <AlertCircle size={28} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
                Only one policy version found
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: "380px", margin: "0 auto" }}>
                Upload another version to compare. Go to Policy Vault to add the second document.
              </p>
            </div>
          ) : (
            <>
              {/* AI Summary Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #084d38 0%, #0a5f45 100%)",
                  borderRadius: "20px",
                  padding: "2rem 2.2rem",
                  marginBottom: "1.8rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                      opacity: 0.85,
                    }}
                  >
                    <Sparkles size={16} color="white" />
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      PulseAI · Change Summary
                    </span>
                  </div>
                  <p style={{ fontSize: "1.05rem", color: "white", margin: 0, lineHeight: 1.65, maxWidth: "80%" }}>
                    {aiSummary}
                  </p>

                  {/* Severity pills */}
                  <div style={{ display: "flex", gap: "10px", marginTop: "1.2rem", flexWrap: "wrap" }}>
                    {highCount > 0 && (
                      <span
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          color: "white",
                          padding: "5px 14px",
                          borderRadius: "100px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        🔴 {highCount} HIGH
                      </span>
                    )}
                    {medCount > 0 && (
                      <span
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          color: "white",
                          padding: "5px 14px",
                          borderRadius: "100px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        🟡 {medCount} MEDIUM
                      </span>
                    )}
                    {lowCount > 0 && (
                      <span
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          color: "white",
                          padding: "5px 14px",
                          borderRadius: "100px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        🔵 {lowCount} LOW
                      </span>
                    )}
                  </div>
                </div>
                <Sparkles
                  size={200}
                  style={{ position: "absolute", right: "-30px", bottom: "-50px", opacity: 0.07, color: "white" }}
                />
              </div>

              {/* Side-by-side diff */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.2rem",
                  marginBottom: "1.8rem",
                }}
              >
                {/* Older Policy Column */}
                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    border: "1px solid #fecaca",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#fef2f2",
                      padding: "1.2rem 1.5rem",
                      borderBottom: "1px solid #fecaca",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MinusCircle size={18} color="#dc2626" />
                    <div>
                      <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Older Policy
                      </p>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#7f1d1d", fontWeight: 600 }}>
                        {selectedPayer} · {selectedDrug}
                      </p>
                    </div>
                    <TrendingDown size={16} color="#dc2626" style={{ marginLeft: "auto" }} />
                  </div>
                  <div style={{ padding: "0", background: "white", overflowX: "auto" }}>
                    <pre style={{ margin: 0, padding: "16px", fontFamily: '"Menlo", "Monaco", monospace', fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {generateMockFullText(diffData.older).map((line, i) => {
                        const newLines = generateMockFullText(diffData.newer);
                        const changed = newLines.length > i && line !== newLines[i];
                        return (
                          <div key={i} style={{ 
                            background: changed ? "#fef2f2" : "transparent", 
                            color: changed ? "#dc2626" : "#334155", 
                            padding: "0 8px", 
                            textDecoration: changed ? "line-through" : "none" 
                          }}>
                            {line || " "}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>

                {/* Newer Policy Column */}
                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    border: "1px solid #86efac",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#f0fdf4",
                      padding: "1.2rem 1.5rem",
                      borderBottom: "1px solid #86efac",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <PlusCircle size={18} color="#16a34a" />
                    <div>
                      <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Newer Policy
                      </p>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#14532d", fontWeight: 600 }}>
                        {selectedPayer} · {selectedDrug}
                      </p>
                    </div>
                    <TrendingUp size={16} color="#16a34a" style={{ marginLeft: "auto" }} />
                  </div>
                  <div style={{ padding: "0", background: "white", overflowX: "auto" }}>
                    <pre style={{ margin: 0, padding: "16px", fontFamily: '"Menlo", "Monaco", monospace', fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {generateMockFullText(diffData.newer).map((line, i) => {
                        const oldLines = generateMockFullText(diffData.older);
                        const changed = oldLines.length > i && line !== oldLines[i];
                        return (
                          <div key={i} style={{ 
                            background: changed ? "#f0fdf4" : "transparent", 
                            color: changed ? "#16a34a" : "#334155", 
                            padding: "0 8px" 
                          }}>
                            {line || " "}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Change Severity Breakdown */}
              {entries.length > 0 && (
                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    border: "1px solid #f1f5f9",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      padding: "1.3rem 1.8rem",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          background: "#f0fdf4",
                          padding: "8px",
                          borderRadius: "10px",
                        }}
                      >
                        <Info size={18} color="#084d38" />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>
                        Change Severity Breakdown
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    >
                      {entries.length} field{entries.length !== 1 ? "s" : ""} changed
                    </span>
                  </div>

                  <div style={{ padding: "1.2rem 1.8rem", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {entries.map((entry, idx) => {
                      const cfg = severityConfig[entry.severity];
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.2rem",
                            padding: "1.1rem 1.3rem",
                            background: cfg.bg,
                            borderRadius: "14px",
                            border: `1px solid ${cfg.color}22`,
                            transition: "transform 0.15s",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(4px)")}
                          onMouseOut={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                        >
                          {/* Severity dot */}
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: cfg.badgeBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <span style={{ fontSize: "0.7rem", fontWeight: 900, color: cfg.color }}>
                              {cfg.label.charAt(0)}
                            </span>
                          </div>

                          {/* Field + values */}
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 5px", fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                              {entry.field}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span
                                style={{
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  color: "#dc2626",
                                  background: "#fee2e2",
                                  padding: "3px 10px",
                                  borderRadius: "6px",
                                  fontFamily: "monospace",
                                }}
                              >
                                {entry.oldValue}
                              </span>
                              <ArrowRight size={14} color="#94a3b8" />
                              <span
                                style={{
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  color: "#16a34a",
                                  background: "#dcfce7",
                                  padding: "3px 10px",
                                  borderRadius: "6px",
                                  fontFamily: "monospace",
                                }}
                              >
                                {entry.newValue}
                              </span>
                            </div>
                          </div>

                          {/* Severity badge */}
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              padding: "5px 14px",
                              borderRadius: "100px",
                              background: cfg.badgeBg,
                              color: cfg.color,
                              whiteSpace: "nowrap",
                              border: `1px solid ${cfg.color}33`,
                            }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
