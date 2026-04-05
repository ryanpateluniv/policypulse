"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutGrid, Box, LayoutList, FileText, MessageSquare, User } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { supabase } from "@/lib/supabase";
import CoverageGrid from "@/app/coverage/CoverageGrid";
import DashboardOverview from "@/components/DashboardOverview";
import PolicyVault from "@/app/policyvault/PolicyVault";
import MainHeader from "@/components/MainHeader";
import AIChatbot from "@/components/AIChatbot";
import PolicyIntelligenceAudit from "@/components/PolicyIntelligenceAudit";
import PatientProfile from "@/components/PatientProfile";

export default function PolicyPulse() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useUser();

  // Load documents globally so dashboard can show stats instantly
  useEffect(() => {
    async function loadDocs() {
      // Allow loading even if not logged in for mock data if needed, or strictly user.
      const { data } = await supabase
        .from("policy_documents")
        .select("*, payers(name)")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const docs = await Promise.all(
          data.map(async (doc: any) => {
            const { count } = await supabase
              .from("coverage_entries")
              .select("*", { count: "exact", head: true })
              .eq("policy_document_id", doc.id);

            const { data: drugEntries } = await supabase
              .from("coverage_entries")
              .select("drug_id")
              .eq("policy_document_id", doc.id);

            const uniqueDrugs = new Set(drugEntries?.map((e: any) => e.drug_id) || []);

            return {
              name: doc.title || "Untitled",
              size: "-",
              date: new Date(doc.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
              status: doc.status === "parsed" ? "Analyzed" : doc.status === "error" ? "Error" : "Processing",
              payer: doc.payers?.name || "Unknown",
              drugs_found: uniqueDrugs.size,
              coverage_entries: count || 0,
              parsed_data: null,
              document_id: doc.id,
            };
          })
        );
        setUploadedDocs(docs);
      }
    }
    loadDocs();
  }, [user]);

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
    { key: "/audit", label: "Policy Audit", icon: <FileText size={16} />, action: () => setActiveTab("audit") },
    { key: "/patient", label: "Patient Bio", icon: <User size={16} />, action: () => setActiveTab("profile") },
    { key: "/ai", label: "Ask PulseAI", icon: <MessageSquare size={16} />, action: () => setActiveTab("pulseai") },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
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
            setActiveTab={setActiveTab}
          />
        ) : activeTab === "audit" ? (
          <PolicyIntelligenceAudit />
        ) : activeTab === "profile" ? (
          <PatientProfile />
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
