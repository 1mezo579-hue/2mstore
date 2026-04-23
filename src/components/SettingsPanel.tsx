"use client";

import React, { useState } from "react";
import { Settings, Save, Globe, Lock, Bell, Database, HardDrive, Smartphone, Monitor, Shield, Zap } from "lucide-react";

export default function SettingsPanel() {
  const [activeSetting, setActiveSetting] = useState("general");
  const [storeName, setStoreName] = useState("2M Store - المركز الرئيسي");
  const [language, setLanguage] = useState("العربية (Arabic)");
  const [currency, setCurrency] = useState("جنيه مصري (EGP)");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const handleSave = () => {
    alert(`تم حفظ الإعدادات بنجاح!\nاسم المتجر: ${storeName}\nاللغة: ${language}\nالعملة: ${currency}`);
  };

  const settingsTabs = [
    { id: "general", label: "إعدادات عامة", icon: Globe },
    { id: "security", label: "الأمان والحماية", icon: Shield },
    { id: "notifications", label: "التنبيهات", icon: Bell },
    { id: "database", label: "قاعدة البيانات", icon: Database },
  ];

  return (
    <div className="settings-panel animate-liquid">
      <div className="page-header" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
           <Settings size={20} color="var(--ps-primary)" />
           <span className="section-label" style={{ margin: 0 }}>التكوين البرمجي</span>
        </div>
        <h1 className="page-title">إعدادات النظام</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "40px" }}>
        {/* Settings Navigation */}
        <div className="card" style={{ padding: "15px", height: "fit-content" }}>
          {settingsTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveSetting(tab.id)}
              style={{ 
                padding: "18px 25px", 
                borderRadius: "100px", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                background: activeSetting === tab.id ? "rgba(0, 114, 255, 0.1)" : "transparent",
                color: activeSetting === tab.id ? "white" : "var(--text-dim)",
                border: activeSetting === tab.id ? "1px solid rgba(0, 114, 255, 0.2)" : "1px solid transparent",
                transition: "all 0.3s",
                fontWeight: "800"
              }}
            >
              <tab.icon size={20} color={activeSetting === tab.id ? "var(--ps-primary)" : "currentColor"} />
              <span>{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div className="card" style={{ borderTop: "4px solid var(--ps-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
             <div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "900" }}>{settingsTabs.find(t => t.id === activeSetting)?.label}</h2>
                <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>تحكم في كيفية عمل النظام وتخصيص تجربتك</p>
             </div>
             <button className="btn-liquid btn-liquid-primary" onClick={handleSave}><Save size={20} /> حفظ التعديلات</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
            {activeSetting === "general" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                   <label style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-soft)" }}>اسم المتجر الرسمي</label>
                   <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", fontSize: "1rem", outline: "none" }} 
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <label style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-soft)" }}>اللغة الافتراضية</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }}
                      >
                         <option>العربية (Arabic)</option>
                         <option>English (الإنجليزية)</option>
                      </select>
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <label style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-soft)" }}>العملة</label>
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }}
                      >
                         <option>جنيه مصري (EGP)</option>
                         <option>دولار أمريكي (USD)</option>
                      </select>
                   </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "25px", background: "rgba(255,255,255,0.02)", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.05)" }}>
                   <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                      <div style={{ background: "rgba(255, 77, 109, 0.1)", padding: "12px", borderRadius: "15px", color: "var(--neon-circle)" }}>
                         <Zap size={24} />
                      </div>
                      <div>
                         <div style={{ fontWeight: "900", fontSize: "1.1rem" }}>وضع الصيانة الاحترافي</div>
                         <div style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>منع الموظفين من الوصول للنظام أثناء التحديثات</div>
                      </div>
                   </div>
                   <div 
                    onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                    style={{ 
                      width: "60px", 
                      height: "30px", 
                      background: isMaintenanceMode ? "var(--ps-primary)" : "rgba(255,255,255,0.1)", 
                      borderRadius: "100px", 
                      position: "relative", 
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}
                  >
                      <div style={{ 
                        position: "absolute", 
                        left: isMaintenanceMode ? "34px" : "4px", 
                        top: "4px", 
                        width: "22px", 
                        height: "22px", 
                        background: "white", 
                        borderRadius: "50%",
                        transition: "all 0.3s"
                      }}></div>
                   </div>
                </div>
              </>
            )}

            {activeSetting !== "general" && (
              <div style={{ textAlign: "center", padding: "60px", opacity: 0.5 }}>
                 <Lock size={60} style={{ marginBottom: "20px" }} />
                 <h3 style={{ fontSize: "1.2rem", fontWeight: "800" }}>هذه الإعدادات مقفلة حالياً</h3>
                 <p>يرجى التواصل مع الدعم الفني لفتح صلاحيات متقدمة</p>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "20px", background: "rgba(0, 114, 255, 0.05)", borderRadius: "15px", border: "1px solid rgba(0, 114, 255, 0.1)", color: "var(--ps-primary)" }}>
               <HardDrive size={20} />
               <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>تنبيه: مساحة قاعدة البيانات المتبقية هي 85% - لا توجد مخاطر حالية.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
