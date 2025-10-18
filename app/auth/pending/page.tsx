"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PendingPage() {
  const [status, setStatus] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Access token:", token);

    if (!token) {
      console.warn("⚠️ No token found in localStorage, cannot check status");
      return;
    }

    let isActive = true; // لتجنب memory leaks عند إغلاق الصفحة

    async function checkStatus() {
      if (!isActive) return;
      console.log("🔁 Checking tenant status...");

      try {
        const res = await fetch("/api/onboarding/me/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("❌ Error fetching status:", res.status);
          setTimeout(checkStatus, 15000);
          return;
        }

        const data = await res.json();
        console.log("✅ Status response:", data);

        if (data.status === "active") {
          localStorage.setItem("status", "approved");
          setStatus("approved");

          // بعد الموافقة، نحذف التوكن المؤقت
          localStorage.removeItem("access_token");

          // يمكن توجيهه تلقائيًا بعد بضع ثوانٍ
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 7000);
        } else {
          // إذا لا يزال Pending، نعيد الاستعلام بعد 15 ثانية
          setTimeout(checkStatus, 15000);
        }
      } catch (e) {
        console.error("Error checking status:", e);
        setTimeout(checkStatus, 20000);
      }
    }

    checkStatus();

    return () => {
      isActive = false;
    };
  }, []);

  const handleDocs = () => (window.location.href = "/docs");
  const handleLogin = () => (window.location.href = "/auth/login");

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white overflow-hidden">
      {/* 🟢 الخلفية */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_70%)] blur-3xl -z-10" />

      {/* 🔵 حركة النيون */}
      <motion.div
        className="absolute w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl"
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 💬 المحتوى */}
      {status === "pending" ? (
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

          <h1 className="text-3xl font-bold mb-4 text-cyan-400">
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-lg bg-[#0b1624]/60 backdrop-blur-md border border-emerald-400/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)] p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>

          <h1 className="text-3xl font-bold mb-4 text-emerald-400">
            Approved 🎉
          </h1>
          <p className="text-white/70 mb-6 leading-relaxed">
            Congratulations! Your account has been successfully verified and
            approved.
            <br />
            You can now explore our documentation or access your dashboard.
          </p>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleDocs}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-400 text-white font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:from-cyan-400 hover:to-blue-300 transition-all"
            >
              Learn More
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogin}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:from-emerald-400 hover:to-teal-300 transition-all"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
