"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Tag, Plus, Minus, Gamepad2 } from "lucide-react";
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

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await processSale(cart.map(i => ({ id: i.id, quantity: i.quantity })), total);
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
    <div className="pos-layout" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "30px", height: "100%" }}>
      {/* Products Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "25px", overflow: "hidden" }}>
        <div className="card" style={{ padding: "15px 25px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Search size={22} style={{ color: "var(--ps-primary)" }} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج أو كود..." 
              style={{ flex: 1, background: "none", border: "none", color: "white", fontSize: "1.1rem", outline: "none" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {isLoading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="card" style={{ height: "200px", opacity: 0.3 }}></div>)
            ) : filteredItems.map(item => (
              <div key={item.id} className="card animate-sweet" style={{ cursor: "pointer", border: "1px solid rgba(255,255,255,0.03)" }} onClick={() => addToCart(item)}>
                <div style={{ position: "absolute", top: "15px", right: "15px", background: "rgba(0,114,255,0.1)", color: "var(--ps-primary)", padding: "5px 10px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "bold" }}>
                   {item.category}
                </div>
                <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", marginBottom: "15px" }}>
                   <Gamepad2 size={48} opacity={0.2} />
                </div>
                <h3 style={{ fontSize: "1rem", marginBottom: "5px" }}>{item.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                   <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--ps-primary)" }}>{item.price} <small style={{ fontSize: "0.7rem" }}>ج.م</small></span>
                   <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--ps-surface-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0" }}>
        <div style={{ padding: "30px", borderBottom: "var(--border-glass)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
             <ShoppingCart size={24} color="var(--ps-primary)" />
             <h2 style={{ fontSize: "1.3rem" }}>سلة المشتريات</h2>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>{cart.length} منتجات مضافة</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", opacity: 0.5 }}>
               <ShoppingCart size={64} style={{ marginBottom: "20px" }} />
               <p>السلة فارغة حالياً</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {cart.map(item => (
                <div key={item.id} className="animate-sweet" style={{ background: "rgba(255,255,255,0.02)", padding: "15px", borderRadius: "15px", display: "flex", gap: "15px", alignItems: "center" }}>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{item.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--ps-primary)" }}>{item.price} ج.م</div>
                   </div>
                   <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--ps-bg)", padding: "5px 10px", borderRadius: "50px" }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Minus size={14}/></button>
                      <span style={{ fontSize: "0.9rem", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Plus size={14}/></button>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} style={{ color: "#ff4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "30px", background: "var(--ps-surface-light)", borderTop: "var(--border-glass)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
             <span style={{ color: "var(--text-muted)" }}>الإجمالي:</span>
             <span style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--ps-primary)" }}>{total} <small style={{ fontSize: "0.9rem" }}>ج.م</small></span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
             <button className="btn-sweet" style={{ background: "none" }}>
                <Banknote size={18} /> كاش
             </button>
             <button className="btn-sweet-primary btn-sweet" onClick={handleCheckout} disabled={isProcessing || cart.length === 0}>
                {isProcessing ? "جاري..." : "تأكيد البيع"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
