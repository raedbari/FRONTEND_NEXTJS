"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PendingPage() {
  const [status, setStatus] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    const s = localStorage.getItem("status");
    if (s === "approved") setStatus("approved");
  }, []);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white overflow-hidden">
      {/* 🟢 خلفية نيونية */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_70%)] blur-3xl -z-10 pointer-events-none" />

      {/* 🔵 دوائر نيون متحركة */}
      <motion.div
        className="absolute w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🌟 المحتوى */}
      {status === "pending" ? (
        <>
          {/* 🕒 في انتظار الموافقة */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-lg bg-[#0b1624]/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.05)] p-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-6 w-20 h-20 rounded-full border-4 border-cyan-500/50 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 bg-cyan-400 rounded-full"
              />
            </motion.div>

            <h1 className="text-3xl font-bold mb-4 text-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
              Account Under Review
            </h1>
            <p className="text-white/70 mb-6 leading-relaxed">
              Your account has been successfully created and is currently under
              verification by the Smart DevOps team.
              <br />
              Please check back later or wait for approval notification.
            </p>
            <p className="text-sm text-white/40">
              This process usually takes a few moments ⏳
            </p>
          </motion.div>
        </>
      ) : (
        <>
          {/* ✅ تمت الموافقة */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-lg bg-[#0b1624]/60 backdrop-blur-md border border-emerald-400/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)] p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="mx-auto mb-6 w-20 h-20 rounded-full border-4 border-emerald-400/50 flex items-center justify-center"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="rgb(52, 211, 153)"
                className="w-10 h-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>

            <h1 className="text-3xl font-bold mb-4 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
              Approved 🎉
            </h1>
            <p className="text-white/70 mb-8 leading-relaxed">
              Congratulations! Your account has been successfully verified and approved.
              <br />
              You can now explore our documentation or log in to start using Smart DevOps Platform.
            </p>

            {/* 🔘 الأزرار الجديدة */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16,185,129,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => (window.location.href = "/auth/login")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:from-emerald-400 hover:to-teal-300 transition-all"
              >
                Go to Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(56,189,248,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => (window.location.href = "/auth/docs")}
                className="px-6 py-3 rounded-xl border border-cyan-400/40 text-cyan-300 font-semibold hover:bg-cyan-400/10 transition-all"
              >
                Explore Docs
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {/* 🌊 موجة متحركة */}
      <motion.svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" x2="1" y1="0" y2="0">
            <motion.stop
              offset="0%"
              stopColor={status === "pending" ? "#22d3ee" : "#34d399"}
              animate={{
                stopColor:
                  status === "pending"
                    ? ["#22d3ee", "#38bdf8", "#0ea5e9", "#22d3ee"]
                    : ["#34d399", "#10b981", "#059669", "#34d399"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.stop
              offset="100%"
              stopColor={status === "pending" ? "#38bdf8" : "#10b981"}
              animate={{
                stopColor:
                  status === "pending"
                    ? ["#38bdf8", "#0ea5e9", "#22d3ee", "#38bdf8"]
                    : ["#10b981", "#059669", "#34d399", "#10b981"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient)"
          fillOpacity="0.25"
          d="M0,160L60,170.7C120,181,240,203,360,176C480,149,600,75,720,69.3C840,64,960,128,1080,160C1200,192,1320,192,1380,192L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </motion.svg>
    </main>
  );
}
useEffect(() => {
  const checkStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/user/status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.status === "approved") {
      localStorage.setItem("status", "approved");
      setStatus("approved");
    }
  };

  checkStatus();

  // تحقق كل 30 ثانية بشكل تلقائي
  const interval = setInterval(checkStatus, 30000);
  return () => clearInterval(interval);
}, []);

