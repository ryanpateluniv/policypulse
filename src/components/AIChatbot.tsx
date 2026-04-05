"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Plus, Image as ImageIcon, FileText, Globe, Paperclip, ChevronRight } from "lucide-react";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm PulseAI, your dedicated medical policy analyst. How can I help you today? I can analyze coverage requirements, compare payer variations, or summarize recent oncology policy shifts." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = { role: "assistant", content: "I've analyzed the latest UHC oncology protocols for NSCLC. Based on the documentation uploaded today, Keytruda still allows for first-line pembrolizumab monotherapy if PD-L1 expression is >= 50%. However, there's a new notation about biosimilar trial requirements if used in combination with chemotherapy." };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 72px)", background: "#f8fafc", overflow: "hidden" }}>
      {/* Sidebar - History */}
      <div className="hidden lg:flex" style={{ width: "280px", borderRight: "1px solid #f1f5f9", background: "white", flexDirection: "column", padding: "1.5rem" }}>
        <button style={{ background: "#0f172a", color: "white", padding: "12px", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "2rem", cursor: "pointer" }}>
          <Plus size={18} /> New Analysis
        </button>
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Recent Threads</p>
          {[
            "Keytruda vs Opdivo NSCLC",
            "Aetna Q2 Oncology Updates",
            "Humira Biosimilar Access",
            "PD-1 Step Therapy Logic"
          ].map((title, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", fontSize: "0.85rem", color: "#1e293b", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }} onMouseOver={e => e.currentTarget.style.background = "#f8fafc"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              <FileText size={16} color="#94a3b8" /> {title}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: "1rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#084d38", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={16} color="white" /></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>PulseAI Pro</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>Unlock complex policy cross-comparisons and bulk data extraction.</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        
        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "3rem 0", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", padding: "0 2rem" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ 
                  flexShrink: 0, 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "14px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  background: m.role === "assistant" ? "#084d38" : "white",
                  border: m.role === "assistant" ? "none" : "1px solid #f1f5f9",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
                }}>
                  {m.role === "assistant" ? <Sparkles size={20} color="white" /> : <User size={20} color="#64748b" />}
                </div>
                <div style={{ 
                  flex: 1,
                  maxWidth: "85%",
                  background: m.role === "assistant" ? "transparent" : "white",
                  padding: m.role === "assistant" ? "4px 0" : "1.25rem 1.75rem",
                  borderRadius: m.role === "assistant" ? "0" : "24px 4px 24px 24px",
                  boxShadow: m.role === "assistant" ? "none" : "0 10px 30px rgba(0,0,0,0.03)",
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "1rem", 
                    lineHeight: 1.7, 
                    color: m.role === "assistant" ? "#0f172a" : "#1e293b",
                    fontWeight: m.role === "assistant" ? 500 : 600 
                  }}>
                    {m.content}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "14px", background: "#084d38", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={20} color="white" />
                </div>
                <div style={{ display: "flex", gap: "4px", alignItems: "center", height: "40px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#084d38", animation: "pulse 1.5s infinite 0s" }} />
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#084d38", animation: "pulse 1.5s infinite 0.2s" }} />
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#084d38", animation: "pulse 1.5s infinite 0.4s" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Input */}
        <div style={{ padding: "0 2rem 3rem", position: "relative" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
            <div style={{ 
              background: "white", 
              borderRadius: "28px", 
              padding: "8px 12px", 
              boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{ display: "flex", gap: "6px", paddingLeft: "8px" }}>
                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "8px" }} onMouseOver={e => e.currentTarget.style.color = "#084d38"} onMouseOut={e => e.currentTarget.style.color = "#94a3b8"} title="Attach Files">
                  <Paperclip size={20} />
                </button>
                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "8px" }} onMouseOver={e => e.currentTarget.style.color = "#084d38"} onMouseOut={e => e.currentTarget.style.color = "#94a3b8"} title="Search Web">
                  <Globe size={20} />
                </button>
              </div>

              <input 
                type="text" 
                placeholder="Ask anything about policy protocols..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{ flex: 1, border: "none", outline: "none", height: "48px", fontSize: "1.05rem", fontWeight: 500, color: "#1e293b" }}
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                style={{ 
                  background: input.trim() ? "#084d38" : "#f1f5f9", 
                  color: input.trim() ? "white" : "#94a3b8", 
                  width: "44px", 
                  height: "44px", 
                  borderRadius: "50%", 
                  border: "none", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  cursor: input.trim() ? "pointer" : "default",
                  transition: "all 0.2s"
                }}
              >
                <Send size={18} />
              </button>
            </div>
            
            <div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>PulseAI can make mistakes. Verify critical clinical data.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
