// app/auth/layout.tsx
import Link from "next/link";
import "../globals.css";

export const metadata = {
  title: "Smart DevOps Platform",
  description: "Cloud-native automation & monitoring platform",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#050b14] text-white overflow-x-hidden">
        {/* 🔮 خلفية نيون عامة لكل صفحات auth */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_70%)] blur-3xl" />

        {/* 🧭 Navbar */}
        <header className="border-b border-cyan-500/20 bg-[rgba(10,20,30,0.6)] backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            {/* شعار الموقع */}
            <Link
              href="/"
              className="text-lg font-semibold tracking-wide text-cyan-300 hover:text-cyan-400 transition drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
            >
              Smart <span className="text-cyan-400">DevOps</span>
            </Link>

            {/* روابط القائمة */}
            <div className="flex items-center gap-6 text-[15px]">
              <Link
                href="/"
                className="text-white/80 hover:text-cyan-300 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/auth/docs"
                className="text-white/80 hover:text-cyan-300 transition-colors duration-200"
              >
                Docs
              </Link>
              <Link
                href="/auth/contact"
                className="text-white/80 hover:text-cyan-300 transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.3)] text-white text-[14px] font-semibold transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>

        {/* 📄 محتوى الصفحة */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 z-10">
          {children}
        </main>

        {/* ⚙️ Footer */}
        <footer className="border-t border-cyan-500/10 bg-[rgba(10,20,30,0.6)] backdrop-blur-xl py-6 text-center text-sm text-white/50 shadow-[0_-0_25px_rgba(0,255,255,0.05)]">
          <p className="text-white/60">
            © {new Date().getFullYear()}{" "}
            <span className="text-cyan-400 font-medium">Smart DevOps Platform</span> — Built for
            modern cloud automation.
          </p>
        </footer>
      </body>
    </html>
  );
}
