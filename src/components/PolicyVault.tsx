"use client";

import React from "react";
import { Plus, FileText, Sparkles, Download } from "lucide-react";

interface PolicyVaultProps {
  uploadedDocs: any[];
  setUploadedDocs: (docs: any[]) => void;
  selectedDoc: any;
  setSelectedDoc: (doc: any) => void;
}

export default function PolicyVault({ uploadedDocs, setUploadedDocs, selectedDoc, setSelectedDoc }: PolicyVaultProps) {
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em" }}>Policy Vault</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Secure storage and AI summary for your health policy documents.</p>
        </div>
        <button 
          onClick={() => {
            const newDoc = { 
              name: `New Policy Update ${new Date().toLocaleTimeString()}.pdf`, 
              size: "1.2 MB", 
              date: "Just now",
              status: "Processing"
            };
            setUploadedDocs([newDoc, ...uploadedDocs]);
          }}
          style={{ background: "#084d38", color: "white", border: "none", borderRadius: "10px", padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Upload Document
        </button>
      </div>

      {/* Card Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadedDocs.map((doc, i) => (
          <div key={i} style={{ 
            background: "white", 
            borderRadius: "24px", 
            padding: "1.5rem", 
            border: "1px solid #f1f5f9", 
            display: "flex", 
            flexDirection: "column",
            transition: "all 0.2s",
            cursor: "pointer",
            position: "relative",
            animation: doc.date === "Just now" ? "fadeInUp 0.4s ease-out" : "none"
          }} className="hover:shadow-xl hover:-translate-y-1 group" onClick={() => setSelectedDoc(doc)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <FileText size={24} color="#084d38" />
              </div>
              <span style={{ 
                background: doc.status === "Analyzed" ? "#dcfce7" : "#fef3c7", 
                color: doc.status === "Analyzed" ? "#166534" : "#92400e", 
                padding: "4px 12px", 
                borderRadius: "100px", 
                fontSize: "0.75rem", 
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.02em"
              }}>
                {doc.status || "Processing"}
              </span>
            </div>
            
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: "0 0 4px", lineHeight: 1.4 }}>{doc.name}</h3>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 1.5rem" }}>{doc.size} &middot; {doc.date}</p>
            
            <div style={{ marginTop: "auto", display: "flex", gap: "10px", paddingTop: "1.2rem", borderTop: "1px solid #f8fafc" }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                style={{ 
                  flex: 1, 
                  background: "#084d38", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "10px", 
                  padding: "10px", 
                  fontSize: "0.85rem", 
                  fontWeight: 600, 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <Sparkles size={14} /> Preview AI
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                style={{ 
                  width: "40px", 
                  height: "40px", 
                  background: "#f8fafc", 
                  border: "1px solid #f1f5f9", 
                  borderRadius: "10px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  cursor: "pointer", 
                  color: "#94a3b8" 
                }}
                className="hover:border-[#084d38] hover:text-[#084d38]"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Immersive Modal for Preview */}
      {selectedDoc && (
        <div 
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: "rgba(0, 0, 0, 0.4)", 
            backdropFilter: "blur(8px)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={() => setSelectedDoc(null)}
        >
          <div 
            style={{ 
              background: "white", 
              width: "90%", 
              maxWidth: "600px", 
              borderRadius: "32px", 
              padding: "2.5rem", 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
              animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedDoc(null)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "#f3f4f6", border: "none", width: "40px", height: "40px", borderRadius: "50%", fontSize: "1.5rem", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              &times;
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "12px" }}>
                <FileText size={24} color="#084d38" />
              </div>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>Document Analysis</h2>
                <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: 0 }}>{selectedDoc.name}</p>
              </div>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "2rem", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <Sparkles size={20} color="#084d38" />
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>PulseAI Insight</span>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#475569", margin: "0 0 1.5rem" }}>
                This policy update includes <strong>critical changes to PD-1 inhibitor access</strong>. 
                PulseAI has identified that step therapy now requires a trial of at least 2 biosimilars before access to biologics.
              </p>
              <div style={{ paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.05em" }}>Policy Highlights</p>
                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    "Step therapy requirement updated",
                    "Prior Authorization window: 12 months",
                    "Supporting labs required for enrollment"
                  ].map((t, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "#1e293b", fontWeight: 500 }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", marginTop: "7px" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div style={{ marginTop: "2rem", display: "flex", gap: "12px" }}>
              <button 
                onClick={() => setSelectedDoc(null)}
                style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: "12px", padding: "14px", fontSize: "1rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
              >
                Close Preview
              </button>
              <button style={{ flex: 1, background: "#084d38", border: "none", borderRadius: "12px", padding: "14px", fontSize: "1rem", fontWeight: 600, color: "white", cursor: "pointer" }}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
