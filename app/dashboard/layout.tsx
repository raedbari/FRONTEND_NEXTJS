"use client";
import Link from "next/link";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 🧠 التحقق من صلاحية التوكن
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
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

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    router.replace("/auth/login");
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#050b14] text-white relative overflow-hidden">
        {/* 🔮 خلفية متدرجة مضيئة */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(0,255,255,0.15),transparent_70%)] blur-3xl" />

        {/* 🧭 الشريط العلوي */}
        <header className="relative border-b border-cyan-500/20 bg-[rgba(10,20,30,0.7)] backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            {/* شعار وروابط */}
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard/apps"
                className="font-semibold text-white hover:text-cyan-400 transition duration-200 text-lg tracking-wide"
              >
                Smart <span className="text-cyan-400">DevOps</span>
              </Link>

              <Link
                href="/dashboard/apps"
                className="hover:text-cyan-300 transition-colors duration-200"
              >
                Apps Status
              </Link>

              <Link
                href="/dashboard/apps/new"
                className="hover:text-cyan-300 transition-colors duration-200"
              >
                Deploy
              </Link>

              <Link
                href="/dashboard/monitor"
                className="hover:text-cyan-300 transition-colors duration-200"
              >
                Monitor
              </Link>
            </div>

            {/* زر الخروج */}
            <div>
              <button
                onClick={logout}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium text-sm shadow-[0_0_10px_rgba(255,0,80,0.4)] transition-all"
              >
                Logout
              </button>
            </div>
          </nav>
        </header>

        {/* 📊 محتوى لوحة التحكم */}
        <main className="relative flex-1 container py-10 px-6">{children}</main>

        {/* ⚙️ التذييل */}
        <footer className="relative border-t border-cyan-500/20 bg-[rgba(10,20,30,0.7)] backdrop-blur-md text-center py-5 text-sm text-white/60 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
          <p>
            Smart DevOps Platform — Dashboard © {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  );
}
