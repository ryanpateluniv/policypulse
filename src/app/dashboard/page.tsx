"use client";
//faltu commemntaryyyyy!

import { useState, useEffect, useRef } from "react";
import { LayoutGrid, Box, Globe, LayoutList, MessageSquare } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import CoverageGrid from "@/app/coverage/CoverageGrid";
import DashboardOverview from "@/components/DashboardOverview";
import PolicyVault from "@/app/policyvault/PolicyVault";
import MainHeader from "@/components/MainHeader";
import DiffViewer from "@/components/DiffViewer";
import AIChatbot from "@/components/AIChatbot";

export default function PolicyPulse() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const commands = [
    { key: "/grid", label: "Dashboard Grid", icon: <LayoutGrid size={16} />, action: () => setActiveTab("dashboard") },
    { key: "/vault", label: "Policy Vault", icon: <Box size={16} />, action: () => setActiveTab("vault") },
    { key: "/payer", label: "Payer Coverage", icon: <LayoutList size={16} />, action: () => setActiveTab("coverage") },
    { key: "/monitor", label: "Market Monitor", icon: <Globe size={16} />, action: () => setActiveTab("diff") },
    { key: "/ai", label: "Ask PulseAI", icon: <MessageSquare size={16} />, action: () => setActiveTab("pulseai") },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      <MainHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        searchInputRef={searchInputRef}
        commands={commands}
        user={user}
        isLoading={isLoading}
      />

      <main className={activeTab === "pulseai" ? "" : "px-4 sm:px-10 pb-10 pt-6"}>
        {activeTab === "dashboard" ? (
          <DashboardOverview user={user} greeting={greeting} setActiveTab={setActiveTab} uploadedDocs={uploadedDocs} />
        ) : activeTab === "coverage" ? (
          <CoverageGrid />
        ) : activeTab === "vault" ? (
          <PolicyVault
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        ) : activeTab === "diff" ? (
          <DiffViewer />
        ) : activeTab === "pulseai" ? (
          <AIChatbot />
        ) : (
          <section className="py-20 text-center">
            <h2 className="text-2xl font-bold">404</h2>
            <p className="text-gray-500 mt-2">Section not found.</p>
          </section>
        )}
      </main>
    </div>
  );
}
