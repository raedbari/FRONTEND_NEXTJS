"use client";

import { useEffect, useState, useCallback } from "react";

interface Log {
  id: number;
  user: string;
  action: string;
  details: any;
  ip: string;
  user_agent: string;
  created_at: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟦 دالة واحدة لجلب اللوجات (تستخدم في أول تحميل + زر Refresh)
  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);

      // نقرأ التوكن من localStorage ونرسله كـ Bearer
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setLogs([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/logs/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // في حالة 401 / 403 أو أي خطأ آخر
        console.error("Failed to load logs:", res.status, await res.text());
        setLogs([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLogs(data.items || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading logs:", err);
      setLogs([]);
      setLoading(false);
    }
  }, []);

  // أول تحميل للصفحة
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <section
      className="relative p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]
                 border border-cyan-500/20 max-w-6xl mx-auto my-10
                 backdrop-blur-md bg-[rgba(10,20,30,0.7)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(0,255,255,0.07), transparent 70%)",
      }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />

      {/* العنوان + زر Refresh في سطر واحد مثل Apps Status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
            📜 My Activity Logs
          </h2>
          <p className="text-white/70">
            Here you can see all actions you performed on your apps.
          </p>
        </div>

        {/* زر Refresh – نفس الستايل المنطقي لزر Apps Status */}
        <button
          onClick={loadLogs}
          className="px-6 py-2 rounded-full border border-cyan-400/80
                     text-cyan-300 font-medium text-sm
                     hover:bg-cyan-500/10 hover:text-cyan-100
                     shadow-[0_0_15px_rgba(0,255,255,0.25)]
                     hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]
                     transition-all duration-150"
        >
          Refresh
        </button>
      </div>

      {/* حالة التحميل */}
      {loading && <p className="text-cyan-300 mt-4">Loading logs…</p>}

      {/* لا توجد سجلات */}
      {!loading && logs.length === 0 && (
        <p className="text-white/60 mt-4">No logs found.</p>
      )}

      {/* جدول اللوجات */}
      {!loading && logs.length > 0 && (
        <table className="w-full border-separate border-spacing-y-2 mt-4">
          <thead>
            <tr>
              <th className="text-cyan-300 text-left px-3">Time</th>
              <th className="text-cyan-300 text-left px-3">User</th>
              <th className="text-cyan-300 text-left px-3">Action</th>
              <th className="text-cyan-300 text-left px-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-white">
                  {new Date(log.created_at).toLocaleString()}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-cyan-200">
                  {log.user}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-cyan-300">
                  {log.action}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-white">
                  <pre className="text-white/80 whitespace-pre-wrap text-sm">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
