"use client";

import React, { useState, useEffect } from "react";
import { Wrench, Package, DollarSign, Activity, Bell, X, ShoppingCart } from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboard";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const todaySalesFormatted = stats ? (stats.todaySales || 0).toLocaleString() : "...";
  const totalItemsVal = stats ? String(stats.totalItems || 0) : "...";
  const pendingTicketsVal = stats ? String(stats.pendingTickets || 0) : "...";
  const lowStockVal = stats ? String(stats.lowStock || 0) : "...";

  const StatCard = ({
    label, value, trend, trendLabel, color, bg, Icon
  }: {
    label: string; value: string; trend: string; trendLabel: string;
    color: string; bg: string; Icon: React.ElementType;
  }) => (
    <div className="card" style={{ borderBottom: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ background: bg, color, padding: "14px", borderRadius: "18px", boxShadow: `0 0 15px ${color}30` }}>
          <Icon size={28} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "0.85rem", color, fontWeight: "900" }}>{trend}</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{trendLabel}</span>
        </div>
      </div>
      <div style={{ color: "var(--text-soft)", fontSize: "0.95rem", marginBottom: "8px", fontWeight: "600" }}>{label}</div>
      <div style={{ fontSize: "2.2rem", fontWeight: "900", letterSpacing: "-1px" }}>{loading ? "..." : value}</div>
    </div>
  );

  return (
    <div className="dashboard-overview animate-liquid">
      <div className="page-header" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <Activity size={20} color="var(--ps-primary)" />
          <span className="section-label" style={{ margin: 0 }}>نظرة عامة على النظام</span>
        </div>
        <h1 className="page-title">مرحباً بك، إسلام</h1>
      </div>

      {/* Stats Cards - Real Data */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "25px" }}>
        <StatCard
          label="مبيعات اليوم"
          value={`${todaySalesFormatted} ج.م`}
          trend={`${stats?.todaySalesCount || 0} عملية`}
          trendLabel="اليوم"
          color="var(--ps-primary)"
          bg="rgba(0, 114, 255, 0.1)"
          Icon={DollarSign}
        />
        <StatCard
          label="طلبات الصيانة قيد العمل"
          value={pendingTicketsVal}
          trend={`${stats?.totalTickets || 0} إجمالي`}
          trendLabel="كل الطلبات"
          color="var(--neon-triangle)"
          bg="rgba(0, 255, 204, 0.1)"
          Icon={Wrench}
        />
        <StatCard
          label="المنتجات بالمخزن"
          value={totalItemsVal}
          trend={`${lowStockVal} نفذت`}
          trendLabel="تحتاج تجديد"
          color="var(--neon-square)"
          bg="rgba(209, 97, 255, 0.1)"
          Icon={Package}
        />
        <StatCard
          label="إجمالي قيمة المخزون"
          value={stats ? `${(stats.inventoryValue || 0).toLocaleString()} ج.م` : "..."}
          trend="تقدير"
          trendLabel="القيمة الكلية"
          color="var(--neon-circle)"
          bg="rgba(255, 77, 109, 0.1)"
          Icon={ShoppingCart}
        />
      </div>

      {/* Bottom Section */}
      <div className="overview-content-grid" style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "30px" }}>

        {/* Recent Sales Table - Real Data */}
        <div className="card" style={{ padding: "0" }}>
          <div style={{ padding: "30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800" }}>آخر المبيعات</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>آخر عمليات البيع المسجلة</p>
            </div>
            <button className="btn-liquid" onClick={() => setIsLogOpen(true)} style={{ fontSize: "0.8rem", padding: "8px 20px" }}>سجل كامل</button>
          </div>
          <div style={{ padding: "0 20px", overflowX: "auto" }}>
            <table className="liquid-table">
              <thead>
                <tr>
                  <th>رقم العملية</th>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px", opacity: 0.3 }}>جاري التحميل...</td></tr>
                ) : (stats?.recentSales?.length || 0) === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: "60px", color: "var(--text-dim)" }}>لا توجد مبيعات مسجلة بعد</td></tr>
                ) : stats.recentSales.map((sale: any, i: number) => (
                  <tr key={sale.id || i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--ps-primary)", flexShrink: 0 }} />
                        بيع #{(sale.id || "").toString().slice(-6)}
                      </div>
                    </td>
                    <td>{sale.createdAt ? new Date(sale.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td style={{ fontWeight: "800", color: "var(--ps-primary)" }}>{(Number(sale.totalAmount) || 0).toLocaleString()} ج.م</td>
                    <td><span className="ps-tag tag-green">مكتمل</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Maintenance - Real Data */}
        <div className="card" style={{ background: "linear-gradient(180deg, var(--ps-surface), transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
            <Bell size={24} color="var(--neon-circle)" />
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800" }}>آخر طلبات الصيانة</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "30px", opacity: 0.3 }}>جاري التحميل...</div>
            ) : (stats?.recentMaint?.length || 0) === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-dim)", opacity: 0.5 }}>
                <Bell size={40} style={{ marginBottom: "15px" }} />
                <p>لا توجد طلبات صيانة</p>
              </div>
            ) : stats.recentMaint.map((t: any, i: number) => {
              const statusColor = t.status === "DONE" ? "var(--neon-triangle)" : t.status === "IN_PROGRESS" ? "var(--ps-primary)" : "var(--neon-circle)";
              const statusLabel = t.status === "DONE" ? "مكتمل" : t.status === "IN_PROGRESS" ? "قيد الإصلاح" : "معلق";
              return (
                <div key={t.id || i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 15px", borderRadius: "15px", background: "rgba(255,255,255,0.03)", borderRight: `3px solid ${statusColor}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>{t.deviceType || "جهاز غير محدد"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{t.customerName}</div>
                  </div>
                  <span className="ps-tag" style={{ color: statusColor, borderColor: statusColor, fontSize: "0.7rem" }}>{statusLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Sales Log Modal */}
      {isLogOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ width: "95%", maxWidth: "700px", padding: "0" }}>
            <div style={{ padding: "30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "900" }}>سجل المبيعات الكامل</h3>
              <button onClick={() => setIsLogOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: "30px", maxHeight: "500px", overflowY: "auto" }}>
              <table className="liquid-table">
                <thead>
                  <tr>
                    <th>رقم العملية</th>
                    <th>التاريخ</th>
                    <th>المبلغ الكلي</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentSales?.length || 0) === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: "center", padding: "60px", opacity: 0.4 }}>لا توجد مبيعات مسجلة</td></tr>
                  ) : stats.recentSales.map((sale: any, i: number) => (
                    <tr key={sale.id || i}>
                      <td>#{(sale.id || "").toString().slice(-6)}</td>
                      <td>{sale.createdAt ? new Date(sale.createdAt).toLocaleString("ar-EG") : "-"}</td>
                      <td style={{ color: "var(--ps-primary)", fontWeight: "800" }}>{(Number(sale.totalAmount) || 0).toLocaleString()} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "20px", borderTop: "var(--glass-border)" }}>
              <button className="btn-liquid btn-liquid-primary" onClick={() => setIsLogOpen(false)} style={{ width: "100%", justifyContent: "center" }}>إغلاق السجل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
