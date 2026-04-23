"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Tag, Plus, Minus, Gamepad2, Zap } from "lucide-react";
import { getPOSItems, processSale } from "@/app/actions/pos";

export default function POSPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      const data = await getPOSItems();
      setItems(data || []);
      setIsLoading(false);
    }
    fetchItems();
  }, []);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await processSale({ items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })), totalAmount: total });
      if (res.success) {
        alert("تمت العملية بنجاح!");
        setCart([]);
      } else {
        alert("خطأ: " + res.error);
      }
    } catch (e) {
      alert("حدث خطأ تقني");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pos-layout animate-liquid" style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "30px", height: "100%" }}>
      {/* Products Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "25px", overflow: "hidden" }}>
        <div className="card" style={{ padding: "20px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Search size={24} style={{ color: "var(--ps-primary)" }} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج بالاسم أو الكود..." 
              style={{ flex: 1, background: "none", border: "none", color: "white", fontSize: "1.2rem", fontWeight: "600", outline: "none" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {isLoading ? (
              [1,2,3,4,5,6,7,8].map(i => <div key={i} className="card" style={{ height: "240px", opacity: 0.1 }}></div>)
            ) : filteredItems.map(item => (
              <div key={item.id} className="card" style={{ cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", padding: "25px", textAlign: "center" }} onClick={() => addToCart(item)}>
                <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                   <span className="ps-tag" style={{ background: "rgba(0,114,255,0.1)", border: "none" }}>{item.category}</span>
                </div>
                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px", position: "relative" }}>
                   <Gamepad2 size={64} style={{ color: "var(--ps-primary)", opacity: 0.2 }} />
                   <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={32} color="var(--ps-primary)" />
                   </div>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "15px" }}>{item.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "10px 15px", borderRadius: "100px" }}>
                   <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "var(--ps-primary)" }}>{(item.price || 0).toLocaleString()} <small style={{ fontSize: "0.7rem" }}>ج.م</small></span>
                   <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--ps-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold", boxShadow: "0 0 10px var(--ps-primary-glow)" }}>+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0", background: "rgba(5, 10, 20, 0.8)" }}>
        <div style={{ padding: "35px", borderBottom: "var(--glass-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
             <ShoppingCart size={28} color="var(--ps-primary)" />
             <h2 style={{ fontSize: "1.6rem", fontWeight: "900" }}>سلة البيع</h2>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", fontWeight: "600" }}>قائمة المنتجات المختارة للعميل</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "25px" }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", opacity: 0.3 }}>
               <ShoppingCart size={80} style={{ marginBottom: "25px" }} />
               <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>السلة بانتظار إضافة منتجات</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {cart.map(item => (
                <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", padding: "18px", borderRadius: "20px", display: "flex", gap: "15px", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "1.05rem", fontWeight: "800" }}>{item.name}</div>
                      <div style={{ fontSize: "0.9rem", color: "var(--ps-primary)", fontWeight: "700" }}>{item.price} ج.م</div>
                   </div>
                   <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,0,0,0.3)", padding: "6px 15px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Minus size={16}/></button>
                      <span style={{ fontSize: "1rem", fontWeight: "900", minWidth: "25px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Plus size={16}/></button>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} style={{ color: "var(--neon-circle)", background: "rgba(255, 77, 109, 0.1)", border: "none", padding: "10px", borderRadius: "12px", cursor: "pointer" }}><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "35px", background: "rgba(0, 114, 255, 0.03)", borderTop: "var(--glass-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" }}>
             <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "var(--text-dim)", fontWeight: "700", marginBottom: "5px" }}>الإجمالي المستحق:</span>
                <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "white", letterSpacing: "-1px" }}>{total.toLocaleString()} <small style={{ fontSize: "1rem", color: "var(--ps-primary)" }}>ج.م</small></div>
             </div>
             <span className="ps-tag tag-blue" style={{ padding: "8px 15px" }}>{cart.length} أصناف</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <button className="btn-liquid" style={{ width: "100%", justifyContent: "center", padding: "18px" }}>
                <Banknote size={20} /> دفع كاش
             </button>
             <button className="btn-liquid btn-liquid-primary" onClick={handleCheckout} disabled={isProcessing || cart.length === 0} style={{ width: "100%", justifyContent: "center", padding: "18px" }}>
                <CreditCard size={20} /> {isProcessing ? "جاري..." : "إتمام العملية"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
