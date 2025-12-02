"use client";

import Link from "next/link";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoIcon from "@/components/LogoIcon"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [myCount, setMyCount] = useState<number>(0);
  const [adminCount, setAdminCount] = useState<number>(0);

  // -------------------------------------------------------
  // 🟦 قراءة JWT + منع الدخول بدون تسجيل
  // -------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // role
      setRole(payload.role || null);

      // token expiry
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
  // 🟦 تحميل عداد السجلات (My Logs + Admin Logs إن كان أدمن)
  // -------------------------------------------------------
  useEffect(() => {
    const loadCounts = async () => {
      try {
        // My Logs Count
        const myRes = await fetch("/api/logs/my", { credentials: "include" });
        const myData = await myRes.json();
        setMyCount(myData.count || 0);

        // Admin Logs Count (للأدمن فقط)
        if (role === "admin" || role === "platform_admin") {
          const adRes = await fetch("/api/logs", { credentials: "include" });
          const adData = await adRes.json();
          setAdminCount(adData.count || 0);
        }
      } catch {}
    };

    loadCounts();
  }, [role]);

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
  const Badge = ({ count, color = "cyan" }: { count: number; color?: string }) => (
    <span
      className={`ml-1 px-2 py-0.5 text-xs rounded-full text-black font-semibold ${
        color === "cyan"
          ? "bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          : "bg-rose-500 shadow-[0_0_10px_rgba(255,0,100,0.5)]"
      }`}
    >
      {count}
    </span>
  );

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#050b14] text-white relative overflow-hidden">
        {/* 🔮 خلفية */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(0,255,255,0.15),transparent_70%)] blur-3xl" />

        {/* 🧭 NAVBAR */}
        <header className="relative border-b border-cyan-500/20 bg-[rgba(10,20,30,0.7)] backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              {/* LOGO */}
              <Link
                href="/dashboard/apps"
                className="font-semibold text-white hover:text-cyan-400 transition duration-200 text-lg tracking-wide flex items-center gap-2"
              >
                <LogoIcon size={22} />
                Smart <span className="text-cyan-400">DevOps</span>
              </Link>

              {/* LINKS */}
              <Link
                href="/dashboard/apps"
                className="flex items-center gap-2 hover:text-cyan-300 transition"
              >
                <LogoIcon size={16} />
                Apps Status
              </Link>

              <Link
                href="/dashboard/deploy"
                className="flex items-center gap-2 hover:text-cyan-300 transition"
              >
                <LogoIcon size={16} />
                Deploy
              </Link>

              <Link
                href="/dashboard/apps/bluegreen"
                className="flex items-center gap-2 hover:text-cyan-300 transition"
              >
                <LogoIcon size={16} />
                Blue-Green
              </Link>

              {/* 🔵 My Logs */}
              <Link
                href="/dashboard/MyLogs"
                className="flex items-center gap-2 hover:text-cyan-300 transition"
              >
                <LogoIcon size={16} />
                My Logs <Badge count={myCount} color="cyan" />
              </Link>

              {/* 🛡️ Admin Logs */}
              {role === "admin" || role === "platform_admin" ? (
                <Link
                  href="/dashboard/admin/Logs"
                  className="flex items-center gap-2 hover:text-cyan-300 transition"
                >
                  <LogoIcon size={16} />
                  Admin Logs <Badge count={adminCount} color="rose" />
                </Link>
              ) : null}
            </div>

            {/* زر خروج */}
            <button
              onClick={logout}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium text-sm shadow-[0_0_10px_rgba(255,0,80,0.4)] transition-all"
            >
              Logout
            </button>
          </nav>
        </header>

        {/* 📊 المحتوى */}
        <main className="relative flex-1 container py-10 px-6">{children}</main>

        {/* ⚙️ Footer */}
        <footer className="relative border-t border-cyan-500/20 bg-[rgba(10,20,30,0.7)] backdrop-blur-md text-center py-5 text-sm text-white/60 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
          <p>Smart DevOps Platform — Dashboard © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
