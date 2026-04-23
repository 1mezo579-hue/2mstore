"use client";

import React, { useState, useEffect } from "react";
import { 
  Gamepad2, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wrench, 
  FileText, 
  Store,
  Settings,
  Bell,
  Search,
  Users,
  LogOut,
  Menu
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

import DashboardOverview from "@/components/DashboardOverview";
import InventoryPanel from "@/components/InventoryPanel";
import POSPanel from "@/components/POSPanel";
import MaintenancePanel from "@/components/MaintenancePanel";
import BranchesPanel from "@/components/BranchesPanel";
import UsersPanel from "@/components/UsersPanel";
import SettingsPanel from "@/components/SettingsPanel";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const userDataCookie = cookies.find(c => c.trim().startsWith('user_data='));
    if (userDataCookie) {
      try {
        const parts = userDataCookie.split('=');
        if (parts.length > 1) {
          const decoded = decodeURIComponent(parts[1]);
          setUser(JSON.parse(decoded));
        }
      } catch (e) {
        console.error("Error parsing user data cookie", e);
      }
    }
  }, []);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (e) {
      window.location.href = "/";
    }
  };

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={20} />, roles: ["OWNER", "MANAGER", "SELLER"] },
    { id: "inventory", label: "المخزون", icon: <Package size={20} />, roles: ["OWNER", "MANAGER"] },
    { id: "pos", label: "نقطة البيع (POS)", icon: <ShoppingCart size={20} />, roles: ["OWNER", "MANAGER", "SELLER"] },
    { id: "maintenance", label: "الصيانة", icon: <Wrench size={20} />, roles: ["OWNER", "MANAGER", "MAINTENANCE"] },
    { id: "reports", label: "التقارير", icon: <FileText size={20} />, roles: ["OWNER", "MANAGER"] },
    { id: "branches", label: "الفروع", icon: <Store size={20} />, roles: ["OWNER", "MANAGER"] },
    { id: "users", label: "المستخدمين", icon: <Users size={20} />, roles: ["OWNER", "MANAGER"] },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  return (
    <div className="app-container">
      {/* Floating Background Symbols */}
      <div className="bg-symbols">
        <span className="floating-symbol" style={{ width: "100px", height: "100px", top: "10%", left: "5%", color: "var(--neon-triangle)", maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 4L4 20H20L12 4Z\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 4L4 20H20L12 4Z\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")' }}></span>
        <span className="floating-symbol" style={{ width: "80px", height: "80px", top: "60%", right: "10%", color: "var(--neon-circle)", maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'8\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'8\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")', animationDelay: "-5s" }}></span>
        <span className="floating-symbol" style={{ width: "120px", height: "120px", bottom: "5%", left: "15%", color: "var(--neon-x)", maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 6L18 18M18 6L6 18\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 6L18 18M18 6L6 18\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")', animationDelay: "-10s" }}></span>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ padding: "40px 30px", borderBottom: "var(--glass-border)" }}>
          <div className="flex items-center gap-4">
             <div style={{ background: "linear-gradient(135deg, #0072FF, #00C6FF)", padding: "12px", borderRadius: "15px", boxShadow: "0 0 20px rgba(0, 114, 255, 0.4)" }}>
                <Gamepad2 size={28} color="#FFFFFF" />
             </div>
             <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "900", letterSpacing: "1px", margin: 0 }}>2M STORE</h2>
                <span style={{ fontSize: "0.7rem", color: "var(--ps-primary)", fontWeight: "800", letterSpacing: "2px" }}>MANAGEMENT</span>
             </div>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, padding: "20px 0" }}>
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ padding: "20px 0", borderTop: "var(--glass-border)" }}>
          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
            <button 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-icon"><Settings size={20} /></span>
              <span className="nav-label">الإعدادات</span>
            </button>
          )}
          <button className="nav-item logout" onClick={handleLogout} disabled={loggingOut} style={{ color: "var(--neon-circle)" }}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="flex items-center gap-8">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <Menu size={28} />
            </button>
            <div className="header-search" style={{ position: "relative", width: "450px" }}>
              <Search size={20} style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input 
                type="text" 
                placeholder="ابحث عن أي شيء في النظام..." 
                style={{ width: "100%", padding: "14px 55px 14px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", color: "white", fontSize: "0.95rem", outline: "none", transition: "all 0.3s" }}
              />
            </div>
          </div>
          
          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "12px", borderRadius: "15px", cursor: "pointer", position: "relative" }}>
              <Bell size={22} />
              <span style={{ position: "absolute", top: "-5px", left: "-5px", background: "var(--neon-circle)", width: "20px", height: "20px", borderRadius: "50%", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", boxShadow: "0 0 10px rgba(255, 77, 109, 0.5)" }}>3</span>
            </button>
            <div className="user-profile" style={{ display: "flex", alignItems: "center", gap: "15px", background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #0072FF, #00C6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.1rem", boxShadow: "0 0 15px rgba(0, 114, 255, 0.4)" }}>
                {user ? user.name.charAt(0).toUpperCase() : "E"}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1rem", fontWeight: "800" }}>{user ? user.name : "إسلام"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--ps-primary)", fontWeight: "700" }}>{user ? user.role : "مدير النظام"}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <div className="animate-liquid">
            {activeTab === "dashboard" && <DashboardOverview />}
            {activeTab === "inventory" && <InventoryPanel />}
            {activeTab === "pos" && <POSPanel />}
            {activeTab === "maintenance" && <MaintenancePanel />}
            {activeTab === "reports" && (
              <div className="card" style={{ textAlign: "center", padding: "100px" }}>
                <FileText size={80} style={{ color: "var(--ps-primary)", opacity: 0.3, marginBottom: "30px" }} />
                <h2 style={{ fontSize: "2rem", fontWeight: "900" }}>جاري العمل على قسم التقارير...</h2>
                <p style={{ color: "var(--text-soft)", marginTop: "10px" }}>سنقوم بإطلاق هذا القسم قريباً لتوفير تحليلات دقيقة لمتجرك.</p>
              </div>
            )}
            {activeTab === "branches" && <BranchesPanel />}
            {activeTab === "users" && <UsersPanel />}
            {activeTab === "settings" && <SettingsPanel />}
          </div>
        </div>
      </main>
    </div>
  );
}
