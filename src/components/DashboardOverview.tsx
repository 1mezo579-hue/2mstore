"use client";

import React from "react";
import { ShoppingCart, Wrench, Package, TrendingUp, Users, DollarSign } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { label: "المبيعات اليومية", value: "1,250 ج.م", icon: <DollarSign />, color: "var(--ps-primary)", trend: "+12%" },
    { label: "طلبات الصيانة", value: "8", icon: <Wrench />, color: "var(--clr-triangle)", trend: "5 قيد العمل" },
    { label: "المنتجات بالمخزن", value: "142", icon: <Package />, color: "var(--clr-square)", trend: "12 نفذت" },
    { label: "العملاء الجدد", value: "24", icon: <Users />, color: "var(--clr-circle)", trend: "+4 اليوم" },
  ];

  return (
    <div className="dashboard-overview">
      <div className="page-header">
        <span className="section-label">نظرة عامة</span>
        <h1 className="page-title">لوحة التحكم الرئيسية</h1>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px", marginTop: "30px" }}>
        {stats.map((stat, i) => (
          <div key={i} className="card animate-sweet" style={{ animationDelay: `${i * 0.1}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: "12px", borderRadius: "15px" }}>
                {React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}
              </div>
              <span style={{ fontSize: "0.8rem", color: stat.color, fontWeight: "bold" }}>{stat.trend}</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "5px" }}>{stat.label}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.2rem" }}>آخر العمليات</h3>
            <button className="btn-sweet" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>عرض الكل</button>
          </div>
          <table className="sweet-table">
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
                <td>بيع ذراع تحكم PS5</td>
                <td>11:30 ص</td>
                <td>1,800 ج.م</td>
                <td><span style={{ color: "var(--clr-triangle)" }}>مكتمل</span></td>
              </tr>
              <tr>
                <td>صيانة جهاز PS4 Pro</td>
                <td>10:15 ص</td>
                <td>450 ج.م</td>
                <td><span style={{ color: "var(--ps-primary)" }}>قيد التنفيذ</span></td>
              </tr>
              <tr>
                <td>شراء لعبة FIFA 24</td>
                <td>09:45 ص</td>
                <td>2,100 ج.م</td>
                <td><span style={{ color: "var(--clr-triangle)" }}>مكتمل</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{ background: "linear-gradient(to bottom, var(--ps-surface), var(--ps-bg))" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>تنبيهات النظام</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {[
              { msg: "نقص في مخزون أجهزة التحكم", time: "منذ ساعتين", color: "var(--clr-circle)" },
              { msg: "تم تحديث أسعار الألعاب", time: "منذ 4 ساعات", color: "var(--ps-primary)" },
              { msg: "عميل جديد مسجل", time: "منذ 6 ساعات", color: "var(--clr-triangle)" }
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", gap: "15px", alignItems: "center", padding: "10px", borderRadius: "10px", borderRight: `3px solid ${n.color}`, background: "rgba(255,255,255,0.02)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem" }}>{n.msg}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
