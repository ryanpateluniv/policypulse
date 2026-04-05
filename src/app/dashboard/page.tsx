"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutGrid, Box, Moon, LayoutList } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";
import CoverageGrid from "@/components/CoverageGrid";
import DashboardOverview from "@/components/DashboardOverview";
import PolicyVault from "@/app/policyvault/PolicyVault";
import MainHeader from "@/components/MainHeader";

export default function PolicyPulse() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: "Aetna Oncology Policy 2024.pdf", size: "2.4 MB", date: "2h ago", status: "Analyzed" },
    { name: "Cigna NSCLC Criteria.pdf", size: "1.1 MB", date: "5h ago", status: "Analyzed" }
  ]);
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
    { key: "/dashboard", label: "Go to Dashboard", icon: <LayoutGrid size={16} />, action: () => setActiveTab("dashboard") },
    { key: "/vault", label: "Go to Vault", icon: <Box size={16} />, action: () => setActiveTab("vault") },
    { key: "/coverage", label: "Drug Coverage Analysis", icon: <LayoutList size={16} />, action: () => setActiveTab("coverage") },
    { key: "/settings", label: "Open Settings", icon: <Moon size={16} />, action: () => setActiveTab("settings") },
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

      <main className="px-4 sm:px-10 pb-10 pt-6">
        {activeTab === "dashboard" ? (
          <DashboardOverview user={user} greeting={greeting} setActiveTab={setActiveTab} />
        ) : activeTab === "coverage" ? (
          <CoverageGrid />
        ) : activeTab === "vault" ? (
          <PolicyVault 
            uploadedDocs={uploadedDocs} 
            setUploadedDocs={setUploadedDocs}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        ) : (
          <section className="py-20 text-center">
            <h2 className="text-2xl font-bold">Settings & Configuration</h2>
            <p className="text-gray-500 mt-2">Personalize your PulseAI experience.</p>
          </section>
        )}
      </main>
    </div>
  );
}
