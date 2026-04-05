"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Plus, FileText, Globe, Paperclip, Mic, MicOff } from "lucide-react";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm PulseAI, your dedicated medical policy analyst. How can I help you today? I can analyze coverage requirements, compare payer variations, or answer questions about drug policies." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const widgetLoaded = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load ElevenLabs widget script once
  useEffect(() => {
    if (widgetLoaded.current) return;
    widgetLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const toggleVoice = () => {
    setVoiceActive(!voiceActive);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer || "I couldn't find an answer. Try rephrasing your question." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setIsTyping(false);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 72px)", background: "#f8fafc", overflow: "hidden" }}>
      {/* Sidebar */}
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
                  <div style={{ 
                    margin: 0, 
                    fontSize: "1rem", 
                    lineHeight: 1.7, 
                    color: m.role === "assistant" ? "#0f172a" : "#1e293b",
                    fontWeight: m.role === "assistant" ? 500 : 600,
                    whiteSpace: "pre-wrap"
                  }}>
                    {m.content}
                  </div>
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
                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "8px" }} title="Attach Files">
                  <Paperclip size={20} />
                </button>
                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "8px" }} title="Search Web">
                  <Globe size={20} />
                </button>
                <button 
                  onClick={toggleVoice}
                  style={{ 
                    background: voiceActive ? "#084d38" : "transparent", 
                    border: "none", 
                    color: voiceActive ? "white" : "#94a3b8", 
                    cursor: "pointer", 
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s"
                  }} 
                  title="Voice Chat"
                >
                  {voiceActive ? <MicOff size={20} /> : <Mic size={20} />}
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

        {/* ElevenLabs Voice Widget - shown when voice is active */}
        {voiceActive && (
          <div style={{
            position: "fixed",
            bottom: "120px",
            right: "40px",
            zIndex: 1000,
            background: "white",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            animation: "fadeInUp 0.3s ease-out"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>PulseAI Voice Active</span>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: '<elevenlabs-convai agent-id="agent_4901knehjjhff9r8qafdm6cm3798"></elevenlabs-convai>'
              }}
            />
            <button 
              onClick={toggleVoice}
              style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "8px 20px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
            >
              End Voice Chat
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}