

import Link from "next/link";


import "./globals.css";
import { headers } from "next/headers";

export const metadata = {
  title: "Smart DevOps Deployment",
  description: "Cloud-Native DevOps Platform UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const currentPath = headersList.get("x-invoke-path") || "";

  // ✅ إخفاء الـ Navbar إذا كنا داخل مجلد /auth أو /dashboard
  const hideNavbar = currentPath.startsWith("/auth") || currentPath.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className="bg-[#050b14] text-white">
        {!hideNavbar && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1625] shadow-md border-b border-cyan-500/10 backdrop-blur-md">
            <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
              <Link href="/" className="font-extrabold tracking-wide text-cyan-300">
                Smart <span className="text-white">DevOps</span>
              </Link>

              <div className="flex gap-6">
                <Link href="/apps/deploy" className="text-cyan-300 hover:text-white transition">
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

        {/* ✅ محتوى الصفحة */}
        <main className={!hideNavbar ? "pt-[88px] px-6" : "px-6"}>{children}</main>
      </body>
    </html>
  );

}

