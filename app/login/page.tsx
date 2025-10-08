"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json(); // {token: "..."}
      localStorage.setItem("token", data.token);
      router.push("/apps");
    } catch (e: any) {
      setErr(e?.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1220] relative overflow-hidden">
      {/* خلفية شبكية خفيفة */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
           style={{ backgroundImage:
            "radial-gradient(#7aa2f7 1px, transparent 1px)",
            backgroundSize: "22px 22px" }} />

      {/* هيدر بسيط */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <h1 className="text-lg font-semibold tracking-wide text-white/90">
          Smart <span className="text-sky-400">DevOps</span>
        </h1>
        <nav className="hidden md:flex items-center gap-2">
          <a href="/apps" className="btn btn-ghost">Apps Status</a>
          <a href="/apps/new" className="btn btn-ghost">Deploy App</a>
        </nav>
      </header>

      {/* البطاقة */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-xl p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-white text-xl font-bold">تسجيل الدخول</h2>
              <p className="text-white/60 text-sm mt-1">ادخل بريدك وكلمة المرور</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit} dir="rtl">
              <div>
                <label className="block text-sm text-white/70 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="w-full input"
                  placeholder="demo@local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  className="w-full input"
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>

              {err && (
                <div className="text-[13px] text-rose-300 bg-rose-900/30 border border-rose-800 rounded-lg p-2">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-11 text-[15px]"
              >
                {loading ? "جارٍ الدخول…" : "دخول"}
              </button>

              {/* تلميح للحساب التجريبي */}
              <p className="text-center text-xs text-white/50 mt-2">
                جرّب: <span className="font-mono">demo@local</span> / <span className="font-mono">demo123</span>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
