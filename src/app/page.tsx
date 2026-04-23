"use client";

import React, { useState } from "react";
import { Gamepad2, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

import { authenticateAdmin } from "@/app/actions/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res: any = await authenticateAdmin(username, password);
      if (res.success) {
        // Redirection logic
        if (res.user.role === "MAINTENANCE") router.push("/dashboard?tab=maintenance");
        else if (res.user.role === "SELLER") router.push("/dashboard?tab=pos");
        else router.push("/dashboard");
      } else {
        setError(res.error || "خطأ في تسجيل الدخول");
        setIsLoading(false);
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Dynamic Background */}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
      </div>

      <div className={`${styles.loginBox} animate-sweet`}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <Gamepad2 size={40} color="#0072FF" />
          </div>
          <h1>2M Store</h1>
          <p>سجل دخولك لإدارة متجرك</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <User className={styles.inputIcon} size={20} />
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? <Loader2 className={styles.spinner} /> : "دخول النظام"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>نظام إدارة متجر 2M © 2026</span>
        </div>
      </div>
    </div>
  );
}
