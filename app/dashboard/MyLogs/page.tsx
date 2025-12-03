"use client";

import { useEffect, useState } from "react";

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
  const [refreshing, setRefreshing] = useState(false);

  // ---------------------------------------
  // 🟦 جلب السجلات
  // ---------------------------------------
  const loadLogs = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/logs/my", { credentials: "include" });
      const data = await res.json();
      setLogs(data.items || []);
    } catch (e) {
      console.error("Failed to load logs", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <section
      className="relative p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]
                 border border-cyan-500/20 max-w-5xl mx-auto my-10
                 backdrop-blur-md bg-[rgba(10,20,30,0.7)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(0,255,255,0.07), transparent 70%)",
      }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />

      {/* العنوان + زر التحديث */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
          📜 My Activity Logs
        </h2>

        
        <button
          onClick={loadLogs}
          disabled={refreshing}
          className={`px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 
                      text-white font-medium shadow-[0_0_10px_rgba(0,255,255,0.4)]
                      transition-all duration-200 ${
                        refreshing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <p className="text-white/70 mb-6">
        Here you can see all actions you performed on your apps.
      </p>

      {loading && <p className="text-cyan-300">Loading logs…</p>}

      {!loading && logs.length === 0 && (
        <p className="text-white/60">No logs found.</p>
      )}

      {!loading && logs.length > 0 && (
        <table className="w-full border-separate border-spacing-y-2">
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

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-cyan-300">
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
