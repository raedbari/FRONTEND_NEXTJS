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

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

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
      setLoading(false);
    };

    load();
  }, []);

  return (
    <section className="relative p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]
                 border border-cyan-500/20 max-w-5xl mx-auto my-10
                 backdrop-blur-md bg-[rgba(10,20,30,0.7)]">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
        📜 My Activity Logs
      </h2>

      {loading && <p className="text-cyan-300">Loading logs…</p>}
      {!loading && logs.length === 0 && <p className="text-white/60">No logs found.</p>}

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
