"use client";
import { useEffect, useState } from "react";
import { getOverview } from "@/lib/monitorClient";

export default function Charts({ ns, app }:{ns:string;app:string}){
  const [pts,setPts]=useState<{p95:number;err:number}[]>([]);
  useEffect(()=>{ const tick=async()=>{try{const o=await getOverview(ns,app); setPts(p=>[...p.slice(-60), {p95:o.http?.p95_ms||0, err:o.http?.errors_rate||0}]);}catch{}}; tick(); const id=setInterval(tick,10_000); return ()=>clearInterval(id); },[ns,app]);
  const xs=pts.length>1?pts.map((_,i)=>i*(100/(pts.length-1))):[0];
  const path=(ys:number[])=>ys.length<2?null:<path d={`M ${ys.map((y,i)=>`${xs[i].toFixed(2)} ${y.toFixed(2)}`).join(" L ")}`} fill="none" strokeWidth="0.8"/>;
  return (
    <div className="rounded-2xl shadow p-4">
      <h3 className="text-sm mb-2">HTTP p95 ms / 5xx r/s</h3>
      <svg viewBox="0 0 100 40" className="w-full h-40">
        {path(pts.map(p=>40 - Math.min(39, p.p95/1000)))}
        {path(pts.map(p=>40 - Math.min(39, p.err*40)))}
      </svg>
    </div>
  );
}
