"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload?.exp ? payload.exp * 1000 : 0;
        if (Date.now() < exp) {
          router.replace("/dashboard/apps");
          return;
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center text-white overflow-hidden">
      {/* 🟢 خلفية متدرجة نيونية */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_70%)] blur-3xl -z-10" />

      {/* 🔵 دوائر نيون متحركة */}
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

      {/* 🌟 العنوان */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]"
      >
        Smart{" "}
        <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]">
          DevOps
        </span>{" "}
        Platform
      </motion.h1>

      {/* 📜 الوصف */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed"
      >
        Automate your deployments, monitor workloads, and manage tenants — all
        from one unified cloud-native dashboard built for speed and reliability.
      </motion.p>

      {/* 🔘 الأزرار */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 25px rgba(56,189,248,0.6)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/auth/login")}
          className="px-7 py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)]"
        >
          Get Started
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255,255,255,0.1)",
            boxShadow: "0 0 20px rgba(255,255,255,0.2)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/auth/docs")}
          className="px-7 py-3 rounded-xl border border-white/20 text-white/80 font-medium hover:text-white transition-all"
        >
          Learn More
        </motion.button>
      </motion.div>

      {/* ✨ شعار متحرك */}
      <motion.div
        className="absolute bottom-28 text-cyan-400/70 text-sm select-none"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Empowering Cloud Automation ✨
      </motion.div>

      {/* 🌊 موجة متغيرة اللون */}
      <motion.svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          {/* Gradient متغير اللون */}
          <linearGradient id="waveGradient" x1="0" x2="1" y1="0" y2="0">
            <motion.stop
              offset="0%"
              stopColor="#22d3ee" // cyan-400
              animate={{
                stopColor: ["#22d3ee", "#38bdf8", "#0ea5e9", "#22d3ee"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.stop
              offset="100%"
              stopColor="#38bdf8" // sky-400
              animate={{
                stopColor: ["#38bdf8", "#0ea5e9", "#22d3ee", "#38bdf8"],
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
