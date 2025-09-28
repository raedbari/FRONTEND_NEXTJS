"use client";
import { useEffect, useState } from "react";
import { getOverview } from "@/lib/monitorClient";

export default function Overview({ ns, app }:{ns:string;app:string}){
  const [d,setD]=useState<any>(null);
  useEffect(()=>{ const f=()=>getOverview(ns,app).then(setD).catch(()=>{}); f(); const id=setInterval(f,10_000); return ()=>clearInterval(id); },[ns,app]);
  if(!d) return <div className="text-sm opacity-70">loading…</div>;
  return (
    <div className="rounded-2xl shadow p-4">
      <div className="grid grid-cols-4 gap-4">
        <Stat k="Desired" v={d.replicas.desired}/>
        <Stat k="Available" v={d.replicas.available}/>
        <Stat k="HTTP p95 ms" v={d.http?.p95_ms ?? "—"}/>
        <Stat k="HTTP 5xx r/s" v={d.http?.errors_rate?.toFixed(3) ?? "0"}/>
      </div>
      <div className="mt-3 text-xs">
        CPU: {d.cpu_mcores.map((x:any)=>`${x.pod}:${x.mcores}m`).join("  ")}<br/>
        MEM: {d.mem_bytes.map((x:any)=>`${x.pod}:${x.bytes}`).join("  ")}
      </div>
    </div>
  );
}
function Stat({k,v}:{k:string;v:any}){ return <div className="p-3 bg-neutral-900 rounded-xl"><div className="text-xs opacity-60">{k}</div><div className="text-lg">{v}</div></div>; }
