// app/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

export const metadata = {
  title: "Smart DevOps Deployment",
  description: "Cloud-Native DevOps Platform UI",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body className="bg-[#050b14] text-white">
        {/* ✅ Navbar تظهر فقط إذا لم تكن في صفحة auth */}
        {!isAuthPage && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1625] shadow-md border-b border-cyan-500/10 backdrop-blur-md">
            <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
              <Link href="/" className="font-extrabold tracking-wide text-cyan-300">
                Smart <span className="text-white">DevOps</span>
              </Link>

              <div className="flex gap-6">
                <Link href="/apps/new" className="text-cyan-300 hover:text-white transition">
                  Deploy
                </Link>
                <Link href="/apps" className="text-cyan-300 hover:text-white transition">
                  App Status
                </Link>
                <Link href="/monitor" className="text-cyan-300 hover:text-white transition">
                  Monitor
                </Link>
              </div>
            </nav>
          </header>
        )}

        {/* ✅ مسافة فقط إذا كان هناك Navbar */}
        <main className={!isAuthPage ? "pt-[88px] px-6" : "px-6"}>{children}</main>
      </body>
    </html>
  );
}
