"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Wrench, 
  ShoppingCart, 
  Trash2, 
  Edit2, 
  X, 
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/users";

type Role = 'OWNER' | 'MANAGER' | 'MAINTENANCE' | 'SELLER';

const roleConfig = {
  OWNER: { label: "أونر", icon: ShieldCheck, color: "var(--neon-triangle)" },
  MANAGER: { label: "مدير", icon: Shield, color: "var(--ps-primary)" },
  MAINTENANCE: { label: "مسئول صيانة", icon: Wrench, color: "var(--neon-square)" },
  SELLER: { label: "بائع", icon: ShoppingCart, color: "var(--neon-circle)" },
};

export default function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "SELLER" as Role
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const res = await updateUser(editingUser.id, formData);
        if (res.success) {
          showMsg("تم تحديث المستخدم بنجاح", 'success');
          setIsModalOpen(false);
          await fetchUsers();
        } else {
          showMsg(res.error || "خطأ في التحديث", 'error');
        }
      } else {
        const res = await createUser(formData);
        if (res.success) {
          showMsg("تم إنشاء المستخدم بنجاح", 'success');
          setIsModalOpen(false);
          setFormData({ name: "", username: "", password: "", role: "SELLER" });
          await fetchUsers();
        } else {
          showMsg(res.error || "خطأ في الإنشاء", 'error');
        }
      }
    } catch (error) {
      showMsg("حدث خطأ تقني", 'error');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || "",
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      const res = await deleteUser(id);
      if (res.success) {
        showMsg("تم حذف المستخدم", 'success');
        await fetchUsers();
      }
    }
  };

  return (
    <div className="users-panel animate-liquid">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
             <Users size={20} color="var(--ps-primary)" />
             <span className="section-label" style={{ margin: 0 }}>إدارة الكوادر</span>
          </div>
          <h1 className="page-title">فريق العمل</h1>
        </div>
        <button className="btn-liquid btn-liquid-primary" onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", username: "", password: "", role: "SELLER" });
            setIsModalOpen(true);
          }}>
          <UserPlus size={20} /> إضافة عضو جديد
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div style={{ padding: "25px 30px", borderBottom: "var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.4rem", fontWeight: "800" }}>المستخدمين ({users.length})</h3>
          <button className="btn-liquid" onClick={fetchUsers} disabled={isLoading} style={{ padding: "10px" }}>
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div style={{ padding: "0 20px" }}>
          <table className="liquid-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>الصلاحية</th>
                <th>اسم الدخول</th>
                <th style={{ textAlign: "center" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && users.length === 0 ? (
                [1,2,3].map(i => <tr key={i}><td colSpan={4} style={{ textAlign: "center", padding: "40px", opacity: 0.1 }}>جاري التحميل...</td></tr>)
              ) : users.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "100px", color: "var(--text-dim)" }}>لا يوجد مستخدمين مسجلين</td></tr>
              ) : users.map((user) => {
                const config = roleConfig[user.role as Role] || roleConfig.SELLER;
                const RoleIcon = config.icon;
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                         <div style={{ width: "45px", height: "45px", borderRadius: "15px", background: `${config.color}20`, color: config.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.2rem", boxShadow: `0 0 15px ${config.color}30` }}>
                            {user.name.charAt(0).toUpperCase()}
                         </div>
                         <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>{user.name}</span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>عضو نشط منذ فترة</span>
                         </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ color: config.color, display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", fontWeight: "900", background: "rgba(255,255,255,0.03)", padding: "6px 15px", borderRadius: "100px", width: "fit-content" }}>
                         <RoleIcon size={14} />
                         {config.label}
                      </div>
                    </td>
                    <td><span style={{ color: "var(--ps-primary)", fontFamily: "monospace", fontWeight: "700" }}>@{user.username}</span></td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                        <button className="btn-liquid" style={{ padding: "10px", borderRadius: "12px" }} onClick={() => handleEdit(user)}><Edit2 size={18} /></button>
                        <button className="btn-liquid" style={{ padding: "10px", borderRadius: "12px", color: "var(--neon-circle)" }} onClick={() => handleDelete(user.id)}><Trash2 size={18} /></button>
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
          <div className="card animate-liquid" style={{ width: "550px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                <div>
                   <h3 style={{ fontSize: "1.8rem", fontWeight: "900" }}>{editingUser ? "تعديل عضو" : "إضافة عضو جديد"}</h3>
                   <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>إدارة صلاحيات الوصول لنظام 2M Store</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" }}><X size={28}/></button>
             </div>
             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>الاسم الكامل</label>
                  <input type="text" required style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>اسم المستخدم</label>
                      <input type="text" required style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>كلمة المرور</label>
                      <input type="password" required={!editingUser} style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", outline: "none" }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                   </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                   <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-soft)" }}>صلاحية الوصول</label>
                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {Object.keys(roleConfig).map(r => (
                        <div 
                          key={r} 
                          onClick={() => setFormData({...formData, role: r as Role})}
                          style={{ 
                            padding: "15px", 
                            borderRadius: "15px", 
                            background: formData.role === r ? "rgba(0,114,255,0.1)" : "rgba(255,255,255,0.02)",
                            border: formData.role === r ? `1px solid ${roleConfig[r as Role].color}` : "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: formData.role === r ? "white" : "var(--text-dim)",
                            transition: "all 0.3s"
                          }}
                        >
                           <div style={{ color: formData.role === r ? roleConfig[r as Role].color : "inherit" }}>
                              {React.createElement(roleConfig[r as Role].icon, { size: 18 })}
                           </div>
                           <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>{roleConfig[r as Role].label}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <button type="submit" className="btn-liquid btn-liquid-primary" style={{ width: "100%", marginTop: "15px", padding: "18px", justifyContent: "center" }}>{editingUser ? "تحديث البيانات" : "إتمام الإضافة"}</button>
             </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
