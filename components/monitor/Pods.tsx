"use client";
import { useEffect, useState } from "react";
import { getPods } from "@/lib/monitorClient";

export default function Pods({ ns, app }:{ns:string; app:string}){
  const [pods,setPods]=useState<any[]>([]);
  useEffect(()=>{ const f=async()=>setPods(await getPods(ns,app));
                  f(); const id=setInterval(f,15000); return ()=>clearInterval(id); },[ns,app]);
  return (
    <div className="rounded-2xl shadow p-4 text-sm">
      <h3 className="mb-2">Pods</h3>
      <ul className="space-y-1">
        {pods.map((p:any)=>(
          <li key={p.name}>{p.ready ? "✅" : "⚠️"} {p.name} · {p.phase} · {p.image}</li>
        ))}
      </ul>
    </div>
  );
}
