"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Package, Tag, Layers } from "lucide-react";
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
    <div className="inventory-panel">
      <div className="page-header flex-between">
        <div>
          <span className="section-label">المستودع</span>
          <h1 className="page-title">إدارة المخزون</h1>
        </div>
        <button className="btn-sweet btn-sweet-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> إضافة منتج جديد
        </button>
      </div>

      <div className="card animate-sweet" style={{ marginTop: "30px", padding: "0" }}>
        <div style={{ padding: "20px 30px", borderBottom: "var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={18} style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input 
              type="text" 
              placeholder="ابحث هنا..." 
              style={{ width: "100%", padding: "10px 45px 10px 15px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>إجمالي المنتجات: {items.length}</div>
        </div>

        <table className="sweet-table">
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
              [1,2,3].map(i => <tr key={i}><td colSpan={5} style={{ textAlign: "center", padding: "40px", opacity: 0.3 }}>جاري التحميل...</td></tr>)
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "100px", color: "var(--text-dim)" }}>لا توجد نتائج مطابقة</td></tr>
            ) : filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ background: "rgba(0,114,255,0.1)", padding: "8px", borderRadius: "8px", color: "var(--ps-primary)" }}>
                       <Package size={20} />
                    </div>
                    <span style={{ fontWeight: "600" }}>{item.name}</span>
                  </div>
                </td>
                <td><span style={{ background: "var(--ps-surface-light)", padding: "4px 12px", borderRadius: "50px", fontSize: "0.8rem" }}>{item.category}</span></td>
                <td><span style={{ fontWeight: "bold", color: "var(--ps-primary)" }}>{item.price} ج.م</span></td>
                <td>
                  <span style={{ 
                    color: item.quantity < 5 ? "var(--clr-circle)" : "inherit",
                    fontWeight: item.quantity < 5 ? "bold" : "normal"
                  }}>
                    {item.quantity} قطعة
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button className="btn-sweet" style={{ padding: "8px", borderRadius: "10px" }} title="تعديل"><Edit size={16} /></button>
                    <button className="btn-sweet" style={{ padding: "8px", borderRadius: "10px", color: "#ff4444" }} onClick={() => handleDelete(item.id)} title="حذف"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-sweet" style={{ width: "500px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "1.5rem" }}>إضافة منتج جديد</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>اسم المنتج</label>
                  <input type="text" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>السعر</label>
                      <input type="number" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>الكمية</label>
                      <input type="number" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                   </div>
                </div>
                <button type="submit" className="btn-sweet btn-sweet-primary" style={{ width: "100%", marginTop: "10px" }}>حفظ المنتج</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
