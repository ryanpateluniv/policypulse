"use client";

import React from "react";
import { HeartPulse, Sparkles, LayoutGrid, Box, LayoutList, Moon } from "lucide-react";

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
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        background: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
        justifyContent: "space-between",
        position: "sticky",
        zIndex: 50
      }}
    >
      {/* Left side: Logo */}
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "#084d38", borderRadius: "10px", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HeartPulse strokeWidth={2} size={24} color="#ffffff" />
          </div>
          <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#111", letterSpacing: "-0.01em" }}>PolicyPulse</span>
        </div>
        <div style={{ marginLeft: "1rem", background: "#ffffff", color: "#111111", padding: "2px 8px", borderRadius: "20px", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", border: "1.5px solid #000000", display: "flex", alignItems: "center", gap: "4px", height: "18px" }}>
          v0.1 <span style={{ fontWeight: 400, opacity: 0.6 }}>Alpha</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div style={{ justifyContent: "center", flex: 1, padding: "0 1rem", position: "relative" }} className="hidden md:flex">
        <div className="flex items-center justify-between bg-gradient-to-r from-white to-[#f9fafb] rounded-[12px] px-[1.2rem] py-[0.6rem] w-full max-w-[560px] border border-[#e5e7eb] transition-all duration-300 hover:border-[#00b87a]/40 hover:shadow-sm focus-within:border-[#00b87a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#00b87a]/15 focus-within:max-w-[580px] group relative">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <Sparkles size={18} className="text-[#00b87a] transition-transform duration-300 group-focus-within:scale-110" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Ask PulseAI..."
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
              style={{ background: "transparent", border: "none", outline: "none", width: "100%", fontSize: "0.95rem", color: "#111", fontFamily: '"Inter", sans-serif' }}
            />
          </div>

          {searchValue === "" && (
            <div style={{ background: "#ffffff", color: "#9ca3af", height: "22px", minWidth: "22px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #e5e7eb", boxShadow: "0 1px 1px rgba(0,0,0,0.05)", pointerEvents: "none", transition: "opacity 0.2s, transform 0.2s" }} className="group-focus-within:opacity-0 group-focus-within:scale-95">/</div>
          )}

          {showSuggestions && searchValue.startsWith("/") && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%", background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", padding: "8px", zIndex: 100 }}>
              <div style={{ color: "#9ca3af", fontSize: "0.75rem", fontWeight: 700, padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f9fafb", marginBottom: "4px" }}>Navigation Commands</div>
              {commands.filter(c => c.key.startsWith(searchValue.toLowerCase())).map((cmd) => (
                <button
                  key={cmd.key}
                  onClick={() => {
                    cmd.action();
                    setSearchValue("");
                    setShowSuggestions(false);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "10px 12px", border: "none", background: "transparent", borderRadius: "8px", cursor: "pointer", textAlign: "left", color: "#374151", transition: "background 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ color: "#084d38", background: "#f0fdf4", padding: "6px", borderRadius: "8px" }}>{cmd.icon}</div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", flex: 1 }}>{cmd.label}</span>
                  <span style={{ color: "#9ca3af", fontSize: "0.75rem", background: "#f9fafb", padding: "2px 6px", borderRadius: "4px" }}>{cmd.key}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side items */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", flex: 1 }}>
        <div style={{ width: "1px", height: "24px", background: "#e5e7eb", marginRight: "0.5rem" }} />

        {[
          { id: "dashboard", icon: <LayoutGrid size={20} />, label: "Dashboard" },
          { id: "vault", icon: <Box size={20} />, label: "Vault" },
          { id: "coverage", icon: <LayoutList size={20} />, label: "Coverage" },
          { id: "settings", icon: <Moon size={20} />, label: "Settings" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "#f3f4f6" : "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === tab.id ? "#111" : "#6b7280",
              padding: activeTab === tab.id ? "8px 16px" : "8px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.icon}
            {activeTab === tab.id && <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>{tab.label}</span>}
          </button>
        ))}

        {/* User Avatar */}
        {!isLoading && user ? (
          <a href="/auth/logout" style={{ textDecoration: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#f3f4f6", backgroundSize: "cover", backgroundImage: user?.picture ? `url(${user.picture})` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "#374151", border: "1px solid #e5e7eb", cursor: "pointer" }}>
            {!user?.picture && user?.name?.charAt(0)}
          </a>
        ) : (
          <a href="/auth/login" style={{ textDecoration: "none", background: "#084d38", color: "white", padding: "8px 20px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 500 }}>Sign In</a>
        )}
      </div>
    </header>
  );
}
