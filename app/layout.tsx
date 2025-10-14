// app/layout.tsx
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

          <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontWeight: 800, letterSpacing: 0.2 }}>
              Smart DevOps
            </Link>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Link href="/apps/new" className="btn btn-ghost">
                Deploy App
              </Link>
              <Link href="/apps" className="btn btn-ghost">
                Apps Status
              </Link>
            </div>
          </nav>
        </header>

      <main className="pt-24 px-6">
  {children}
</main>

      </body>
    </html>
  );
}
