// app/auth/layout.tsx

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
