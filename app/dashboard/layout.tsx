"use client";

import Link from "next/link";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [myCount, setMyCount] = useState<number>(0);

  // -------------------------------------------------------
  // 🟦 قراءة JWT + منع الدخول بدون تسجيل دخول
  // -------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // التحقق من انتهاء الصلاحية
      const exp = payload?.exp ? payload.exp * 1000 : 0;
      if (Date.now() >= exp) {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      }
    } catch {
      localStorage.removeItem("token");
      router.replace("/auth/login");
    }
  }, [router]);

  // -------------------------------------------------------
  // 🟦 تحميل عدد سجلات المستخدم
  // -------------------------------------------------------
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await fetch("/api/logs/my", { credentials: "include" });
        if (!res.ok) return;

        const data = await res.json();
        setMyCount(data.count || 0);
      } catch {}
    };

    loadCounts();
  }, []);

  // -------------------------------------------------------
  // 🔴 تسجيل خروج
  // -------------------------------------------------------
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    router.replace("/auth/login");
  }

  // Badge UI
  const Badge = ({ count }: { count: number }) => (
    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-cyan-400 text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.5)]">
      {count}
    </span>
  );

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#050b14] text-white relative overflow-hidden">
        {/* خلفية */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(0,255,255,0.15),transparent_70%)] blur-3xl" />

        {/* 🧭 NAVBAR */}
        <header className="relative border-b border-cyan-500/20 bg-[rgba(10,20,30,0.7)] backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

            <div className="flex items-center gap-8">

              {/* LOGO TEXT فقط بدون أي icon */}
              <Link
                href="/dashboard/apps"
                className="font-semibold text-white hover:text-cyan-400 transition duration-200 text-lg tracking-wide"
              >
                Smart <span className="text-cyan-400">DevOps</span>
              </Link>

              {/* LINKS بدون Icon */}
              <Link href="/dashboard/apps" className="hover:text-cyan-300 transition">
                Apps Status
              </Link>

              <Link href="/dashboard/deploy" className="hover:text-cyan-300 transition">
                Deploy
              </Link>

              <Link href="/dashboard/apps/bluegreen" className="hover:text-cyan-300 transition">
                Blue-Green
              </Link>

              {/* My Logs */}
              <Link href="/dashboard/MyLogs" className="hover:text-cyan-300 transition flex items-center">
                My Logs <Badge count={myCount} />
              </Link>
            </div>

            {/* زر الخروج */}
            <button
              onClick={logout}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium text-sm shadow-[0_0_10px_rgba(255,0,80,0.4)] transition-all"
            >
              Logout
            </button>
          </nav>
        </header>

        {/* المحتوى */}
        <main className="relative flex-1 container py-10 px-6">{children}</main>

        {/* Footer */}
        <footer className="relative border-t border-cyan-500/20 bg-[rgba(10,20,30,0.7)] backdrop-blur-md text-center py-5 text-sm text-white/60 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
          <p>Smart DevOps Platform — Dashboard © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
