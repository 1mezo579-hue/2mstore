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
  Check,
  RefreshCw,
  MoreVertical,
  Plus
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/users";

type Role = 'OWNER' | 'MANAGER' | 'MAINTENANCE' | 'SELLER';

const roleConfig = {
  OWNER: { label: "أونر", icon: ShieldCheck, color: "var(--clr-triangle)" },
  MANAGER: { label: "مدير", icon: Shield, color: "var(--ps-primary)" },
  MAINTENANCE: { label: "مسئول صيانة", icon: Wrench, color: "var(--clr-square)" },
  SELLER: { label: "بائع", icon: ShoppingCart, color: "var(--clr-circle)" },
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
    <div className="users-panel">
      <div className="page-header flex-between">
        <div>
          <span className="section-label">فريق العمل</span>
          <h1 className="page-title">إدارة المستخدمين</h1>
        </div>
        <button className="btn-sweet btn-sweet-primary" onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", username: "", password: "", role: "SELLER" });
            setIsModalOpen(true);
          }}>
          <UserPlus size={20} /> إضافة مستخدم جديد
        </button>
      </div>

      <div className="card animate-sweet" style={{ marginTop: "30px", padding: "0" }}>
        <div style={{ padding: "20px 30px", borderBottom: "var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.1rem" }}>قائمة المستخدمين ({users.length})</h3>
          <button className="btn-sweet" onClick={fetchUsers} disabled={isLoading} style={{ padding: "8px" }}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <table className="sweet-table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>الرتبة</th>
              <th>اسم الدخول</th>
              <th style={{ textAlign: "center" }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && users.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px", opacity: 0.3 }}>جاري التحميل...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "100px", color: "var(--text-dim)" }}>لا يوجد مستخدمين مسجلين</td></tr>
            ) : users.map((user) => {
              const config = roleConfig[user.role as Role] || roleConfig.SELLER;
              const RoleIcon = config.icon;
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                       <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${config.color}15`, color: config.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                          {user.name.charAt(0).toUpperCase()}
                       </div>
                       <span style={{ fontWeight: "600" }}>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: config.color, display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: "600", background: "rgba(255,255,255,0.02)", padding: "4px 12px", borderRadius: "50px", width: "fit-content" }}>
                       <RoleIcon size={14} />
                       {config.label}
                    </div>
                  </td>
                  <td><span style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>@{user.username}</span></td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                      <button className="btn-sweet" style={{ padding: "8px", borderRadius: "10px" }} onClick={() => handleEdit(user)}><Edit2 size={16} /></button>
                      <button className="btn-sweet" style={{ padding: "8px", borderRadius: "10px", color: "#ff4444" }} onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
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
          <div className="card animate-sweet" style={{ width: "500px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "1.5rem" }}>{editingUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>الاسم الكامل</label>
                  <input type="text" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>اسم المستخدم</label>
                      <input type="text" required style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>كلمة المرور</label>
                      <input type="password" required={!editingUser} style={{ width: "100%", padding: "12px", background: "var(--ps-surface-light)", border: "none", borderRadius: "10px", color: "white" }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                   </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                   <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>الصلاحية</label>
                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {Object.keys(roleConfig).map(r => (
                        <div 
                          key={r} 
                          onClick={() => setFormData({...formData, role: r as Role})}
                          style={{ 
                            padding: "12px", 
                            borderRadius: "12px", 
                            background: formData.role === r ? "var(--ps-surface-light)" : "transparent",
                            border: formData.role === r ? `1px solid ${roleConfig[r as Role].color}` : "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: formData.role === r ? roleConfig[r as Role].color : "var(--text-dim)"
                          }}
                        >
                           {React.createElement(roleConfig[r as Role].icon, { size: 16 })}
                           <span style={{ fontSize: "0.85rem" }}>{roleConfig[r as Role].label}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <button type="submit" className="btn-sweet btn-sweet-primary" style={{ width: "100%", marginTop: "10px" }}>{editingUser ? "تحديث" : "إنشاء"}</button>
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
