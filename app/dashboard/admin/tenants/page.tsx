"use client";

import { useEffect, useState } from "react";
import { listPendingTenants, approveTenant, rejectTenant, PendingTenant } from "@/lib/adminClient";
import RequireAuth from "@/components/RequireAuth";

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
    try {
      setWorkingId(id);
      await approveTenant(id);
      await load();
      alert("Approved ✔️ — provisioning started in background");
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
        <div className="w-full max-w-5xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Pending Tenants
            </h2>
            <button
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 transition disabled:opacity-50"
              onClick={load}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {err && (
            <p className="text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4 text-sm">
              {err}
            </p>
          )}

          {loading && (
            <p className="text-zinc-400 animate-pulse text-center py-4">Loading tenants…</p>
          )}

          {!loading && !err && (
            <div className="overflow-x-auto">
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
                    <tr
                      key={t.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition duration-200 ${
                        i % 2 === 0 ? "bg-white/0" : "bg-white/5"
                      }`}
                    >
                      <td className="py-3 px-4 text-zinc-300">{t.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{t.name}</td>
                      <td className="py-3 px-4 text-zinc-400">{t.email}</td>
                      <td className="py-3 px-4 font-mono text-sky-400">{t.k8s_namespace}</td>
                      <td className="py-3 px-4 flex justify-end gap-3">
                        <button
                          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition disabled:opacity-50"
                          disabled={workingId === t.id}
                          onClick={() => doApprove(t.id)}
                        >
                          {workingId === t.id ? "Working…" : "Approve"}
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 transition disabled:opacity-50"
                          disabled={workingId === t.id}
                          onClick={() => doReject(t.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
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
            </div>
          )}
        </div>
      </section>
    </RequireAuth>
  );
}
