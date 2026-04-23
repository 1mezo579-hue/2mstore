"use client";

import React, { useState, useEffect } from "react";
import { 
  Wrench, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Smartphone,
  X,
  Calendar
} from "lucide-react";
import { getMaintenanceTickets, createMaintenanceTicket, updateTicketStatus } from "@/app/actions/maintenance";

const statusConfig = {
  PENDING: { label: "قيد الانتظار", color: "var(--neon-circle)", icon: Clock },
  REPAIRING: { label: "جاري الإصلاح", color: "var(--ps-primary)", icon: Wrench },
  COMPLETED: { label: "تم الإصلاح", color: "var(--neon-triangle)", icon: CheckCircle2 },
  DELIVERED: { label: "تم التسليم", color: "white", icon: CheckCircle2 },
};

export default function MaintenancePanel() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deviceModel: "",
    issueDescription: "",
  });

  const fetchTickets = async () => {
    setIsLoading(true);
    const data = await getMaintenanceTickets();
    setTickets(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createMaintenanceTicket(formData);
    if (res.success) {
      setIsModalOpen(false);
      setFormData({ customerName: "", customerPhone: "", deviceModel: "", issueDescription: "" });
      fetchTickets();
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateTicketStatus(id, status);
    if (res.success) fetchTickets();
  };

  const filteredTickets = tickets.filter(t => 
    (t.customerName || "").toLowerCase().includes((search || "").toLowerCase()) || 
    (t.deviceModel || "").toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="maintenance-panel animate-liquid">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
             <Wrench size={20} color="var(--ps-primary)" />
             <span className="section-label" style={{ margin: 0 }}>ورشة الصيانة</span>
          </div>
          <h1 className="page-title">طلبات الخدمة</h1>
        </div>
        <button className="btn-liquid btn-liquid-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> فتح تذكرة جديدة
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div style={{ padding: "25px 30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "relative", width: "350px" }}>
            <Search size={18} style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input 
              type="text" 
              placeholder="ابحث عن عميل أو جهاز..." 
              style={{ width: "100%", padding: "12px 50px 12px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", color: "white", outline: "none" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
             {Object.keys(statusConfig).map(s => (
               <div key={s} className="ps-tag" style={{ color: statusConfig[s as keyof typeof statusConfig].color, background: "rgba(255,255,255,0.02)" }}>
                  {statusConfig[s as keyof typeof statusConfig].label}
               </div>
             ))}
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>
          <table className="liquid-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>الجهاز</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3].map(i => <tr key={i}><td colSpan={5} style={{ textAlign: "center", padding: "40px", opacity: 0.1 }}>جاري التحميل...</td></tr>)
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "100px", color: "var(--text-dim)" }}>لا توجد تذاكر مسجلة</td></tr>
              ) : filteredTickets.map(ticket => {
                const config = statusConfig[ticket.status as keyof typeof statusConfig];
                return (
                  <tr key={ticket.id}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>{ticket.customerName}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "5px" }}>
                           <Phone size={12} /> {ticket.customerPhone}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                         <div style={{ background: "rgba(0,114,255,0.1)", padding: "8px", borderRadius: "10px" }}>
                            <Smartphone size={18} color="var(--ps-primary)" />
                         </div>
                         <span style={{ fontWeight: "600" }}>{ticket.deviceModel}</span>
                      </div>
                    </td>
                    <td>
                      {(() => {
                        const config = (statusConfig as any)[ticket.status] || statusConfig.PENDING;
                        const Icon = config.icon;
                        return (
                          <div style={{ color: config.color, display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: "900", background: `${config.color}15`, padding: "6px 15px", borderRadius: "100px", width: "fit-content" }}>
                             <Icon size={14} />
                             {config.label}
                          </div>
                        );
                      })()}
                    </td>
                    <td><div style={{ fontSize: "0.85rem", color: "var(--text-dim)", fontWeight: "600" }}><Calendar size={14} style={{ verticalAlign: "middle", marginLeft: "5px" }} /> {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}</div></td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        {Object.keys(statusConfig).map(s => {
                          const config = statusConfig[s as keyof typeof statusConfig];
                          const Icon = config.icon;
                          return (
                            <button 
                              key={s}
                              onClick={() => handleStatusChange(ticket.id, s)}
                              className="btn-liquid"
                              style={{ 
                                padding: "10px", 
                                borderRadius: "12px", 
                                background: ticket.status === s ? config.color : "rgba(255,255,255,0.05)",
                                border: "none",
                                color: ticket.status === s ? "black" : "white",
                                opacity: ticket.status === s ? 1 : 0.3
                              }}
                            >
                               <Icon size={16} />
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-liquid" style={{ width: "95%", maxWidth: "600px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                <div>
                   <h3 style={{ fontSize: "1.8rem", fontWeight: "900" }}>فتح تذكرة صيانة</h3>
                   <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>قم بتسجيل بيانات الجهاز والعطل بدقة</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" }}><X size={28}/></button>
             </div>
             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>اسم العميل</label>
                      <input type="text" required style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>رقم الهاتف</label>
                      <input type="text" required style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
                   </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>نوع الجهاز / الموديل</label>
                  <select 
                    required 
                    style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} 
                    value={formData.deviceModel} 
                    onChange={e => setFormData({...formData, deviceModel: e.target.value})}
                  >
                    <option value="" disabled style={{ background: "var(--ps-surface-dark)" }}>اختر الجهاز...</option>
                    <option value="PlayStation 5" style={{ background: "var(--ps-surface-dark)" }}>PlayStation 5</option>
                    <option value="PlayStation 4 Pro" style={{ background: "var(--ps-surface-dark)" }}>PlayStation 4 Pro</option>
                    <option value="PlayStation 4 Slim" style={{ background: "var(--ps-surface-dark)" }}>PlayStation 4 Slim</option>
                    <option value="PlayStation 4" style={{ background: "var(--ps-surface-dark)" }}>PlayStation 4</option>
                    <option value="PlayStation 3" style={{ background: "var(--ps-surface-dark)" }}>PlayStation 3</option>
                    <option value="DualSense (PS5)" style={{ background: "var(--ps-surface-dark)" }}>DualSense (PS5) Controller</option>
                    <option value="DualShock 4" style={{ background: "var(--ps-surface-dark)" }}>DualShock 4 (PS4) Controller</option>
                    <option value="أخرى" style={{ background: "var(--ps-surface-dark)" }}>أخرى...</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>وصف المشكلة</label>
                  <textarea required style={{ width: "100%", height: "120px", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none", resize: "none" }} value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})} />
                </div>
                <button type="submit" className="btn-liquid btn-liquid-primary" style={{ width: "100%", marginTop: "15px", padding: "18px", justifyContent: "center" }}>تسجيل الطلب</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
