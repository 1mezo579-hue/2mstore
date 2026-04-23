"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Package, Tag, Layers, ArrowLeftRight } from "lucide-react";
import { getInventoryItems, addInventoryItem, deleteInventoryItem } from "@/app/actions/inventory";

export default function InventoryPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    category: "أجهزة",
    price: 0,
    quantity: 0
  });

  const fetchItems = async () => {
    setIsLoading(true);
    const data = await getInventoryItems();
    setItems(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addInventoryItem(formData);
    if (res.success) {
      setIsModalOpen(false);
      setFormData({ name: "", category: "أجهزة", price: 0, quantity: 0 });
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      const res = await deleteInventoryItem(id);
      if (res.success) fetchItems();
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-panel animate-liquid">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
             <Layers size={20} color="var(--ps-primary)" />
             <span className="section-label" style={{ margin: 0 }}>المستودع الرقمي</span>
          </div>
          <h1 className="page-title">إدارة المخزون</h1>
        </div>
        <button className="btn-liquid btn-liquid-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> إضافة منتج جديد
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div style={{ padding: "25px 30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "relative", width: "350px" }}>
            <Search size={18} style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              style={{ width: "100%", padding: "12px 50px 12px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", color: "white", outline: "none" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: "0.85rem", color: "var(--text-dim)" }}>
             <span>إجمالي الأصناف: <strong style={{ color: "white" }}>{items.length}</strong></span>
             <span>القيمة الإجمالية: <strong style={{ color: "var(--ps-primary)" }}>{items.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()} ج.م</strong></span>
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>
          <table className="liquid-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>الكمية</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5].map(i => <tr key={i}><td colSpan={5} style={{ textAlign: "center", padding: "40px", opacity: 0.1 }}>جاري التحميل...</td></tr>)
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "100px", color: "var(--text-dim)" }}>لا توجد نتائج مطابقة لبحثك</td></tr>
              ) : filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ background: "rgba(0,114,255,0.1)", padding: "10px", borderRadius: "12px", color: "var(--ps-primary)", boxShadow: "0 0 15px rgba(0, 114, 255, 0.2)" }}>
                         <Package size={22} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>{item.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>ID: {item.id?.toString().slice(0, 8) || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="ps-tag">{item.category}</span></td>
                  <td><span style={{ fontWeight: "900", color: "var(--ps-primary)", fontSize: "1.1rem" }}>{item.price.toLocaleString()} <small style={{ fontSize: "0.7rem", opacity: 0.6 }}>ج.م</small></span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ 
                        color: item.quantity < 5 ? "var(--neon-circle)" : "white",
                        fontWeight: "900",
                        fontSize: "1.1rem"
                      }}>
                        {item.quantity}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>قطعة</span>
                      {item.quantity < 5 && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--neon-circle)", boxShadow: "0 0 10px var(--neon-circle)" }}></div>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                      <button className="btn-liquid" style={{ padding: "10px", borderRadius: "12px" }}><Edit size={18} /></button>
                      <button className="btn-liquid" style={{ padding: "10px", borderRadius: "12px", color: "var(--neon-circle)" }} onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-liquid" style={{ width: "95%", maxWidth: "550px", borderTop: "4px solid var(--ps-primary)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                <div>
                   <h3 style={{ fontSize: "1.8rem", fontWeight: "900" }}>إضافة صنف جديد</h3>
                   <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>أدخل تفاصيل المنتج ليتم إدراجه في النظام</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" }}><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>اسم المنتج</label>
                  <input type="text" required style={{ width: "100%", padding: "15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>سعر البيع</label>
                      <input type="number" required style={{ width: "100%", padding: "15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>الكمية المتاحة</label>
                      <input type="number" required style={{ width: "100%", padding: "15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                   </div>
                </div>
                <button type="submit" className="btn-liquid btn-liquid-primary" style={{ width: "100%", marginTop: "15px", padding: "18px", justifyContent: "center", fontSize: "1.1rem" }}>حفظ في المستودع</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
