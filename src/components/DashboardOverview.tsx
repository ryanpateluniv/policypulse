"use client";

import React from "react";
import { Clock, CheckCircle2, Activity, TrendingUp, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

interface DashboardOverviewProps {
  user: any;
  greeting: string;
  setActiveTab: (tab: string) => void;
  uploadedDocs?: any[];
}

export default function DashboardOverview({ user, greeting, setActiveTab, uploadedDocs = [] }: DashboardOverviewProps) {
  return (
    <>
      {/* Greeting */}
      <section>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6b7280"
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", marginTop: "-0.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              marginLeft: "-4px"
            }}
          >
            {greeting}, {user?.given_name || user?.name || "Developers"}.
          </h1>

          {/* Unified Header Metrics Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "24px",
              padding: "10px 20px",
              background: "#f9fafb",
              borderRadius: "100px",
              border: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={16} color="#6b7280" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111" }}>12.4 hrs</span>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Saved</span>
            </div>
            <div style={{ height: "16px", width: "1px", background: "#e5e7eb" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111" }}>284</span>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Policies</span>
            </div>
            <div style={{ height: "16px", width: "1px", background: "#e5e7eb" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={16} color="#3b82f6" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111" }}>3</span>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Payers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* Hero Card - Market Trends */}
        <div className="md:col-span-2" style={{
          background: "linear-gradient(135deg, #084d38 0%, #0a5f45 100%)",
          borderRadius: "24px",
          padding: "2.5rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(8, 77, 56, 0.15)"
        }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
              <TrendingUp size={20} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Market Intelligence</span>
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
              Market access shifting for PD-1 inhibitors in NSCLC.
            </h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "600px", lineHeight: 1.6 }}>
              PulseAI detected 3 major policy updates this morning from Aetna and UHC affecting oncology coverage.
            </p>
            <button
              onClick={() => setActiveTab("coverage")}
              style={{
                marginTop: "2rem",
                background: "white",
                color: "#084d38",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Analyze Coverage Changes <ArrowRight size={18} />
            </button>
          </div>
          <div style={{
            position: "absolute",
            right: "-50px",
            bottom: "-50px",
            opacity: 0.1
          }}>
            <Sparkles size={300} />
          </div>
        </div>

        {/* Card 2: Coverage Overview (Moved up) */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "1.5rem",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "#f0fdf4", padding: "8px", borderRadius: "10px" }}>
                <ShieldCheck size={20} color="#10b981" />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>Coverage Summary</span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Across all payers</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Covered", count: 184, color: "#10b981", percent: 65 },
              { label: "PA Required", count: 72, color: "#f59e0b", percent: 25 },
              { label: "Not Covered", count: 28, color: "#ef4444", percent: 10 },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#374151", fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.count}</span>
                </div>
                <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${item.percent}%`, height: "100%", background: item.color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Quick Insights */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "1.5rem",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "#eff6ff", padding: "8px", borderRadius: "10px" }}>
                <Sparkles size={20} color="#3b82f6" />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>PulseAI Quick Look</span>
            </div>
          </div>
          {uploadedDocs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {uploadedDocs.slice(0, 2).map((doc, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: "12px", background: "#f8fafc", fontSize: "0.85rem", color: "#475569", border: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: 700, color: "#1e293b", display: "block", marginBottom: "4px" }}>{doc.payer}</span>
                  {doc.name} &mdash; {doc.coverage_entries || 0} entries
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", borderRadius: "12px", background: "#f8fafc", border: "1px dashed #e2e8f0" }}>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>Upload documents in the Vault to see AI insights here.</p>
              <button onClick={() => setActiveTab("vault")} style={{ marginTop: "10px", background: "#084d38", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Go to Vault</button>
            </div>
          )}
        </div>

        {/* Card 4: Recent Alerts — real data from uploaded docs */}
        <div className="md:col-span-2" style={{
          background: "white",
          borderRadius: "24px",
          padding: "2rem",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "#fff1f2", padding: "8px", borderRadius: "10px" }}>
                <AlertCircle size={20} color="#f43f5e" />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1.2rem" }}>Uploaded Policy Library</span>
            </div>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Documents from Vault</span>
          </div>
          {uploadedDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedDocs.map((doc, i) => (
                <div key={i} style={{ padding: "1.2rem", borderRadius: "16px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{doc.payer || "Unknown Payer"}</span>
                    <span style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>{doc.date}</span>
                  </div>
                  <p style={{ color: "#084d38", fontSize: "0.85rem", fontWeight: 600, margin: "0 0 6px" }}>{doc.status}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>{doc.name}</p>
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 600 }}>{doc.drugs_found || 0} drugs &middot; {doc.coverage_entries || 0} entries</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <ShieldCheck size={36} color="#d1d5db" style={{ marginBottom: "12px" }} />
              <p style={{ color: "#94a3b8", fontWeight: 600, margin: 0 }}>No documents uploaded yet.</p>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "6px" }}>Upload policy PDFs in the Vault to see them here.</p>
              <button onClick={() => setActiveTab("vault")} style={{ marginTop: "16px", background: "#084d38", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Open Vault</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
