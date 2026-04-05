"use client";

import React, { useState } from "react";
import { Upload, FileText, ArrowRight, Activity, ShieldCheck, CheckCircle2, AlertCircle, FilePlus, Sparkles, Navigation, Search, CheckCircle, XCircle } from "lucide-react";

export default function DashboardOverview({ user, greeting, setActiveTab, uploadedDocs }: any) {

  return (
    <>
      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1e293b", margin: "0 0 8px 0", letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span>{greeting}, {user?.name || "Developer"}</span>
            <Activity strokeWidth={3} size={32} color="#10b981" />
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748b", margin: 0, fontWeight: 500 }}>
            Here is your daily policy intelligence briefing.
          </p>
        </div>
        
        {/* Dynamic Header Metrics */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "white", border: "1px solid #f1f5f9", padding: "10px 16px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} color="#10b981" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111" }}>{uploadedDocs.length || 0}</span>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Policies</span>
            </div>
            <div style={{ width: "1px", height: "16px", background: "#e2e8f0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={16} color="#3b82f6" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111" }}>{new Set(uploadedDocs.map((d: any) => d.payer).filter(Boolean)).size || 0}</span>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Payers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Row: Hero + News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        
        {/* Hero Card - Live Real-Time Feed */}
        <div className="lg:col-span-2" style={{
          background: "linear-gradient(135deg, #084d38 0%, #0a5f45 100%)",
          borderRadius: "20px",
          padding: "2rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(8, 77, 56, 0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
              <div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", animation: "pulse 2s infinite" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Intelligence Feed</span>
            </div>
            
            {uploadedDocs && uploadedDocs.length > 0 ? (
              <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.2rem", letterSpacing: "-0.01em" }}>
                  Intelligence updated for <span style={{ color: "#86efac" }}>{uploadedDocs[0].payer || "a major payer"}</span>.
                </h2>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1.5rem" }}>
                   <div style={{ background: "rgba(0,0,0,0.12)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                     <span style={{ fontSize: "0.65rem", color: "#a7f3d0", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "4px" }}>Medications Detected</span>
                     <span style={{ fontSize: "1.4rem", fontWeight: 800 }}>{uploadedDocs[0].drugs_found || 0}</span>
                   </div>
                   <div style={{ background: "rgba(0,0,0,0.12)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                     <span style={{ fontSize: "0.65rem", color: "#a7f3d0", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "4px" }}>Coverage Rules Mapped</span>
                     <span style={{ fontSize: "1.4rem", fontWeight: 800 }}>{uploadedDocs[0].coverage_entries || 0}</span>
                   </div>
                   <div style={{ background: "rgba(0,0,0,0.12)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                     <span style={{ fontSize: "0.65rem", color: "#a7f3d0", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "4px" }}>Status</span>
                     <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                       <CheckCircle2 size={18} /> Analyzed
                     </span>
                   </div>
                </div>

                <div style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)", padding: "12px 16px", borderLeft: "4px solid #86efac", borderRadius: "0 10px 10px 0", marginBottom: "1.5rem", maxWidth: "700px" }}>
                  <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.95, lineHeight: 1.5 }}>
                    PulseAI has successfully processed <strong>{uploadedDocs[0].name}</strong> as of <em>{uploadedDocs[0].date}</em>. 
                    The underlying coverage matrix has been updated with the latest clinical criteria and prior authorization requirements.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                  Awaiting real-time policy data.
                </h2>
                <p style={{ fontSize: "1.05rem", opacity: 0.9, maxWidth: "600px", lineHeight: 1.6 }}>
                  Upload a document in the Vault to immediately see live intelligence extraction and alerts feed here.
                </p>
              </div>
            )}
            
            <button
              onClick={() => setActiveTab(uploadedDocs && uploadedDocs.length > 0 ? "audit" : "vault")}
              style={{
                marginTop: "0.5rem",
                background: "white",
                color: "#084d38",
                border: "none",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {uploadedDocs && uploadedDocs.length > 0 ? "View Automated Audit" : "Upload File to Vault"} <ArrowRight size={16} />
            </button>
          </div>
          <div style={{ position: "absolute", right: "-50px", bottom: "-50px", opacity: 0.05 }}>
            <Activity size={300} />
          </div>
          <style>{`
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
              100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* Top Alerts / News Component (Compact) */}
        <div className="lg:col-span-1" style={{
          background: "white",
          borderRadius: "20px",
          padding: "1.5rem",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Watermark Logo */}
          <Sparkles size={160} style={{ position: "absolute", right: "-30px", top: "-20px", color: "#fef3c7", opacity: 0.4, pointerEvents: "none" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.2rem", position: "relative", zIndex: 1 }}>
            <Activity size={18} color="#d97706" />
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>Top Regulatory News</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
            {[
              { 
                tag: "FDA Decision", 
                title: "New Alzheimer's Monoclonal Antibody",
                desc: "Accelerated approval granted. CMS expected to issue NCD soon.",
                color: "#2563eb", bg: "#eff6ff",
                link: "https://www.fda.gov/news-events/press-announcements/fda-grants-accelerated-approval-alzheimers-disease-treatment"
              },
              { 
                tag: "CMS Update", 
                title: "Part D Out-of-Pocket Cap",
                desc: "$2,000 OOP limit taking effect. Payers adjusting tierings.",
                color: "#16a34a", bg: "#f0fdf4",
                link: "https://www.cms.gov/newsroom/press-releases/cms-announces-new-medicare-part-d-out-pocket-cap"
              }
            ].map((news, i) => (
              <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", padding: "1rem", borderRadius: "12px", background: "#f8fafc", border: "1px solid #f1f5f9", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = news.color} onMouseOut={e => e.currentTarget.style.borderColor = "#f1f5f9"}>
                <span style={{ display: "inline-block", background: news.bg, color: news.color, padding: "2px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>{news.tag}</span>
                <h4 style={{ margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>{news.title}</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", lineHeight: 1.4 }}>{news.desc}</p>
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: news.color, fontWeight: 600 }}>
                  Read Citation <Navigation size={10} />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Lower Row Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Card 2: Coverage Overview (Chart Redesign) */}
        <div style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          borderRadius: "24px",
          padding: "2rem",
          border: "1px solid #dcfce7",
          boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "#dcfce7", padding: "8px", borderRadius: "10px" }}>
                <ShieldCheck size={20} color="#10b981" />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>Coverage Summary</span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Across all payers</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {/* SVG Donut Chart */}
            <div style={{ position: "relative", width: "120px", height: "120px" }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%" }}>
                {/* Background Ring */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                {/* Covered (65%) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="65, 100" />
                {/* PA Required (25%) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="25, 100" strokeDashoffset="-65" />
                {/* Not Covered (10%) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="10, 100" strokeDashoffset="-90" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", lineHeight: 1 }}>65%</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Covered</span>
              </div>
            </div>

            {/* Legends */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} /><span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Covered</span></div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>184</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} /><span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>PA Required</span></div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>72</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} /><span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Not Covered</span></div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>28</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Quick Insights (Redesign) */}
        <div style={{
          background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
          borderRadius: "24px",
          padding: "2rem",
          border: "1px solid #dbeafe",
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "#dbeafe", padding: "8px", borderRadius: "10px" }}>
                <Sparkles size={20} color="#3b82f6" />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>PulseAI Quick Look</span>
            </div>
          </div>
          {uploadedDocs.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {uploadedDocs.slice(0, 2).map((doc: any, i: number) => (
                <div key={i} style={{ padding: "16px", borderRadius: "16px", background: "white", border: "1px solid #bfdbfe", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.05)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "#3b82f6" }} />
                  <span style={{ fontWeight: 800, color: "#1e3a8a", display: "block", marginBottom: "4px", fontSize: "1rem" }}>{doc.payer}</span>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 12px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3b82f6" }}>{doc.coverage_entries || 0}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Entries</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", borderRadius: "12px", background: "white", border: "1px dashed #bfdbfe" }}>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>Upload documents in the Vault to see AI insights here.</p>
            </div>
          )}
        </div>

        {/* Card 4: Recent Alerts — real data from uploaded docs */}
        <div className="md:col-span-2" style={{
          background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
          borderRadius: "24px",
          padding: "2rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)"
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
              {uploadedDocs.map((doc: any, i: number) => (
                <div key={i} style={{ padding: "1.5rem", borderRadius: "20px", background: "white", border: "1px solid #e2e8f0", borderTop: "4px solid #10b981", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>{doc.payer || "Unknown Payer"}</span>
                    <span style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", background: "#f1f5f9", padding: "4px 8px", borderRadius: "100px" }}>{doc.date}</span>
                  </div>
                  <p style={{ color: "#10b981", background: "#ecfdf5", display: "inline-block", padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, margin: "0 0 12px" }}>{doc.status}</p>
                  <p style={{ fontSize: "0.9rem", color: "#475569", margin: "0 0 16px", lineHeight: 1.5, wordBreak: "break-word", fontWeight: 500 }}>{doc.name}</p>
                  
                  <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{doc.drugs_found || 0} drugs detected</span>
                    <span style={{ fontSize: "0.75rem", color: "#084d38", fontWeight: 700, background: "#dcfce7", padding: "4px 8px", borderRadius: "6px" }}>{doc.coverage_entries || 0} mapping entries</span>
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
