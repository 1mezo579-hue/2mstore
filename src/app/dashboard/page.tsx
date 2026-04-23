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
        const decoded = decodeURIComponent(userDataCookie.split('=')[1]);
        setUser(JSON.parse(decoded));
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
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ padding: "0 30px", marginBottom: "40px" }}>
          <div className="flex items-center gap-3">
             <div style={{ background: "var(--ps-primary)", padding: "8px", borderRadius: "12px", boxShadow: "0 0 15px var(--ps-primary-glow)" }}>
                <Gamepad2 size={24} color="#FFFFFF" />
             </div>
             <h2 className="logo-text" style={{ fontSize: "1.2rem", fontWeight: "900", letterSpacing: "1px" }}>2M Store</h2>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1 }}>
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

        <div className="sidebar-footer" style={{ paddingBottom: "20px" }}>
          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
            <button 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-icon"><Settings size={20} /></span>
              <span className="nav-label">الإعدادات</span>
            </button>
          )}
          <button className="nav-item logout" onClick={handleLogout} disabled={loggingOut} style={{ color: "#ff4444" }}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="flex items-center gap-6">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <Menu size={24} />
            </button>
            <div className="header-search" style={{ position: "relative", width: "400px" }}>
              <Search size={18} style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input 
                type="text" 
                placeholder="ابحث هنا..." 
                style={{ width: "100%", padding: "10px 45px 10px 15px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white", fontSize: "0.9rem" }}
              />
            </div>
          </div>
          
          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button style={{ background: "var(--ps-surface-light)", border: "none", color: "white", padding: "10px", borderRadius: "10px", cursor: "pointer", position: "relative" }}>
              <Bell size={20} />
              <span style={{ position: "absolute", top: "-5px", left: "-5px", background: "var(--ps-primary)", width: "18px", height: "18px", borderRadius: "50%", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyCenter: "center" }}>3</span>
            </button>
            <div className="user-profile" style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--ps-surface-light)", padding: "6px 15px", borderRadius: "50px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--ps-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                {user ? user.name.charAt(0).toUpperCase() : "E"}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>{user ? user.name : "إسلام"}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{user ? user.role : "مدير النظام"}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <div className="animate-sweet">
            {activeTab === "dashboard" && <DashboardOverview />}
            {activeTab === "inventory" && <InventoryPanel />}
            {activeTab === "pos" && <POSPanel />}
            {activeTab === "maintenance" && <MaintenancePanel />}
            {activeTab === "reports" && (
              <div className="card" style={{ textAlign: "center", padding: "100px" }}>
                <FileText size={64} style={{ color: "var(--ps-primary)", opacity: 0.5, marginBottom: "20px" }} />
                <h2 style={{ fontSize: "1.5rem" }}>جاري العمل على قسم التقارير...</h2>
              </div>
            )}
            {activeTab === "branches" && <BranchesPanel />}
            {activeTab === "users" && <UsersPanel />}
            {activeTab === "settings" && <SettingsPanel />}
          </div>
        </div>
      </main>

      <style jsx>{`
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 20px;
        }
        .logout:hover {
          background: rgba(255, 68, 68, 0.1) !important;
        }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-3 { gap: 12px; }
        .gap-6 { gap: 24px; }
      `}</style>
    </div>
  );
}
