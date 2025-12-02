"use client";

import { useEffect, useState } from "react";

interface Log {
  id: number;
  action: string;
  details: any;
  ip: string;
  user_agent: string;
  created_at: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const token = localStorage.getItem("token"); // ← التوكن من تسجيل الدخول
      if (!token) {
        console.warn("No token found in localStorage");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/logs/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load logs:", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLogs(data.items || []);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <section
      className="relative p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]
                 border border-cyan-500/20 max-w-4xl mx-auto my-10
                 backdrop-blur-md bg-[rgba(10,20,30,0.7)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(0,255,255,0.07), transparent 70%)",
      }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />

      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
        📜 My Activity Logs
      </h2>

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
