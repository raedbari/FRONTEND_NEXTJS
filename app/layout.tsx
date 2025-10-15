import Link from "next/link";
import "./globals.css";
import { headers } from "next/headers";

export const metadata = {
  title: "Smart DevOps Platform",
  description: "Cloud-native automation & monitoring platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const currentPath = headersList.get("x-invoke-path") || "";

  // ✅ تحديد نوع الصفحة
  const isAuthPage = currentPath.startsWith("/auth");
  const isDashboardPage =
    currentPath.startsWith("/apps") ||
    currentPath.startsWith("/monitor") ||
    currentPath.startsWith("/dashboard");

  // ✅ Navbar مخصص لكل نوع
  const Navbar = () => {
    if (isAuthPage) {
      return (
        <header className="border-b border-cyan-500/20 bg-[rgba(10,20,30,0.6)] backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-wide text-cyan-300 hover:text-cyan-400 transition drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
            >
              Smart <span className="text-cyan-400">DevOps</span>
            </Link>
            <div className="flex items-center gap-6 text-[15px]">
              <Link href="/" className="text-white/80 hover:text-cyan-300 transition">Home</Link>
              <Link href="/docs" className="text-white/80 hover:text-cyan-300 transition">Docs</Link>
              <Link href="/contact" className="text-white/80 hover:text-cyan-300 transition">Contact</Link>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.3)] text-white text-[14px] font-semibold transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>
      );
    }

    if (isDashboardPage) {
      return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1625] shadow-md border-b border-cyan-500/10 backdrop-blur-md">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
            <Link href="/" className="font-extrabold tracking-wide text-cyan-300">
              Smart <span className="text-white">DevOps</span>
            </Link>
            <div className="flex gap-6">
              <Link href="/apps/deploy" className="text-cyan-300 hover:text-white transition">Deploy</Link>
              <Link href="/apps" className="text-cyan-300 hover:text-white transition">App Status</Link>
              <Link href="/monitor" className="text-cyan-300 hover:text-white transition">Monitor</Link>
            </div>
          </nav>
        </header>
      );
    }

    // Navbar الافتراضي (نفس dashboard)
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1625] shadow-md border-b border-cyan-500/10 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
          <Link href="/" className="font-extrabold tracking-wide text-cyan-300">
            Smart <span className="text-white">DevOps</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/apps/deploy" className="text-cyan-300 hover:text-white transition">Deploy</Link>
            <Link href="/apps" className="text-cyan-300 hover:text-white transition">App Status</Link>
            <Link href="/monitor" className="text-cyan-300 hover:text-white transition">Monitor</Link>
          </div>
        </nav>
      </header>
    );
  };

  return (
    <html lang="en">
      <body className="bg-[#050b14] text-white">
        <Navbar />
        <main className={!isAuthPage ? "pt-[88px] px-6" : "px-6"}>{children}</main>
      </body>
    </html>
  );
}
