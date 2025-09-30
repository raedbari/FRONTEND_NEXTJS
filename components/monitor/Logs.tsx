// components/monitor/Logs.tsx
"use client";

import { useEffect, useState } from "react";
import { getLogs } from "@/lib/monitorClient";

type Props = { ns: string; app: string };

type LogItem = {
  ts: string;           // نانو ثانية من لوكي
  line: string;
  labels?: Record<string, string>;
};

export default function Logs({ ns, app }: Props) {
  const [q, setQ] = useState("");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function searchLogs(query: string) {
    setLoading(true);
    setErr(null);
    try {
      const data = await getLogs(ns, app, query || "", 900, 200);
      const items = Array.isArray((data as any)?.items) ? (data as any).items as LogItem[] : [];
      setLogs(items);
    } catch (e: any) {
      setErr(e?.message || "logs error");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  // تحميل مبدئي بدون فلتر
  useEffect(() => {
    searchLogs("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ns, app]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    searchLogs(q);
  }

  return (
    <div className="glass p-4 space-y-3">
      <div className="text-sm font-semibold">HTTP p95 ms / 5xx r/s</div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder='search e.g. "ERROR"'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "…" : "Search"}
        </button>
      </form>

      {err && <div className="text-red-400 text-sm">{String(err)}</div>}

      <div
        className="rounded bg-black/30 p-2 text-xs font-mono leading-5"
        style={{ maxHeight: 320, overflow: "auto", whiteSpace: "pre-wrap" }}
      >
        {(!logs || logs.length === 0) && !loading ? (
          <div className="text-zinc-400">no logs</div>
        ) : (
          logs.map((it, i) => {
            // تحويل نانو ثانية إلى ISO
            let t = "";
            try {
              const ms = Number(it.ts) / 1e6;
              t = new Date(ms).toISOString();
            } catch {}
            return (
              <div key={i}>
                <span className="text-zinc-400 mr-2">{t}</span>
                <span>{it.line}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
