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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
        if (data?.tenant)
          localStorage.setItem("tenant", JSON.stringify(data.tenant));
        if (data?.tenant?.k8s_namespace) {
          localStorage.setItem("ns", data.tenant.k8s_namespace);
        }
        router.replace("/dashboard/apps");
        return;
      }

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        const msg = (data?.detail ?? "").toString().toLowerCase();
        if (msg.includes("pending")) {
          router.replace("/auth/pending");
          return;
        }
        setErr(data?.detail ?? "Forbidden");
        return;
      }

      if (res.status === 404) {
        setErr("Invalid email or password.");
        return;
      }

      const text = await res.text();
      setErr(text || `Login failed (${res.status})`);
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white overflow-hidden">
      {/* 🔮 خلفية نيون متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_70%)] blur-3xl" />

      {/* ⚡ حاوية تسجيل الدخول */}
      <div className="relative w-full max-w-md p-8 rounded-2xl border border-cyan-500/20 bg-[rgba(10,20,30,0.6)] shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl z-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          Sign In
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg bg-[rgba(0,20,40,0.6)] border border-cyan-500/20 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-400 focus:ring-0 outline-none transition-all"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>

          {err && (
            <p className="text-red-400 text-sm text-center mt-2">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
              loading
                ? "bg-cyan-900/60 text-white/70 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            }`}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-white/60 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <a
            href="/auth/signup"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
} 