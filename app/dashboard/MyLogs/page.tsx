"use client";

import { useEffect, useState } from "react";

interface Log {
  id: number;
  user_email: string;
  action: string;
  details: any;
  created_at: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Spinner نفس الذي في صفحة Apps
  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-cyan-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  // 🔄 دالة Refresh
  async function load() {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://smartdevops.lat/api/logs/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed:", res.status);
      }

      const data = await res.json();
      setLogs(data.items || []);
    } catch (err) {
      console.error("Error loading logs:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section
      className="relative p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]
                 border border-cyan-500/20 max-w-5xl mx-auto my-10
                 backdrop-blur-md bg-[rgba(10,20,30,0.7)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          📜 My Activity Logs
        </h2>

        {/* 🔥 زر Refresh الجديد */}
        <button
          onClick={load}
          disabled={loading}
          className="px-5 py-2 rounded-xl border border-cyan-500/30 text-cyan-300 flex gap-2"
        >
          {loading && <Spinner />}
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

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
                  {log.user_email}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-white">
                  {log.action}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg">
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
