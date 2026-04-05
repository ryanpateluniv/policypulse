"use client";

import React from "react";
import { HeartPulse, Sparkles, LayoutGrid, Box, LayoutList, Globe, MessageSquare, Menu } from "lucide-react";

interface MainHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  commands: any[];
  user: any;
  isLoading: boolean;
}

export default function MainHeader({
  activeTab,
  setActiveTab,
  searchValue,
  setSearchValue,
  showSuggestions,
  setShowSuggestions,
  searchInputRef,
  commands,
  user,
  isLoading
}: MainHeaderProps) {
  return (
    <header
      style={{
        top: 0,
        padding: "0 1.5rem",
        height: "72px",
        display: "flex",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #f1f5f9",
        justifyContent: "space-between",
        position: "sticky",
        zIndex: 100,
        gap: "1rem"
      }}
    >
      {/* Left side: Logo */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "#084d38", borderRadius: "12px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(8, 77, 56, 0.2)" }}>
            <HeartPulse strokeWidth={2.5} size={22} color="#ffffff" />
          </div>
          <span className="hidden sm:inline" style={{ fontWeight: 800, fontSize: "1.2rem", color: "#0f172a", letterSpacing: "-0.03em" }}>PolicyPulse</span>
        </div>
      </div>

      {/* Center: Search Bar - Responsive Squeeze */}
      <div style={{ flex: 1, maxWidth: "600px", position: "relative" }} className="flex justify-center">
        <div 
          className="flex items-center justify-between bg-[#f8fafc] rounded-[16px] px-[1.2rem] py-[0.7rem] w-full border border-transparent transition-all duration-300 hover:border-[#084d38]/20 focus-within:border-[#084d38] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(8,77,56,0.05)] group relative"
          style={{ 
            minWidth: "120px",
            height: "44px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <Sparkles size={16} className="text-[#084d38] opacity-50 group-focus-within:opacity-100 transition-opacity" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="PulseAI Search..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSuggestions(e.target.value.startsWith("/"));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.startsWith("/")) {
                  const matched = commands.find(c => c.key.startsWith(searchValue.toLowerCase()));
                  if (matched) {
                    matched.action();
                    setSearchValue("");
                    setShowSuggestions(false);
                  }
                }
              }}
              onFocus={() => setShowSuggestions(searchValue.startsWith("/"))}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              style={{ 
                background: "transparent", 
                border: "none", 
                outline: "none", 
                width: "100%", 
                fontSize: "0.9rem", 
                color: "#1e293b", 
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif' 
              }}
            />
          </div>

          <div style={{ background: "#ffffff", color: "#94a3b8", height: "18px", width: "18px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 800, border: "1px solid #e2e8f0", pointerEvents: "none" }} className="hidden sm:flex">/</div>

          {showSuggestions && (
            <div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, right: 0, background: "white", border: "1px solid #f1f5f9", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", padding: "8px", zIndex: 110, animation: "fadeInUp 0.2s ease-out" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 800, padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Navigation</div>
            {commands.filter(c => c.key.includes(searchValue.toLowerCase())).map((cmd) => (
                <button 
                  key={cmd.key} 
                  onClick={cmd.action}
                  style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "10px 12px", border: "none", background: "transparent", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ color: "#084d38", background: "#f0fdf4", padding: "6px", borderRadius: "8px" }}>{cmd.icon}</div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b", flex: 1 }}>{cmd.label}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700 }}>{cmd.key}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side items - Responsive visibility */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "2px" }} className="hidden lg:flex">
          {[
            { id: "dashboard", icon: <LayoutGrid size={18} />, label: "Dashboard" },
            { id: "vault", icon: <Box size={18} />, label: "Vault" },
            { id: "coverage", icon: <LayoutList size={18} />, label: "Payer" },
            { id: "diff", icon: <Globe size={18} />, label: "Monitor" },
            { id: "pulseai", icon: <MessageSquare size={18} />, label: "PulseAI" }
          ].map((tab, i) => (
            <React.Fragment key={tab.id}>
              {i > 0 && <div style={{ alignSelf: "center", width: "1px", height: "16px", background: "#e2e8f0", margin: "0 4px" }} />}
              <button
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? "#f1f5f9" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: activeTab === tab.id ? "#0f172a" : "#64748b",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
                onMouseOver={(e) => !activeTab.includes(tab.id) && (e.currentTarget.style.background = "#f8fafc")}
                onMouseOut={(e) => activeTab !== tab.id && (e.currentTarget.style.background = "transparent")}
              >
                {tab.icon}
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden" style={{ background: "#f8fafc", border: "1px solid #f1f5f9", padding: "8px", borderRadius: "10px", color: "#64748b" }}>
          <Menu size={20} />
        </button>

        <div style={{ width: "1px", height: "24px", background: "#f1f5f9", margin: "0 8px" }} className="hidden sm:block" />

        {/* User Card */}
        {!isLoading && user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px", paddingRight: "12px", background: "#f8fafc", borderRadius: "100px", border: "1px solid #f1f5f9" }}>
            <a href="/auth/logout" style={{ 
              textDecoration: "none", 
              width: "32px", 
              height: "32px", 
              borderRadius: "50%", 
              background: "#084d38", 
              backgroundSize: "cover", 
              backgroundImage: user?.picture ? `url(${user.picture})` : "none", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "0.75rem", 
              fontWeight: 800, 
              color: "white", 
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(8, 77, 56, 0.2)"
            }}>
              {!user?.picture && user?.name?.charAt(0)}
            </a>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }} className="hidden md:inline">{user?.given_name || user?.name?.split(' ')[0]}</span>
          </div>
        ) : (
          <a href="/auth/login" style={{ textDecoration: "none", background: "#084d38", color: "white", padding: "10px 20px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 600, boxShadow: "0 4px 12px rgba(8, 77, 56, 0.2)" }}>Sign In</a>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
