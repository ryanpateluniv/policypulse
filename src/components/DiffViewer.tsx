"use client";

import React, { useState, useEffect } from "react";
import { Search, Globe, RefreshCcw, Sparkles, AlertCircle, FileCheck, ExternalLink, ArrowRight, ShieldAlert } from "lucide-react";

export default function MarketMonitor() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheck, setLastCheck] = useState("2026-04-03 09:45 AM");
  const [results, setResults] = useState<any>(null);

  const performAudit = async () => {
    setIsScanning(true);
    setResults(null);
    
    // Simulate real-time web crawling and policy analysis
    await new Promise(r => setTimeout(r, 2500));
    
    setResults({
      status: "changes_detected",
      summary: "PulseAI detected several modifications in publicly available medical policies across Aetna and Cigna. These changes primarily affect prior authorization windows and clinical trial requirements for PD-1 inhibitors.",
      updates: [
        { 
          source: "Aetna (Clinical Policy Bulletin)", 
          policy_id: "CPB 0884", 
          title: "Oncology Drug Policy: Keytruda", 
          change_type: "Strictness Increase", 
          impact: "Prior Auth required for all adjuvant settings now.", 
          date_detected: "Today, 10:15 AM",
          severity: "high"
        },
        { 
          source: "Cigna Medical Policy", 
          policy_id: "MP6652", 
          title: "Pembrolizumab (Keytruda)", 
          change_type: "Criteria Update", 
          impact: "New biosimilar trial requirement for NSCLC combination therapy.", 
          date_detected: "Yesterday",
          severity: "medium"
        }
      ]
    });
    setLastCheck(new Date().toLocaleString());
    setIsScanning(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#084d38", marginBottom: "8px" }}>
            <Globe size={18} />
            <span style={{ fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Market Monitoring</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", margin: 0 }}>Policy Intelligence Audit</h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem", marginTop: "8px" }}>Detecting discrepancies between internal data and public payer guidelines.</p>
        </div>
        
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>LAST SYSTEM-WIDE SYNC: {lastCheck}</p>
          <button 
            onClick={performAudit}
            disabled={isScanning}
            style={{ 
              background: "#084d38", 
              color: "white", 
              padding: "12px 24px", 
              borderRadius: "12px", 
              border: "none", 
              fontWeight: 700, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              boxShadow: "0 4px 12px rgba(8, 77, 56, 0.2)",
              transition: "transform 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <RefreshCcw size={18} className={isScanning ? "animate-spin" : ""} />
            {isScanning ? "Running Market Audit..." : "Check for Updates"}
          </button>
        </div>
      </header>

      {isScanning && (
        <div style={{ padding: "80px 0", textAlign: "center", background: "white", borderRadius: "32px", border: "1px solid #f1f5f9" }}>
          <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 32px" }}>
            <div style={{ position: "absolute", inset: 0, border: "4px solid #f1f5f9", borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: 0, border: "4px solid transparent", borderTopColor: "#084d38", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={40} color="#084d38" className="animate-pulse" />
            </div>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>PulseAI is Crawling Market Data</h2>
          <p style={{ color: "#64748b", maxWidth: "420px", margin: "12px auto 0", lineHeight: 1.6 }}>Scanning CPBs, Payer Newsroom, and Federal Registries for oncology protocol deviations...</p>
        </div>
      )}

      {!isScanning && !results && (
        <div style={{ padding: "100px 0", textAlign: "center", background: "#f8fafc", borderRadius: "32px", border: "1.5px dashed #e2e8f0" }}>
          <div style={{ background: "white", width: "80px", height: "80px", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 10px 20px rgba(0,0,0,0.02)" }}>
            <ShieldAlert size={32} color="#084d38" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>Audit System Ready</h2>
          <p style={{ color: "#64748b", maxWidth: "400px", margin: "12px auto 0" }}>Perform a manual audit to compare your uploaded library with the latest public regulatory changes.</p>
        </div>
      )}

      {results && (
        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
          {/* AI Intelligence Card */}
          <div style={{ background: "#f0fdf4", borderRadius: "32px", padding: "2.5rem", marginBottom: "3rem", border: "1px solid #dcfce7", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <Sparkles size={22} color="#084d38" />
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#084d38", textTransform: "uppercase", letterSpacing: "0.05em" }}>Market Intelligence Summary</span>
              </div>
              <p style={{ fontSize: "1.2rem", fontWeight: 500, color: "#064e3b", lineHeight: 1.6, maxWidth: "90%" }}>
                {results.summary}
              </p>
            </div>
            <Sparkles size={180} style={{ position: "absolute", right: "-20px", bottom: "-40px", opacity: 0.1, color: "#084d38" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {results.updates.map((upd: any, i: number) => (
              <div key={i} style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", padding: "2rem", display: "flex", alignItems: "center", gap: "2rem", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#084d38"}>
                <div style={{ 
                  width: "64px", 
                  height: "64px", 
                  borderRadius: "18px", 
                  background: upd.severity === "high" ? "#fef2f2" : "#fffbeb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: upd.severity === "high" ? "#ef4444" : "#f59e0b"
                }}>
                  <AlertCircle size={28} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "#64748b", opacity: 0.8 }}>{upd.source} &middot; {upd.policy_id}</span>
                    <span style={{ 
                      fontSize: "0.65rem", 
                      fontWeight: 800, 
                      textTransform: "uppercase", 
                      padding: "4px 10px", 
                      borderRadius: "100px",
                      background: upd.severity === "high" ? "#fecaca" : "#fef3c7",
                      color: upd.severity === "high" ? "#991b1b" : "#92400e"
                    }}>
                      {upd.change_type}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#1e293b" }}>{upd.title}</h3>
                  <p style={{ margin: "10px 0 0", color: "#475569", fontSize: "0.95rem", fontWeight: 500 }}>
                    <ArrowRight size={16} color="#084d38" style={{ display: "inline", marginRight: "8px" }} />
                    {upd.impact}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, marginBottom: "12px" }}>DETECTED {upd.date_detected.toUpperCase()}</div>
                  <button style={{ background: "transparent", border: "1px solid #e2e8f0", padding: "10px 18px", borderRadius: "10px", color: "#1e293b", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                    Compare Docs <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", padding: "2rem", background: "#f8fafc", borderRadius: "24px", border: "1.5px solid #f1f5f9", textAlign: "center" }}>
             <FileCheck size={32} color="#10b981" style={{ marginBottom: "12px" }} />
             <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>All other policies are currently up to date.</p>
             <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#64748b" }}>Next automated market sweep in 4 hours.</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
