"use client";

import React, { useState, useEffect } from "react";
import { User, Activity, Heart, ShieldAlert, FileText, CheckCircle2, FlaskConical, Stethoscope, Save, Edit3, Lock } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function PatientProfile() {
  const { user, isLoading } = useUser();
  
  // Custom user details state
  const [profileData, setProfileData] = useState({
    patientId: "MRN-PENDING",
    dob: "",
    gender: "",
    primaryCare: "",
    bloodPressure: "--/--",
    weight: "--"
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load from local storage when user logs in
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`pulse_user_profile_${user.email}`);
      if (saved) {
        setProfileData(JSON.parse(saved));
      } else {
        // First time - prompt them to enter details
        setIsEditing(true);
      }
    }
  }, [user]);

  const handleSave = () => {
    if (user?.email) {
      localStorage.setItem(`pulse_user_profile_${user.email}`, JSON.stringify(profileData));
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "5rem", color: "#64748b" }}>Loading profile...</div>;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", background: "white", padding: "4rem 2rem", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
        <div style={{ background: "#f8fafc", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <Lock size={32} color="#084d38" />
        </div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 1rem", color: "#1e293b" }}>Authentication Required</h2>
        <p style={{ color: "#64748b", margin: "0 0 2rem", lineHeight: 1.6 }}>Please log in to view and edit your medical profile and coverage tracking.</p>
        <a href="/api/auth/login" style={{ background: "#084d38", color: "white", padding: "14px 32px", borderRadius: "100px", fontWeight: 600, textDecoration: "none" }}>Sign In with Auth0</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 0", animation: "fadeIn 0.4s ease-out" }}>
      {/* Bio Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #084d38 0%, #0a5f45 100%)",
        borderRadius: "24px",
        padding: "2.5rem 3rem",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "2.5rem",
        marginBottom: "2rem",
        boxShadow: "0 20px 40px rgba(8, 77, 56, 0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "2.5rem", width: "100%" }}>
          {/* Avatar Area - Uses Auth0 Picture */}
          <div style={{
            width: "120px",
            height: "120px",
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
            overflow: "hidden"
          }}>
            {user.picture ? (
              <img src={user.picture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <User size={50} color="#084d38" />
            )}
          </div>
          
          {/* Main Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(167, 243, 208, 0.2)", color: "#a7f3d0", padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Identity Verified
              </span>
              <span style={{ fontSize: "0.85rem", opacity: 0.8, fontWeight: 500 }}>ID: {isEditing ? "Generating..." : profileData.patientId}</span>
            </div>
            
            <h1 style={{ fontSize: "2.8rem", fontWeight: 800, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
              {user.name || user.email?.split("@")[0]}
            </h1>
            
            <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9, display: "flex", alignItems: "center", gap: "8px" }}>
              {user.email} &middot; {profileData.dob ? "DOB: " + profileData.dob : "DOB: Not Set"} &middot; {profileData.gender || "Gender Not Set"}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div style={{ alignSelf: "flex-start" }}>
            {isEditing ? (
              <button 
                onClick={handleSave}
                style={{ background: "#10b981", color: "white", border: "none", padding: "10px 20px", borderRadius: "100px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <Save size={16} /> Save Details
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "10px 20px", borderRadius: "100px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", transition: "background 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
        <Heart size={300} style={{ position: "absolute", right: "-50px", bottom: "-100px", opacity: 0.05 }} />
      </div>

      {isEditing && (
        <div style={{ background: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #10b981", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)", animation: "fadeIn 0.3s ease-out" }}>
          <h3 style={{ margin: "0 0 1.5rem", fontSize: "1.2rem", fontWeight: 700, color: "#084d38" }}>Complete Your Medical Profile</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Patient ID</label>
              <input value={profileData.patientId} onChange={e => handleInputChange("patientId", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }} placeholder="e.g. MRN-1234" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Date of Birth</label>
              <input type="date" value={profileData.dob} onChange={e => handleInputChange("dob", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Gender</label>
              <select value={profileData.gender} onChange={e => handleInputChange("gender", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Primary Care Provider</label>
              <input value={profileData.primaryCare} onChange={e => handleInputChange("primaryCare", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }} placeholder="Dr. XYZ" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Blood Pressure</label>
              <input value={profileData.bloodPressure} onChange={e => handleInputChange("bloodPressure", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }} placeholder="120/80" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Weight (lbs)</label>
              <input value={profileData.weight} onChange={e => handleInputChange("weight", e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }} placeholder="150" />
            </div>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div style={{ display: !isEditing ? "grid" : "none", gridTemplateColumns: "1fr 340px", gap: "2rem", opacity: isEditing ? 0.3 : 1, pointerEvents: isEditing ? "none" : "auto" }}>
        
        {/* Left Column: Medical Bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
             <div style={{ background: "white", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#f0fdf4", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}><Heart size={24} color="#16a34a" /></div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Blood Pressure</p>
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>{profileData.bloodPressure} <span style={{ fontSize: "1rem", fontWeight: 600, color: "#94a3b8" }}>mmHg</span></p>
                </div>
             </div>
             <div style={{ background: "white", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#eff6ff", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}><Activity size={24} color="#2563eb" /></div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Weight</p>
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>{profileData.weight} <span style={{ fontSize: "1rem", fontWeight: 600, color: "#94a3b8" }}>lbs</span></p>
                </div>
             </div>
          </div>

          {/* Diagnosis & Conditions */}
          <div style={{ background: "white", borderRadius: "24px", padding: "2rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Stethoscope size={20} color="#084d38" /> Clinical Diagnoses
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { name: "Rheumatoid Arthritis (Seropositive)", date: "Diagnosed Mar 2021", status: "Active", primary: true },
                { name: "Hypertension (Primary)", date: "Diagnosed Feb 2019", status: "Controlled", primary: false }
              ].map((dx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: dx.primary ? "#f0fdf4" : "#f8fafc", borderRadius: "12px", border: dx.primary ? "1px solid #bbf7d0" : "1px solid #e2e8f0" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 700, color: dx.primary ? "#166534" : "#1e293b" }}>{dx.name}</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{dx.date}</p>
                  </div>
                  <span style={{ background: dx.status === "Active" ? "#fee2e2" : dx.status === "Controlled" ? "#dcfce7" : "#f1f5f9", color: dx.status === "Active" ? "#991b1b" : dx.status === "Controlled" ? "#166534" : "#475569", padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {dx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div style={{ background: "white", borderRadius: "24px", padding: "2rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <FlaskConical size={20} color="#084d38" /> Active Prescriptions
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { drug: "Humira (adalimumab)", dose: "40mg / 0.4mL pen", freq: "Every 14 days", tag: "Biologic" },
                { drug: "Methotrexate", dose: "15mg", freq: "Weekly", tag: "DMARD" }
              ].map((med, i) => (
                <div key={i} style={{ padding: "1.2rem", border: "1px solid #f1f5f9", borderRadius: "16px", background: "white", position: "relative" }}>
                  <span style={{ position: "absolute", top: "16px", right: "16px", fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{med.tag}</span>
                  <h4 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", paddingRight: "60px" }}>{med.drug}</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>{med.dose} &middot; {med.freq}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Insurance */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Insurance Profile */}
          <div style={{ background: "white", borderRadius: "24px", padding: "2rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={20} color="#084d38" /> Coverage Profile
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>Primary Care</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                  {profileData.primaryCare || "Not Set"}
                </div>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0" }} />
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>Primary Payer</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                  <div style={{ width: "28px", height: "28px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#084d38" }}>A</div>
                  Aetna Medicare 
                </div>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0" }} />
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>Prior Auths on File</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#10b981" }}>Humira (Exp: 10/2026)</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Clinical Alerts */}
          <div style={{ background: "#fffbeb", borderRadius: "24px", padding: "2rem", border: "1px solid #fde68a", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#92400e", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={20} color="#d97706" /> Clinical Alerts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ padding: "1rem", background: "white", borderRadius: "12px", border: "1px solid #fde68a", borderLeft: "4px solid #f59e0b" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#d97706", fontWeight: 700, textTransform: "uppercase" }}>Upcoming Renewal</p>
                <p style={{ margin: "0 0 4px", fontSize: "0.95rem", color: "#1e293b", lineHeight: 1.5 }}>
                  Humira authorization expires in 6 months for {user.name}. Begin gathering updated clinical notes for re-auth.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
