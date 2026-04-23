"use client";

import React, { useState } from "react";
import { Settings, Save, Globe, Lock, Bell, Database, HardDrive, Smartphone, Monitor } from "lucide-react";

export default function SettingsPanel() {
  const [activeSetting, setActiveSetting] = useState("general");

  const settingsTabs = [
    { id: "general", label: "إعدادات عامة", icon: Globe },
    { id: "security", label: "الأمان", icon: Lock },
    { id: "notifications", label: "التنبيهات", icon: Bell },
    { id: "database", label: "قاعدة البيانات", icon: Database },
  ];

  return (
    <div className="settings-panel">
      <div className="page-header">
        <span className="section-label">التكوين</span>
        <h1 className="page-title">إعدادات النظام</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "30px", marginTop: "30px" }}>
        {/* Settings Navigation */}
        <div className="card" style={{ padding: "10px" }}>
          {settingsTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveSetting(tab.id)}
              style={{ 
                padding: "15px 20px", 
                borderRadius: "12px", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: activeSetting === tab.id ? "var(--ps-surface-light)" : "transparent",
                color: activeSetting === tab.id ? "white" : "var(--text-dim)",
                transition: "all 0.2s"
              }}
            >
              <tab.icon size={18} color={activeSetting === tab.id ? "var(--ps-primary)" : "currentColor"} />
              <span style={{ fontWeight: activeSetting === tab.id ? "600" : "normal" }}>{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div className="card animate-sweet">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
             <h2 style={{ fontSize: "1.3rem" }}>{settingsTabs.find(t => t.id === activeSetting)?.label}</h2>
             <button className="btn-sweet btn-sweet-primary"><Save size={18} /> حفظ التغييرات</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
               <label style={{ fontSize: "0.95rem", fontWeight: "600" }}>اسم المتجر</label>
               <input type="text" defaultValue="2M Store" style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
               <label style={{ fontSize: "0.95rem", fontWeight: "600" }}>العملة الافتراضية</label>
               <select style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }}>
                  <option>جنيه مصري (EGP)</option>
                  <option>دولار أمريكي (USD)</option>
               </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "15px" }}>
               <div>
                  <div style={{ fontWeight: "600" }}>وضع الصيانة</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>إغلاق المتجر مؤقتاً لإجراء تحديثات</div>
               </div>
               <div style={{ width: "50px", height: "26px", background: "var(--ps-surface-light)", borderRadius: "50px", position: "relative", cursor: "pointer" }}>
                  <div style={{ position: "absolute", left: "4px", top: "4px", width: "18px", height: "18px", background: "var(--text-dim)", borderRadius: "50%" }}></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
