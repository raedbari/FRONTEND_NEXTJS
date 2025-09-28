"use client";
import { useEffect, useState } from "react";
import { getEvents } from "@/lib/monitorClient";

export default function Events({ ns, app }:{ns:string;app:string}){
  const [ev,setEv]=useState<any[]>([]);
  useEffect(()=>{ const f=async()=>setEv((await getEvents(ns,app)).items); f(); const id=setInterval(f,20_000); return ()=>clearInterval(id); },[ns,app]);
  return (
    <div className="rounded-2xl shadow p-4 text-sm">
      <h3 className="mb-2">Events</h3>
      <ul className="space-y-1">{ev.map((e,i)=>(<li key={i}>{e.at} · {e.type}/{e.reason} · {e.note}</li>))}</ul>
    </div>
  );
}
