"use client";

import { useState } from "react";
import { HeartPulse, ChevronDown, Search, LayoutGrid, Box, Moon, LogIn, LogOut, Sparkles, FileText, Pill, Database, Building2, Clock, Plus, Upload, ArrowRight, CheckCircle2, Activity, Calendar, ClipboardList, LayoutList, TrendingUp, AlertCircle, ShieldCheck, Download } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";
import CoverageGrid from "@/components/CoverageGrid";

const hour = new Date().getHours();
const greeting =
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";


const severityColor: Record<string, string> = {
  high: "#ff3b30",
  medium: "#f59e0b",
  low: "#00b87a",
};



export default function PolicyPulse() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: "Aetna Oncology Policy 2024.pdf", size: "2.4 MB", date: "2h ago", status: "Analyzed" },
    { name: "Cigna NSCLC Criteria.pdf", size: "1.1 MB", date: "5h ago", status: "Analyzed" }
  ]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const { user, isLoading } = useUser();

  const commands = [
    { key: "/summarize", label: "Summarize Policy", icon: <LayoutGrid size={16} /> },
    { key: "/compare", label: "Compare Coverage", icon: <Box size={16} /> },
    { key: "/alert", label: "Set Alert", icon: <HeartPulse size={16} /> },
    { key: "/vault", label: "Go to Vault", icon: <Box size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <header
        style={{
          top: 0,
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          background: "#ffffff",
          borderBottom: "1px solid #f3f4f6",
          justifyContent: "space-between",
        }}
      >
        {/* Left side: Logo */}
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          {/* Logo Group */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                background: "#084d38",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HeartPulse strokeWidth={2} size={24} color="#ffffff" />
            </div>
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#111",
                letterSpacing: "-0.01em",
                display: "block",
              }}
            >
              PolicyPulse
            </span>
          </div>

          {/* Version Badge */}
          <div
            style={{
              marginLeft: "1rem",
              background: "#ffffff",
              color: "#111111",
              padding: "2px 8px",
              borderRadius: "20px",
              fontSize: "0.6rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              border: "1.5px solid #000000",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              height: "18px",
            }}
          >
            v0.1 <span style={{ fontWeight: 400, opacity: 0.6 }}>Alpha</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div style={{ justifyContent: "center", flex: 1, padding: "0 1rem", position: "relative" }} className="hidden md:flex">
          <div
            className="flex items-center justify-between bg-gradient-to-r from-white to-[#f9fafb] rounded-[12px] px-[1.2rem] py-[0.6rem] w-full max-w-[560px] border border-[#e5e7eb] transition-all duration-300 hover:border-[#00b87a]/40 hover:shadow-sm focus-within:border-[#00b87a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#00b87a]/15 focus-within:max-w-[580px] group relative"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <Sparkles size={18} className="text-[#00b87a] transition-transform duration-300 group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="Ask PulseAI..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowSuggestions(e.target.value.startsWith("/"));
                }}
                onFocus={() => setShowSuggestions(searchValue.startsWith("/"))}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.95rem",
                  color: "#111",
                  fontFamily: '"Inter", sans-serif',
                }}
              />
            </div>

            {/* "/" Keyboard Indicator */}
            {searchValue === "" && (
              <div
                style={{
                  background: "#ffffff",
                  color: "#9ca3af",
                  height: "22px",
                  minWidth: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
                  pointerEvents: "none",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                className="group-focus-within:opacity-0 group-focus-within:scale-95"
              >
                /
              </div>
            )}

            {/* Command Suggestions Dropdown */}
            {showSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  width: "100%",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  padding: "8px",
                  zIndex: 100,
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", fontWeight: 600, padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  PulseAI Commands
                </p>
                {commands.map((cmd) => (
                  <button
                    key={cmd.key}
                    onClick={() => {
                      setSearchValue(cmd.key + " ");
                      setShowSuggestions(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      background: "transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "#374151",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f9fafb")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ color: "#00b87a" }}>{cmd.icon}</span>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem", flex: 1 }}>{cmd.label}</span>
                    <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{cmd.key}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side items */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", flex: 1 }}>
          {/* Divider */}
          <div style={{ width: "1px", height: "24px", background: "#e5e7eb", marginRight: "0.5rem" }} />

          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              background: activeTab === "dashboard" ? "#f3f4f6" : "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === "dashboard" ? "#111" : "#6b7280",
              padding: activeTab === "dashboard" ? "8px 16px" : "8px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
            className="hidden sm:flex"
          >
            <LayoutGrid size={20} strokeWidth={2} />
            {activeTab === "dashboard" && (
              <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>Dashboard</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            style={{
              background: activeTab === "vault" ? "#f3f4f6" : "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === "vault" ? "#111" : "#6b7280",
              padding: activeTab === "vault" ? "8px 16px" : "8px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
          >
            <Box size={20} strokeWidth={2} />
            {activeTab === "vault" && (
              <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>Vault</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            style={{
              background: activeTab === "settings" ? "#f3f4f6" : "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === "settings" ? "#111" : "#6b7280",
              padding: activeTab === "settings" ? "8px 16px" : "8px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
            className="hidden lg:flex"
          >
            <Moon size={20} strokeWidth={2} />
            {activeTab === "settings" && (
              <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>Settings</span>
            )}
          </button>

          {/* User Section */}
          {!isLoading && !user ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <a
                href="/auth/login"
                style={{
                  textDecoration: "none",
                  background: "#084d38",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Sign In
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <a
                href="/auth/logout"
                title="Log Out"
                style={{
                  textDecoration: "none",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  backgroundSize: "cover",
                  backgroundImage: user?.picture ? `url(${user.picture})` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {!user?.picture && user?.name?.charAt(0)}
              </a>
            </div>
          )}
        </div>
      </header>


      {/* Page content */}
      <main className="px-4 sm:px-10 pb-10 pt-6">
        {activeTab === "dashboard" ? (
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
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111" }}>12</span>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Live</span>
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

              {/* Card 2: Live Detection Stream */}
              <div style={{
                background: "white",
                borderRadius: "24px",
                padding: "1.5rem",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
                    <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Live Detection Feed</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: "100px", fontWeight: 700 }}>ACTIVE</span>
                </div>
                
                <style>{`
                  @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                  }
                `}</style>

                <div style={{ flex: 1, overflow: "hidden" }}>
                  {[
                    { drug: "Opdivo", type: "Policy Change", time: "Just now", status: "Parsing...", progress: 65 },
                    { drug: "Stelara", type: "Payer Update", time: "1m ago", status: "Archiving", progress: 100 },
                    { drug: "Dupixent", type: "New Indications", time: "4m ago", status: "Summarized", progress: 100 }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                        <span style={{ fontWeight: 600 }}>{item.drug} &middot; {item.type}</span>
                        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{item.time}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, height: "4px", background: "#f3f4f6", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: `${item.progress}%`, height: "100%", background: item.progress < 100 ? "#3b82f6" : "#10b981", borderRadius: "2px", transition: "width 0.5s ease" }} />
                        </div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: item.progress < 100 ? "#3b82f6" : "#10b981", textTransform: "uppercase" }}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Coverage Overview */}
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

              {/* Card 4: Recent Alerts */}
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
                    <span style={{ fontWeight: 600, fontSize: "1.2rem" }}>Critical Policy Changes Detected</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>PulseAI Monitoring • Last 24h</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { drug: "Keytruda", payer: "Cigna", change: "Step Therapy Added", description: "Cigna updated oncology protocols to require biosimilar trial first.", date: "2h ago", severity: "high" },
                    { drug: "Humira", payer: "Aetna", change: "Criteria Update", description: "New clinical criteria for plaque psoriasis coverage effective immediately.", date: "5h ago", severity: "medium" },
                    { drug: "Dupixent", payer: "UHC", change: "Payer coverage", description: "Coverage expanded to include EoE indications in adolescents.", date: "8h ago", severity: "low" },
                  ].map((alert, i) => (
                    <div key={i} style={{ padding: "1.2rem", borderRadius: "16px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{alert.drug}</span>
                        <span style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>{alert.date}</span>
                      </div>
                      <p style={{ color: "#f43f5e", fontSize: "0.85rem", fontWeight: 600, margin: "0 0 6px" }}>{alert.change}</p>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{alert.description}</p>
                      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 600 }}>{alert.payer}</span>
                        <ArrowRight size={14} color="#94a3b8" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "coverage" ? (
          <section>
            <CoverageGrid />
          </section>
        ) : activeTab === "vault" ? (
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
        ) : (
          <section>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Settings</h1>
            <p style={{ color: "#6b7280", marginTop: "1rem" }}>Configure and manage your PolicyPulse experience.</p>
          </section>
        )}
      </main>
    </div >
  );
}
