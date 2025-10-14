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
        <header className="container" style={{ paddingTop: 16, paddingBottom: 8 }}>
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

        <main className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
