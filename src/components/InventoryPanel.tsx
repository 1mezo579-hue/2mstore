"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Package } from "lucide-react";
import { getInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/app/actions/inventory";

const PRODUCT_NAMES: Record<string, string[]> = {
  "أجهزة": [
    "PlayStation 5 Standard",
    "PlayStation 5 Digital Edition",
    "PlayStation 4 Pro 1TB",
    "PlayStation 4 Slim 500GB",
    "PlayStation 4 Slim 1TB",
    "PlayStation 4 Standard",
    "PlayStation 3 Super Slim",
    "PlayStation 3 Slim",
  ],
  "دراعات": [
    "DualSense - أبيض",
    "DualSense - أسود",
    "DualSense - أحمر",
    "DualSense - أزرق",
    "DualShock 4 - أبيض",
    "DualShock 4 - أسود",
    "DualShock 4 - أحمر",
    "DualShock 4 - أزرق",
    "DualShock 4 - ذهبي",
  ],
  "ألعاب": [
    "FIFA 24",
    "FIFA 25",
    "EA Sports FC 25",
    "God of War Ragnarök",
    "Spider-Man 2",
    "GTA V",
    "GTA VI",
    "Call of Duty: Modern Warfare III",
    "Mortal Kombat 1",
    "Tekken 8",
    "Elden Ring",
    "The Last of Us Part II",
    "Hogwarts Legacy",
    "Red Dead Redemption 2",
    "Cyberpunk 2077",
    "Resident Evil 4 Remake",
  ],
  "إكسسوارات": [
    "ستاند شاحن DualSense",
    "سماعة Pulse 3D",
    "HD Camera PS5",
    "Media Remote PS5",
    "بطاقة ذاكرة 825GB",
    "كابل HDMI 2.1",
    "حامل PS5 عمودي",
    "كيبورد لاسلكي PS5",
    "شاحن تايب سي PS5",
    "غطاء فيس بليت PS5 - أسود",
    "غطاء فيس بليت PS5 - أحمر",
  ],
  "أخرى": [],
};

const CATEGORIES = ["أجهزة", "دراعات", "ألعاب", "إكسسوارات", "أخرى"];

export default function InventoryPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "أجهزة",
    sellPrice: 0,
    buyPrice: 0,
    quantity: 0,
    condition: "جديد",
    serialNumber: "",
    barcode: "",
  });
  const [isCustomName, setIsCustomName] = useState(false);
  const [customNameValue, setCustomNameValue] = useState("");

  const fetchItems = async () => {
    setIsLoading(true);
    const data = await getInventoryItems();
    setItems(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ 
      name: "", category: "أجهزة", sellPrice: 0, buyPrice: 0, quantity: 0, 
      condition: "جديد", serialNumber: "", barcode: "" 
    });
    setIsCustomName(false);
    setCustomNameValue("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "أجهزة",
      sellPrice: Number(item.sellPrice) || 0,
      buyPrice: Number(item.buyPrice) || 0,
      quantity: Number(item.quantity) || 0,
      condition: item.condition || "جديد",
      serialNumber: item.serialNumber || "",
      barcode: item.barcode || "",
    });
    setIsCustomName(false);
    setCustomNameValue("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const finalName = isCustomName ? customNameValue : formData.name;
    
    if (!finalName) {
      alert("يرجى اختيار أو كتابة اسم المنتج");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      name: finalName,
      sellPrice: Number(formData.sellPrice) || 0,
      buyPrice: Number(formData.buyPrice) || 0,
      quantity: Number(formData.quantity) || 0,
    };

    try {
      let res;
      if (editingItem) {
        res = await updateInventoryItem(editingItem.id, payload);
      } else {
        res = await addInventoryItem(payload);
      }
      
      if (res.success) {
        setIsModalOpen(false);
        setEditingItem(null);
        await fetchItems();
      } else {
        alert("فشل الحفظ: " + res.error);
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      alert("حدث خطأ تقني: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    const res = await deleteInventoryItem(id);
    if (res.success) fetchItems();
    else alert(res.error);
  };

  const filteredItems = items.filter(i =>
    (i.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (i.category || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (i.serialNumber || "").toLowerCase().includes((search || "").toLowerCase())
  );

  const productNames = PRODUCT_NAMES[formData.category as keyof typeof PRODUCT_NAMES] || [];

  return (
    <div className="inventory-panel animate-liquid">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <Package size={20} color="var(--ps-primary)" />
            <span className="section-label" style={{ margin: 0 }}>المخزون والسلع</span>
          </div>
          <h1 className="page-title">إدارة المستودع</h1>
        </div>
        <button className="btn-liquid btn-liquid-primary" onClick={openAddModal}>
          <Plus size={20} /> إضافة صنف جديد
        </button>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: "0" }}>
        <div style={{ padding: "25px 30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "relative", width: "350px" }}>
            <Search size={18} style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input
              type="text"
              placeholder="ابحث عن منتج أو سيريال..."
              style={{ width: "100%", padding: "12px 50px 12px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", color: "white", outline: "none" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: "0.85rem", color: "var(--text-dim)" }}>
            <span>إجمالي الأصناف: <strong style={{ color: "white" }}>{items.length}</strong></span>
            <span>القيمة (بيع): <strong style={{ color: "var(--ps-primary)" }}>{items.reduce((s, i) => s + ((Number(i.sellPrice) || 0) * (Number(i.quantity) || 0)), 0).toLocaleString()} ج.م</strong></span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="liquid-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الفئة</th>
                <th>الحالة</th>
                <th>سعر البيع</th>
                <th>الكمية</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i}><td colSpan={6} style={{ textAlign: "center", padding: "30px", opacity: 0.1 }}>جاري التحميل...</td></tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "80px", color: "var(--text-dim)" }}>
                  {search ? "لا توجد نتائج مطابقة" : "المخزون فارغ — أضف أول منتج!"}
                </td></tr>
              ) : filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ background: "rgba(0,114,255,0.1)", padding: "10px", borderRadius: "12px", color: "var(--ps-primary)" }}>
                        <Package size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "800", fontSize: "1rem" }}>{item.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{item.serialNumber || item.id?.toString().slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="ps-tag">{item.category}</span></td>
                  <td><span style={{ color: item.condition === 'جديد' ? 'var(--neon-triangle)' : 'var(--neon-circle)', fontWeight: 'bold' }}>{item.condition}</span></td>
                  <td><span style={{ fontWeight: "900", color: "var(--ps-primary)", fontSize: "1.1rem" }}>{(Number(item.sellPrice) || 0).toLocaleString()} <small style={{ fontSize: "0.7rem", opacity: 0.6 }}>ج.م</small></span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontWeight: "800", fontSize: "1.1rem", color: (item.quantity || 0) < 5 ? "var(--neon-circle)" : "white" }}>{item.quantity}</span>
                      {(item.quantity || 0) < 5 && <span style={{ fontSize: "0.6rem", background: "rgba(255,77,109,0.1)", color: "var(--neon-circle)", padding: "2px 6px", borderRadius: "4px" }}>منخفض!</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                      <button className="btn-liquid" style={{ padding: "10px", borderRadius: "12px" }} onClick={() => openEditModal(item)}><Edit size={18} /></button>
                      <button className="btn-liquid" style={{ padding: "10px", borderRadius: "12px", color: "var(--neon-circle)" }} onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-liquid" style={{ width: "95%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", borderTop: "4px solid var(--ps-primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "900" }}>{editingItem ? "تعديل بيانات الصنف" : "إضافة صنف للمخزون"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>الفئة</label>
                  <select
                    required
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }}
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value, name: "" })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} style={{ background: "#0a0f1e" }}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>الحالة</label>
                  <select
                    required
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }}
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="جديد" style={{ background: "#0a0f1e" }}>جديد (New)</option>
                    <option value="مستعمل" style={{ background: "#0a0f1e" }}>مستعمل (Used)</option>
                    <option value="مجدد" style={{ background: "#0a0f1e" }}>مجدد (Refurbished)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>اسم المنتج</label>
                {productNames.length > 0 ? (
                  <select
                    required
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }}
                    value={isCustomName ? "__custom__" : formData.name}
                    onChange={e => {
                      if (e.target.value === "__custom__") {
                        setIsCustomName(true);
                        setFormData({ ...formData, name: "" });
                      } else {
                        setIsCustomName(false);
                        setFormData({ ...formData, name: e.target.value });
                      }
                    }}
                  >
                    <option value="" style={{ background: "#0a0f1e" }}>-- اختر المنتج --</option>
                    {productNames.map(name => (
                      <option key={name} value={name} style={{ background: "#0a0f1e" }}>{name}</option>
                    ))}
                    <option value="__custom__" style={{ background: "#0a0f1e" }}>أخرى (اكتب اسماً)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="اكتب اسم المنتج"
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                )}
                {isCustomName && (
                  <input
                    type="text"
                    required
                    placeholder="اكتب اسم المنتج المخصص هنا"
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none", marginTop: "8px" }}
                    value={customNameValue}
                    onChange={e => setCustomNameValue(e.target.value)}
                  />
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: "700" }}>سعر الشراء</label>
                  <input type="number" required min="0" style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.buyPrice} onChange={e => setFormData({ ...formData, buyPrice: Number(e.target.value) })} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: "700" }}>سعر البيع</label>
                  <input type="number" required min="0" style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.sellPrice} onChange={e => setFormData({ ...formData, sellPrice: Number(e.target.value) })} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: "700" }}>الكمية</label>
                  <input type="number" required min="0" style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>الرقم التسلسلي</label>
                  <input type="text" placeholder="اختياري" style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: "700" }}>الباركود</label>
                  <input type="text" placeholder="اختياري" style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} />
                </div>
              </div>

              <button
                type="submit"
                className="btn-liquid btn-liquid-primary"
                disabled={submitting || (!isCustomName && !formData.name) || (isCustomName && !customNameValue)}
                style={{ width: "100%", marginTop: "10px", padding: "18px", justifyContent: "center", fontSize: "1.2rem" }}
              >
                {submitting ? "جاري الحفظ..." : editingItem ? "تحديث المنتج" : "حفظ في المستودع"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
