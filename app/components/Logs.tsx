"use client";
import { useEffect, useState } from "react";
import { getLogs } from "@/lib/monitorClient";

export default function Logs({ ns, app }:{ns:string;app:string}){
  const [q,setQ]=useState(""); const [items,setItems]=useState<any[]>([]);
  const pull=async()=>{ try{ const r=await getLogs(ns,app,q); setItems(r.items.slice(-500)); }catch{} };
  useEffect(()=>{ pull(); const id=setInterval(pull,15_000); return ()=>clearInterval(id); },[ns,app,q]);
  return (
    <div className="rounded-2xl shadow p-4">
      <div className="flex gap-2 mb-2">
        <input className="w-full bg-neutral-900 rounded p-2 text-sm" placeholder='search e.g. "ERROR"' value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-3 py-2 rounded bg-blue-600 text-sm" onClick={pull}>Search</button>
      </div>
      <div className="h-64 overflow-auto text-xs font-mono leading-5">
        {items.map((x,i)=>(<div key={i}><span className="opacity-60">{new Date(Number((x.ts+"").slice(0,13))).toISOString()} </span>{x.line}</div>))}
      </div>
    </div>
  );
}
