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
  MoreVertical,
  Calendar
} from "lucide-react";
import { getMaintenanceTickets, createMaintenanceTicket, updateTicketStatus } from "@/app/actions/maintenance";

const statusConfig = {
  PENDING: { label: "قيد الانتظار", color: "var(--clr-circle)", icon: Clock },
  REPAIRING: { label: "جاري الإصلاح", color: "var(--ps-primary)", icon: Wrench },
  COMPLETED: { label: "تم الإصلاح", color: "var(--clr-triangle)", icon: CheckCircle2 },
  DELIVERED: { label: "تم التسليم", color: "var(--clr-square)", icon: CheckCircle2 },
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
    t.customerName.toLowerCase().includes(search.toLowerCase()) || 
    t.deviceModel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="maintenance-panel">
      <div className="page-header flex-between">
        <div>
          <span className="section-label">مركز الخدمة</span>
          <h1 className="page-title">طلبات الصيانة</h1>
        </div>
        <button className="btn-sweet btn-sweet-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> فتح تذكرة صيانة
        </button>
      </div>

      <div className="card animate-sweet" style={{ marginTop: "30px", padding: "0" }}>
        <div style={{ padding: "20px 30px", borderBottom: "var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={18} style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input 
              type="text" 
              placeholder="ابحث عن عميل أو جهاز..." 
              style={{ width: "100%", padding: "10px 45px 10px 15px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
             {Object.keys(statusConfig).map(s => (
               <div key={s} style={{ fontSize: "0.75rem", color: "var(--text-dim)", background: "rgba(255,255,255,0.02)", padding: "5px 12px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  {statusConfig[s as keyof typeof statusConfig].label}
               </div>
             ))}
          </div>
        </div>

        <table className="sweet-table">
          <thead>
            <tr>
              <th>العميل</th>
              <th>الجهاز</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th style={{ textAlign: "center" }}>تغيير الحالة</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", opacity: 0.3 }}>جاري التحميل...</td></tr>
            ) : filteredTickets.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "100px", color: "var(--text-dim)" }}>لا توجد تذاكر صيانة</td></tr>
            ) : filteredTickets.map(ticket => {
              const config = statusConfig[ticket.status as keyof typeof statusConfig];
              return (
                <tr key={ticket.id}>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: "600" }}>{ticket.customerName}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{ticket.customerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                       <Smartphone size={16} color="var(--ps-primary)" />
                       <span>{ticket.deviceModel}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: config.color, display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: "600" }}>
                       <config.icon size={16} />
                       {config.label}
                    </div>
                  </td>
                  <td><div style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}><Calendar size={14} style={{ verticalAlign: "middle", marginLeft: "5px" }} /> {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}</div></td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      {Object.keys(statusConfig).map(s => (
                        <button 
                          key={s}
                          onClick={() => handleStatusChange(ticket.id, s)}
                          style={{ 
                            padding: "6px", 
                            borderRadius: "8px", 
                            background: ticket.status === s ? statusConfig[s as keyof typeof statusConfig].color : "var(--ps-surface-light)",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            opacity: ticket.status === s ? 1 : 0.3
                          }}
                        >
                           {React.createElement(statusConfig[s as keyof typeof statusConfig].icon, { size: 14 })}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-sweet" style={{ width: "600px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "1.5rem" }}>تذكرة صيانة جديدة</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>اسم العميل</label>
                      <input type="text" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>رقم الهاتف</label>
                      <input type="text" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
                   </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>نوع الجهاز</label>
                  <input type="text" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.deviceModel} onChange={e => setFormData({...formData, deviceModel: e.target.value})} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>وصف العطل</label>
                  <textarea required style={{ width: "100%", height: "100px", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white", resize: "none" }} value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})} />
                </div>
                <button type="submit" className="btn-sweet btn-sweet-primary" style={{ width: "100%", marginTop: "10px" }}>تسجيل الطلب</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
