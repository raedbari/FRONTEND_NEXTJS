"use client";

import { useEffect, useState } from "react";
import { listPendingTenants, approveTenant, rejectTenant, PendingTenant } from "@/lib/adminClient";
import RequireAuth from "@/components/RequireAuth";
import { motion } from "framer-motion";

export default function AdminTenantsPage() {
  const [items, setItems] = useState<PendingTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<number | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await listPendingTenants();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function doApprove(id: number) {
    const role = await new Promise<string | null>((resolve) => {
      const input = prompt("Assign role (client or devops):", "client");
      resolve(input);
    });
    if (!role) return;

    try {
      setWorkingId(id);
      await approveTenant(id, { role }); // ✅ تمرير الدور إلى الـ backend
      await load();
      alert(`Approved ✔️ as ${role} — provisioning started in background`);
    } catch (e: any) {
      alert(e?.message || "Approve failed");
    } finally {
      setWorkingId(null);
    }
  }

  async function doReject(id: number) {
    const reason = prompt("Reason (optional):") || undefined;
    try {
      setWorkingId(id);
      await rejectTenant(id, reason);
      await load();
      alert("Rejected ❌");
    } catch (e: any) {
      alert(e?.message || "Reject failed");
    } finally {
      setWorkingId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <RequireAuth>
      <section className="flex flex-col items-center min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white px-6 py-10">
        <motion.div
          className="w-full max-w-5xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Pending Tenants
            </motion.h2>
            <motion.button
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 transition disabled:opacity-50"
              onClick={load}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </motion.button>
          </div>

          {err && (
            <p className="text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4 text-sm animate-pulse">
              {err}
            </p>
          )}

          {loading && (
            <p className="text-zinc-400 animate-pulse text-center py-4">Loading tenants…</p>
          )}

          {!loading && !err && (
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-zinc-400 border-b border-white/10">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Admin Email</th>
                    <th className="py-3 px-4">Namespace</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition duration-200 ${
                        i % 2 === 0 ? "bg-white/0" : "bg-white/5"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="py-3 px-4 text-zinc-300">{t.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{t.name}</td>
                      <td className="py-3 px-4 text-zinc-400">{t.email}</td>
                      <td className="py-3 px-4 font-mono text-sky-400">{t.k8s_namespace}</td>
                      <td className="py-3 px-4 flex justify-end gap-3">
                        <motion.button
                          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition disabled:opacity-50"
                          disabled={workingId === t.id}
                          onClick={() => doApprove(t.id)}
                          whileTap={{ scale: 0.95 }}
                        >
                          {workingId === t.id ? "Working…" : "Approve"}
                        </motion.button>
                        <motion.button
                          className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 transition disabled:opacity-50"
                          disabled={workingId === t.id}
                          onClick={() => doReject(t.id)}
                          whileTap={{ scale: 0.95 }}
                        >
                          Reject
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-zinc-500 py-6">
                        No pending tenants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      </section>
    </RequireAuth>
  );
}