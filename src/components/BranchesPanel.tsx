"use client";

import React, { useState, useEffect } from "react";
import { Store, Plus, MapPin, Package, ShoppingCart, Wrench, X, Activity, MoreVertical } from "lucide-react";
import { getBranches, createBranch } from "@/app/actions/branches";

export default function BranchesPanel() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    const data = await getBranches();
    setBranches(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createBranch(formData.name, formData.location);
    setSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setFormData({ name: "", location: "" });
      fetchBranches();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="branches-panel animate-liquid">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
             <Store size={20} color="var(--ps-primary)" />
             <span className="section-label" style={{ margin: 0 }}>الانتشار الجغرافي</span>
          </div>
          <h1 className="page-title">إدارة الفروع</h1>
        </div>
        <button className="btn-liquid btn-liquid-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> إضافة فرع جديد
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "30px" }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} className="card" style={{ height: "300px", opacity: 0.1 }}></div>)
        ) : branches.length === 0 ? (
          <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px", opacity: 0.5 }}>
             <Store size={80} style={{ marginBottom: "20px" }} />
             <p>لا توجد فروع مسجلة حالياً</p>
          </div>
        ) : branches.map(branch => (
          <div key={branch.id} className="card" style={{ padding: "0" }}>
            <div style={{ padding: "30px", borderBottom: "var(--glass-border)" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div style={{ background: "linear-gradient(135deg, #0072FF, #00C6FF)", padding: "15px", borderRadius: "20px", boxShadow: "0 0 20px rgba(0, 114, 255, 0.3)" }}>
                     <Store size={32} color="white" />
                  </div>
                  <span className="ps-tag tag-green">متصل</span>
               </div>
               <h3 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "5px" }}>{branch.name}</h3>
               <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-dim)", fontSize: "0.9rem" }}>
                  <MapPin size={16} />
                  {branch.location || "غير محدد"}
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--glass-border)" }}>
               <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", textAlign: "center" }}>
                  <Package size={20} style={{ color: "var(--ps-primary)", marginBottom: "8px" }} />
                  <div style={{ fontSize: "1.3rem", fontWeight: "900" }}>{branch.itemCount || 0}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>منتج</div>
               </div>
               <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", textAlign: "center" }}>
                  <ShoppingCart size={20} style={{ color: "var(--neon-triangle)", marginBottom: "8px" }} />
                  <div style={{ fontSize: "1.3rem", fontWeight: "900" }}>{branch.saleCount || 0}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>عملية</div>
               </div>
               <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", textAlign: "center" }}>
                  <Wrench size={20} style={{ color: "var(--neon-circle)", marginBottom: "8px" }} />
                  <div style={{ fontSize: "1.3rem", fontWeight: "900" }}>{branch.ticketCount || 0}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>صيانة</div>
               </div>
            </div>

            <div style={{ padding: "20px 30px" }}>
               <button className="btn-liquid" style={{ width: "100%", justifyContent: "center" }}>لوحة تحكم الفرع</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-liquid" style={{ width: "500px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "900" }}>إضافة فرع جديد</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={28}/></button>
             </div>
             <form onSubmit={handleAddBranch} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>اسم الفرع</label>
                  <input type="text" required style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>موقع الفرع</label>
                  <input type="text" required style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <button type="submit" className="btn-liquid btn-liquid-primary" style={{ width: "100%", marginTop: "15px", padding: "18px", justifyContent: "center" }}>{submitting ? "جاري الحفظ..." : "تأكيد إضافة الفرع"}</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
