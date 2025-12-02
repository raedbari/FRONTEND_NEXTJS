"use client";

import { useState, useEffect } from "react";

interface Log {
  id: number;
  user_email: string;
  tenant_ns: string;
  action: string;
  details: any;
  created_at: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [actionFilter, setActionFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [nsFilter, setNsFilter] = useState("");

  const load = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (actionFilter) params.append("action", actionFilter);
    if (emailFilter) params.append("email", emailFilter);
    if (nsFilter) params.append("namespace", nsFilter);

    const res = await fetch(`/api/logs?${params.toString()}`, {
      credentials: "include",
    });

    const data = await res.json();
    setLogs(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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

      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
        🛡️ Admin Logs
      </h2>

      <p className="text-white/70 mb-6">
        View all activities across all users and tenants.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          placeholder="Filter by action"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40"
        />

        <input
          placeholder="Filter by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40"
        />

        <input
          placeholder="Filter by namespace"
          value={nsFilter}
          onChange={(e) => setNsFilter(e.target.value)}
          className="px-3 py-2 bg-[#0a1625]/60 border border-cyan-500/30 rounded-lg text-white placeholder-white/40"
        />

        <button
          onClick={load}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      {loading && <p className="text-cyan-300">Loading logs…</p>}

      {!loading && logs.length === 0 && (
        <p className="text-white/60">No logs found.</p>
      )}

      {!loading && logs.length > 0 && (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-cyan-300 text-left px-3">Time</th>
              <th className="text-cyan-300 text-left px-3">Email</th>
              <th className="text-cyan-300 text-left px-3">Namespace</th>
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
                  {log.user_email}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-cyan-300">
                  {log.tenant_ns}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-cyan-400">
                  {log.action}
                </td>

                <td className="px-3 py-2 bg-[#0b1b2d]/60 border border-cyan-500/20 rounded-lg text-white">
                  <pre className="whitespace-pre-wrap text-white/80 text-sm">
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
