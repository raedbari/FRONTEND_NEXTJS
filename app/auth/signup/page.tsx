"use client";
import { useState } from "react";

export default function SignupPage() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [ns, setNs] = useState("");
  const [pwd, setPwd] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          email,
          password: pwd,
          namespace: ns,
          note,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOk(true);
      window.location.href = "/auth/pending";
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#050b14] text-white overflow-hidden">
      {/* 🔮 خلفية نيون متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_70%)] blur-3xl" />

      {/* 🧊 بطاقة التسجيل الزجاجية */}
      <div className="relative w-full max-w-md p-8 rounded-2xl border border-cyan-500/20 bg-[rgba(10,20,30,0.6)] shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          Request an Account
        </h2>

        {!ok ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="Namespace (e.g. tenant-acme)"
              value={ns}
              onChange={(e) => setNs(e.target.value)}
              required
            />

            <input
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="Admin email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              placeholder="Password"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
            />

            <textarea
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all resize-none"
              placeholder="Notes (optional)"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {err && (
              <p className="text-rose-400 text-sm text-center mt-2">{err}</p>
            )}

            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                loading
                  ? "bg-cyan-900/60 text-white/70 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              }`}
              disabled={loading}
            >
              {loading ? "Submitting…" : "Submit"}
            </button>
          </form>
        ) : (
          <div className="text-center text-cyan-300 mt-6">
            ✅ Request sent successfully! <br />
            You’ll be redirected shortly...
          </div>
        )}
      </div>
    </main>
  );
