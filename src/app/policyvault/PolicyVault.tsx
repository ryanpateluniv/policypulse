"use client";

import React, { useEffect } from "react";
import { Plus, FileText, Sparkles, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PolicyVaultProps {
  uploadedDocs: any[];
  setUploadedDocs: (docs: any[]) => void;
  selectedDoc: any;
  setSelectedDoc: (doc: any) => void;
}

export default function PolicyVault({ uploadedDocs, setUploadedDocs, selectedDoc, setSelectedDoc }: PolicyVaultProps) {

  // Load existing documents from Supabase on mount
  useEffect(() => {
    async function loadDocs() {
      const { data } = await supabase
        .from('policy_documents')
        .select('*, payers(name)')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // For each doc, also get coverage entry count
        const docs = await Promise.all(data.map(async (doc: any) => {
          const { count } = await supabase
            .from('coverage_entries')
            .select('*', { count: 'exact', head: true })
            .eq('policy_document_id', doc.id);

          // Get unique drugs count for this document
          const { data: drugEntries } = await supabase
            .from('coverage_entries')
            .select('drug_id')
            .eq('policy_document_id', doc.id);

          const uniqueDrugs = new Set(drugEntries?.map((e: any) => e.drug_id) || []);

          return {
            name: doc.title || 'Untitled',
            size: '-',
            date: new Date(doc.created_at).toLocaleDateString(),
            status: doc.status === 'parsed' ? 'Analyzed' : doc.status === 'error' ? 'Error' : 'Processing',
            payer: doc.payers?.name || 'Unknown',
            drugs_found: uniqueDrugs.size,
            coverage_entries: count || 0,
            parsed_data: null,
            document_id: doc.id,
          };
        }));
        setUploadedDocs(docs);
      }
    }
    loadDocs();
  }, []);

  async function handleUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const payer = prompt('Enter payer name exactly:\n\nAetna\nUnitedHealthcare\nCigna\nAetna Medicare\nUnitedHealthcare Community Plan');
      if (!payer) return;

      const tempDoc = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        date: 'Just now',
        status: 'Processing',
        payer: payer,
        drugs_found: 0,
        coverage_entries: 0,
        parsed_data: null as any,
      };
      const newDocs = [tempDoc, ...uploadedDocs];
      setUploadedDocs(newDocs);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('payer', payer);

      try {
        const res = await fetch('/api/documents/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          tempDoc.status = 'Analyzed';
          tempDoc.drugs_found = data.drugs_found;
          tempDoc.coverage_entries = data.coverage_entries;
          tempDoc.parsed_data = data.parsed_data;
          setUploadedDocs([tempDoc, ...uploadedDocs]);
        } else {
          tempDoc.status = 'Error';
          setUploadedDocs([tempDoc, ...uploadedDocs]);
        }
      } catch {
        tempDoc.status = 'Error';
        setUploadedDocs([tempDoc, ...uploadedDocs]);
      }
    };
    input.click();
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em" }}>Policy Vault</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Secure storage and AI summary for your health policy documents.</p>
        </div>
        <button
          onClick={handleUpload}
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
                background: doc.status === "Analyzed" ? "#dcfce7" : doc.status === "Error" ? "#fecaca" : "#fef3c7",
                color: doc.status === "Analyzed" ? "#166534" : doc.status === "Error" ? "#991b1b" : "#92400e",
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
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 0.5rem" }}>{doc.size} &middot; {doc.date}</p>

            {/* Real data badges */}
            {doc.status === "Analyzed" && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1rem" }}>
                <span style={{ background: "#f0fdf4", color: "#166534", padding: "3px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #bbf7d0" }}>
                  {doc.drugs_found} drugs
                </span>
                <span style={{ background: "#eff6ff", color: "#1e40af", padding: "3px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #bfdbfe" }}>
                  {doc.coverage_entries} entries
                </span>
                {doc.payer && (
                  <span style={{ background: "#f5f3ff", color: "#5b21b6", padding: "3px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #ddd6fe" }}>
                    {doc.payer}
                  </span>
                )}
              </div>
            )}

            {/* Processing spinner */}
            {doc.status === "Processing" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <div style={{ width: "16px", height: "16px", border: "2px solid #e5e7eb", borderTopColor: "#084d38", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>PulseAI is analyzing...</span>
              </div>
            )}

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
              maxWidth: "650px",
              borderRadius: "32px",
              padding: "2.5rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
              animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              maxHeight: "90vh",
              overflowY: "auto",
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

            {/* Quick stats bar */}
            {selectedDoc.status === "Analyzed" && (
              <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ flex: 1, background: "#f0fdf4", borderRadius: "14px", padding: "14px", textAlign: "center", border: "1px solid #bbf7d0" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#166534", margin: 0 }}>{selectedDoc.drugs_found}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "2px 0 0", fontWeight: 600 }}>Drugs Found</p>
                </div>
                <div style={{ flex: 1, background: "#eff6ff", borderRadius: "14px", padding: "14px", textAlign: "center", border: "1px solid #bfdbfe" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e40af", margin: 0 }}>{selectedDoc.coverage_entries}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "2px 0 0", fontWeight: 600 }}>Coverage Entries</p>
                </div>
                <div style={{ flex: 1, background: "#f5f3ff", borderRadius: "14px", padding: "14px", textAlign: "center", border: "1px solid #ddd6fe" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#5b21b6", margin: 0 }}>{selectedDoc.payer?.charAt(0) || "?"}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "2px 0 0", fontWeight: 600 }}>{selectedDoc.payer || "Unknown"}</p>
                </div>
              </div>
            )}

            <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "2rem", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <Sparkles size={20} color="#084d38" />
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>PulseAI Insight</span>
              </div>

              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#475569", margin: "0 0 1.5rem" }}>
                {selectedDoc.parsed_data ? (
                  <>
                    PulseAI extracted <strong>{selectedDoc.drugs_found} drugs</strong> and{' '}
                    <strong>{selectedDoc.coverage_entries} coverage entries</strong> from{' '}
                    <strong>{selectedDoc.payer}</strong>&apos;s policy.
                    {selectedDoc.parsed_data.document_title && (
                      <> Document: <em>{selectedDoc.parsed_data.document_title}</em>.</>
                    )}
                    {selectedDoc.parsed_data.effective_date && (
                      <> Effective date: <strong>{selectedDoc.parsed_data.effective_date}</strong>.</>
                    )}
                  </>
                ) : selectedDoc.status === "Analyzed" ? (
                  <>
                    PulseAI analyzed this document and found{' '}
                    <strong>{selectedDoc.drugs_found} drugs</strong> with{' '}
                    <strong>{selectedDoc.coverage_entries} coverage entries</strong> from{' '}
                    <strong>{selectedDoc.payer}</strong>.
                  </>
                ) : selectedDoc.status === "Processing" ? (
                  'PulseAI is currently analyzing this document. This usually takes 30-60 seconds...'
                ) : selectedDoc.status === "Error" ? (
                  'There was an error processing this document. Please try uploading again.'
                ) : (
                  'No analysis data available yet.'
                )}
              </p>

              <div style={{ paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.05em" }}>
                  {selectedDoc.parsed_data?.drugs?.length > 0 ? "Drugs Extracted" : "Policy Highlights"}
                </p>

                {selectedDoc.parsed_data?.drugs?.length > 0 ? (
                  <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {selectedDoc.parsed_data.drugs.slice(0, 8).map((drug: any, i: number) => {
                      const coveredCount = drug.indications?.filter((ind: any) => ind.coverage_status !== "not_covered").length || 0;
                      const totalCount = drug.indications?.length || 0;
                      const notCoveredCount = totalCount - coveredCount;

                      return (
                        <li key={i} style={{ background: "white", borderRadius: "12px", padding: "12px 16px", border: "1px solid #e5e7eb" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{drug.brand_name}</span>
                              <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginLeft: "8px" }}>{drug.generic_name}</span>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>
                              {totalCount} indications
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                            {coveredCount > 0 && (
                              <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600 }}>
                                {coveredCount} covered
                              </span>
                            )}
                            {notCoveredCount > 0 && (
                              <span style={{ background: "#fecaca", color: "#991b1b", padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600 }}>
                                {notCoveredCount} not covered
                              </span>
                            )}
                            {drug.indications?.some((ind: any) => ind.step_therapy_required) && (
                              <span style={{ background: "#fed7aa", color: "#9a3412", padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600 }}>
                                step therapy
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {selectedDoc.status === "Processing" ? (
                      <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#6b7280" }}>
                        <div style={{ width: "16px", height: "16px", border: "2px solid #e5e7eb", borderTopColor: "#084d38", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Analyzing document structure...
                      </li>
                    ) : (
                      <li style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Detailed drug data available after fresh upload</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "12px" }}>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: "12px", padding: "14px", fontSize: "1rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
              >
                Close
              </button>
              <button style={{ flex: 1, background: "#084d38", border: "none", borderRadius: "12px", padding: "14px", fontSize: "1rem", fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Sparkles size={16} /> View in Coverage Grid
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}