"use client";

import React, { useState, useEffect } from "react";
import { FileText, TrendingUp, DollarSign, Wrench, Package, AlertTriangle } from "lucide-react";
import { getReportsData } from "@/app/actions/reports";

export default function ReportsPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportsData().then(d => { setData(d); setLoading(false); });
  }, []);

  const fmt = (n: number) => (n || 0).toLocaleString();

  return (
    <div className="reports-panel animate-liquid">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <FileText size={20} color="var(--ps-primary)" />
          <span className="section-label" style={{ margin: 0 }}>تحليلات الأداء</span>
        </div>
        <h1 className="page-title">التقارير والإحصائيات</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <div className="card" style={{ borderBottom: "4px solid var(--ps-primary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ background: "rgba(0,114,255,0.1)", padding: "12px", borderRadius: "15px", color: "var(--ps-primary)" }}>
              <DollarSign size={26} />
            </div>
            <span style={{ color: "var(--text-soft)", fontWeight: "600" }}>إجمالي المبيعات</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "900" }}>{loading ? "..." : `${fmt(data?.totalRevenue)} ج.م`}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "5px" }}>{loading ? "" : `${data?.totalSalesCount || 0} عملية بيع`}</div>
        </div>

        <div className="card" style={{ borderBottom: "4px solid var(--neon-triangle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ background: "rgba(0,255,204,0.1)", padding: "12px", borderRadius: "15px", color: "var(--neon-triangle)" }}>
              <Wrench size={26} />
            </div>
            <span style={{ color: "var(--text-soft)", fontWeight: "600" }}>إيرادات الصيانة</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "900" }}>{loading ? "..." : `${fmt(data?.maintenanceRevenue)} ج.م`}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "5px" }}>{loading ? "" : `${data?.ticketsByStatus?.DONE || 0} طلب مكتمل`}</div>
        </div>

        <div className="card" style={{ borderBottom: "4px solid var(--neon-square)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ background: "rgba(209,97,255,0.1)", padding: "12px", borderRadius: "15px", color: "var(--neon-square)" }}>
              <TrendingUp size={26} />
            </div>
            <span style={{ color: "var(--text-soft)", fontWeight: "600" }}>إجمالي الإيرادات</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "900" }}>{loading ? "..." : `${fmt((data?.totalRevenue || 0) + (data?.maintenanceRevenue || 0))} ج.م`}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "5px" }}>مبيعات + صيانة</div>
        </div>

        <div className="card" style={{ borderBottom: "4px solid var(--neon-circle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ background: "rgba(255,77,109,0.1)", padding: "12px", borderRadius: "15px", color: "var(--neon-circle)" }}>
              <AlertTriangle size={26} />
            </div>
            <span style={{ color: "var(--text-soft)", fontWeight: "600" }}>منتجات قاربت النفاد</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "900" }}>{loading ? "..." : data?.lowStockItems?.length || 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "5px" }}>أقل من 5 قطع</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
        {/* Maintenance Status Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Wrench size={20} color="var(--neon-triangle)" /> حالة طلبات الصيانة
          </h3>
          {loading ? <div style={{ opacity: 0.3, textAlign: "center", padding: "40px" }}>جاري التحميل...</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {[
                { label: "معلق", key: "PENDING", color: "var(--neon-circle)" },
                { label: "قيد الإصلاح", key: "IN_PROGRESS", color: "var(--ps-primary)" },
                { label: "مكتمل", key: "DONE", color: "var(--neon-triangle)" },
              ].map(s => {
                const count = data?.ticketsByStatus?.[s.key] || 0;
                const total = data?.totalTickets || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={s.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontWeight: "700", color: s.color }}>{s.label}</span>
                      <span style={{ fontWeight: "900" }}>{count} <small style={{ opacity: 0.5 }}>({pct}%)</small></span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "100px" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: "100px", boxShadow: `0 0 8px ${s.color}` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inventory by Category */}
        <div className="card">
          <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Package size={20} color="var(--neon-square)" /> قيمة المخزون بالفئات
          </h3>
          {loading ? <div style={{ opacity: 0.3, textAlign: "center", padding: "40px" }}>جاري التحميل...</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {Object.entries(data?.byCategory || {}).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", opacity: 0.3 }}>لا توجد بيانات</div>
              ) : Object.entries(data?.byCategory || {}).map(([cat, val]: [string, any], i) => {
                const colors = ["var(--ps-primary)", "var(--neon-triangle)", "var(--neon-square)", "var(--neon-circle)", "var(--neon-x)"];
                const color = colors[i % colors.length];
                return (
                  <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", borderRight: `3px solid ${color}` }}>
                    <span style={{ fontWeight: "700" }}>{cat}</span>
                    <span style={{ fontWeight: "900", color }}>{fmt(val)} ج.م</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Warning */}
      {!loading && (data?.lowStockItems?.length || 0) > 0 && (
        <div className="card" style={{ borderTop: "4px solid var(--neon-circle)", padding: "0" }}>
          <div style={{ padding: "25px 30px", borderBottom: "var(--glass-border)", display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle size={22} color="var(--neon-circle)" />
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--neon-circle)" }}>تحذير — منتجات قاربت على النفاد</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="liquid-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>الفئة</th>
                  <th>الكمية المتبقية</th>
                  <th>السعر</th>
                </tr>
              </thead>
              <tbody>
                {data.lowStockItems.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: "700" }}>{item.name}</td>
                    <td><span className="ps-tag">{item.category}</span></td>
                    <td><span style={{ color: "var(--neon-circle)", fontWeight: "900" }}>{item.quantity} قطعة</span></td>
                    <td style={{ color: "var(--ps-primary)", fontWeight: "800" }}>{(Number(item.sellPrice) || 0).toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="card" style={{ padding: "0", marginTop: "30px" }}>
        <div style={{ padding: "25px 30px", borderBottom: "var(--glass-border)" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "800" }}>آخر المبيعات (7 أيام)</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="liquid-table">
            <thead>
              <tr>
                <th>رقم العملية</th>
                <th>التاريخ والوقت</th>
                <th>المبلغ الكلي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px", opacity: 0.3 }}>جاري التحميل...</td></tr>
              ) : (data?.recentSales?.length || 0) === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "60px", color: "var(--text-dim)" }}>لا توجد مبيعات في آخر 7 أيام</td></tr>
              ) : data.recentSales.map((sale: any, i: number) => (
                <tr key={sale.id || i}>
                  <td>#{(sale.id || "").toString().slice(-6)}</td>
                  <td>{sale.createdAt ? new Date(sale.createdAt).toLocaleString("ar-EG") : "-"}</td>
                  <td style={{ color: "var(--ps-primary)", fontWeight: "800" }}>{fmt(Number(sale.totalAmount))} ج.م</td>
                  <td><span className="ps-tag tag-green">مكتمل</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
