
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Smart DevOps Deployment",
  description: "Cloud-Native DevOps Platform UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Navbar ثابت وأنيق */}
        <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#0a1625] shadow-lg border-b border-cyan-500/10">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
            <Link href="/" className="font-extrabold tracking-wide text-cyan-300">
              Smart <span className="text-white">DevOps</span>
            </Link>

            <div className="flex gap-4">
              <Link href="/apps/new" className="text-cyan-300 hover:text-white transition">
                Deploy
              </Link>
              <Link href="/apps" className="text-cyan-300 hover:text-white transition">
                App Status
              </Link>
            </div>
          </nav>
        </header>

        {/* ✅ محتوى الصفحة تحت الـ Navbar */}
        <main className="pt-24 px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
