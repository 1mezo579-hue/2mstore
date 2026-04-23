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
  Menu,
  X
} from "lucide-react";

import { logout } from "@/app/actions/auth";

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (e) {
      window.location.href = "/";
    }
  };

  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", roles: ["OWNER", "MANAGER", "SELLER"] },
    { id: "inventory", label: "المخزون", roles: ["OWNER", "MANAGER"] },
    { id: "pos", label: "نقطة البيع (POS)", roles: ["OWNER", "MANAGER", "SELLER"] },
    { id: "maintenance", label: "الصيانة", roles: ["OWNER", "MANAGER", "MAINTENANCE"] },
    { id: "reports", label: "التقارير", roles: ["OWNER", "MANAGER"] },
    { id: "branches", label: "الفروع", roles: ["OWNER", "MANAGER"] },
    { id: "users", label: "المستخدمين", roles: ["OWNER", "MANAGER"] },
  ];

  const NavIcon = ({ id }: { id: string }) => {
    if (id === "dashboard") return <LayoutDashboard size={20} />;
    if (id === "inventory") return <Package size={20} />;
    if (id === "pos") return <ShoppingCart size={20} />;
    if (id === "maintenance") return <Wrench size={20} />;
    if (id === "reports") return <FileText size={20} />;
    if (id === "branches") return <Store size={20} />;
    if (id === "users") return <Users size={20} />;
    return null;
  };

  const visibleNavItems = navItems.filter(item =>
    !user || item.roles.includes(user.role)
  );

  const userInitial = user ? user.name.charAt(0).toUpperCase() : "A";
  const userName = user ? user.name : "إسلام";
  const userRole = user ? user.role : "مدير النظام";

  return (
    <div className="app-container">
      {/* Floating Background Symbols */}
      <div className="bg-symbols">
        <span className="floating-symbol symbol-triangle"></span>
        <span className="floating-symbol symbol-circle"></span>
        <span className="floating-symbol symbol-x"></span>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
            >
              <span className="nav-icon"><NavIcon id={item.id} /></span>
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
                style={{ width: "100%", padding: "14px 55px 14px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", color: "white", fontSize: "0.95rem", outline: "none" }}
              />
            </div>
          </div>

          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <button
              onClick={() => setIsNotifModalOpen(true)}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "12px", borderRadius: "15px", cursor: "pointer", position: "relative" }}
            >
              <Bell size={22} />
              <span style={{ position: "absolute", top: "-5px", left: "-5px", background: "var(--neon-circle)", width: "20px", height: "20px", borderRadius: "50%", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>3</span>
            </button>
            <div
              onClick={() => setIsProfileModalOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "15px", background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #0072FF, #00C6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.1rem" }}>
                {userInitial}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1rem", fontWeight: "800" }}>{userName}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--ps-primary)", fontWeight: "700" }}>{userRole}</div>
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

      {/* User Profile Modal */}
      {isProfileModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="card" style={{ width: "95%", maxWidth: "450px", textAlign: "center", padding: "50px 40px", position: "relative" }}>
            <button onClick={() => setIsProfileModalOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <X size={24} />
            </button>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, #0072FF, #00C6FF)", margin: "0 auto 25px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "900", boxShadow: "0 0 30px rgba(0, 114, 255, 0.5)" }}>
              {userInitial}
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "5px" }}>{userName}</h2>
            <span className="ps-tag tag-blue" style={{ fontSize: "0.9rem", padding: "5px 20px" }}>{userRole}</span>
            <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "15px", textAlign: "right" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "15px 20px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>الفرع الحالي</div>
                <div style={{ fontWeight: "700" }}>المركز الرئيسي - 2M Store</div>
              </div>
            </div>
            <button className="btn-liquid" onClick={handleLogout} style={{ width: "100%", marginTop: "35px", justifyContent: "center", background: "rgba(255, 77, 109, 0.1)", color: "var(--neon-circle)", border: "1px solid rgba(255, 77, 109, 0.2)" }}>
              <LogOut size={20} /> تسجيل الخروج من النظام
            </button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {isNotifModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="card" style={{ width: "95%", maxWidth: "500px", padding: "0" }}>
            <div style={{ padding: "30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "900" }}>تنبيهات النظام</h3>
              <button onClick={() => setIsNotifModalOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", padding: "15px", borderRadius: "15px", background: "rgba(255,255,255,0.03)", borderRight: "4px solid var(--neon-circle)" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--neon-circle)", flexShrink: 0 }} />
                <div><div style={{ fontWeight: "700" }}>نقص في مخزون أجهزة التحكم</div><div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>منذ ساعتين</div></div>
              </div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", padding: "15px", borderRadius: "15px", background: "rgba(255,255,255,0.03)", borderRight: "4px solid var(--ps-primary)" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--ps-primary)", flexShrink: 0 }} />
                <div><div style={{ fontWeight: "700" }}>تم تحديث أسعار الألعاب</div><div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>منذ 4 ساعات</div></div>
              </div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", padding: "15px", borderRadius: "15px", background: "rgba(255,255,255,0.03)", borderRight: "4px solid var(--neon-triangle)" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--neon-triangle)", flexShrink: 0 }} />
                <div><div style={{ fontWeight: "700" }}>عميل جديد مسجل</div><div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>منذ 6 ساعات</div></div>
              </div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", padding: "15px", borderRadius: "15px", background: "rgba(255,255,255,0.03)", borderRight: "4px solid var(--ps-primary)" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--ps-primary)", flexShrink: 0 }} />
                <div><div style={{ fontWeight: "700" }}>اكتملت عملية صيانة جهاز PS5</div><div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>منذ يوم واحد</div></div>
              </div>
            </div>
            <div style={{ padding: "20px", borderTop: "var(--glass-border)" }}>
              <button className="btn-liquid" style={{ width: "100%", justifyContent: "center" }} onClick={() => setIsNotifModalOpen(false)}>تجاهل الكل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
