"use client";

import React from "react";
import { ShoppingCart, Wrench, Package, TrendingUp, Users, DollarSign, Activity, Bell } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { label: "المبيعات اليومية", value: "1,250 ج.م", icon: <DollarSign size={28} />, color: "var(--ps-primary)", trend: "+12%", bg: "rgba(0, 114, 255, 0.1)" },
    { label: "طلبات الصيانة", value: "8", icon: <Wrench size={28} />, color: "var(--neon-triangle)", trend: "5 قيد العمل", bg: "rgba(0, 255, 204, 0.1)" },
    { label: "المنتجات بالمخزن", value: "142", icon: <Package size={28} />, color: "var(--neon-square)", trend: "12 نفذت", bg: "rgba(209, 97, 255, 0.1)" },
    { label: "العملاء الجدد", value: "24", icon: <Users size={28} />, color: "var(--neon-circle)", trend: "+4 اليوم", bg: "rgba(255, 77, 109, 0.1)" },
  ];

  return (
    <div className="dashboard-overview animate-liquid">
      <div className="page-header" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
           <Activity size={20} color="var(--ps-primary)" />
           <span className="section-label" style={{ margin: 0 }}>نظرة عامة على النظام</span>
        </div>
        <h1 className="page-title">مرحباً بك، إسلام</h1>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "25px" }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ borderBottom: `4px solid ${stat.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ background: stat.bg, color: stat.color, padding: "14px", borderRadius: "18px", boxShadow: `0 0 15px ${stat.color}30` }}>
                {stat.icon}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                 <span style={{ fontSize: "0.85rem", color: stat.color, fontWeight: "900" }}>{stat.trend}</span>
                 <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>منذ أمس</span>
              </div>
            </div>
            <div style={{ color: "var(--text-soft)", fontSize: "0.95rem", marginBottom: "8px", fontWeight: "600" }}>{stat.label}</div>
            <div style={{ fontSize: "2.2rem", fontWeight: "900", letterSpacing: "-1px" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="overview-content-grid" style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "30px" }}>
        <div className="card" style={{ padding: "0" }}>
          <div style={{ padding: "30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
               <h3 style={{ fontSize: "1.4rem", fontWeight: "800" }}>آخر العمليات</h3>
               <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>تحديث فوري لكل ما يحدث في المتجر</p>
            </div>
            <button className="btn-liquid" style={{ fontSize: "0.8rem", padding: "8px 20px" }}>سجل العمليات</button>
          </div>
          <div style={{ padding: "0 20px", overflowX: "auto" }}>
            <table className="liquid-table">
              <thead>
                <tr>
                  <th>العملية</th>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--ps-primary)" }}></div>
                        بيع ذراع تحكم PS5
                     </div>
                  </td>
                  <td>11:30 ص</td>
                  <td style={{ fontWeight: "800", color: "var(--ps-primary)" }}>1,800 ج.م</td>
                  <td><span className="ps-tag tag-green">مكتمل</span></td>
                </tr>
                <tr>
                  <td>
                     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--neon-triangle)" }}></div>
                        صيانة جهاز PS4 Pro
                     </div>
                  </td>
                  <td>10:15 ص</td>
                  <td style={{ fontWeight: "800", color: "var(--ps-primary)" }}>450 ج.م</td>
                  <td><span className="ps-tag tag-blue" style={{ color: "var(--neon-triangle)" }}>قيد الإصلاح</span></td>
                </tr>
                <tr>
                  <td>
                     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--ps-primary)" }}></div>
                        شراء لعبة FIFA 24
                     </div>
                  </td>
                  <td>09:45 ص</td>
                  <td style={{ fontWeight: "800", color: "var(--ps-primary)" }}>2,100 ج.م</td>
                  <td><span className="ps-tag tag-green">مكتمل</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ background: "linear-gradient(180deg, var(--ps-surface), transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
             <Bell size={24} color="var(--neon-circle)" />
             <h3 style={{ fontSize: "1.4rem", fontWeight: "800" }}>تنبيهات النظام</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { msg: "نقص في مخزون أجهزة التحكم", time: "منذ ساعتين", color: "var(--neon-circle)", icon: <Package size={18}/> },
              { msg: "تم تحديث أسعار الألعاب", time: "منذ 4 ساعات", color: "var(--ps-primary)", icon: <TrendingUp size={18}/> },
              { msg: "عميل جديد مسجل", time: "منذ 6 ساعات", color: "var(--neon-triangle)", icon: <Users size={18}/> }
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", gap: "18px", alignItems: "center", padding: "15px", borderRadius: "20px", background: "rgba(255,255,255,0.03)", borderRight: `4px solid ${n.color}` }}>
                <div style={{ color: n.color }}>{n.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>{n.msg}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-liquid" style={{ width: "100%", marginTop: "30px", justifyContent: "center" }}>تجاهل الكل</button>
        </div>
    </div>
  );
}
