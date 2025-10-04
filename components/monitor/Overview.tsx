// "use client";
// import { useEffect, useState } from "react";
// import { getOverview } from "@/lib/monitorClient";

// export default function Overview({ ns, app }:{ns:string;app:string}){
//   const [d,setD]=useState<any>(null);
//   const [err,setErr]=useState<string|null>(null);

//   useEffect(()=>{
//     let alive=true;
//     const f=async()=>{
//       try { const x=await getOverview(ns,app); if(!alive) return; setD(x); setErr(null); }
//       catch(e:any){ if(!alive) return; setErr(e?.message||"overview error"); }
//     };
//     f();
//     const id=setInterval(f,10_000);
//     return ()=>{ alive=false; clearInterval(id); };
//   },[ns,app]);

//   if(err) return <div className="text-sm text-red-400">Overview: {err}</div>;
//   if(!d)  return <div className="text-sm opacity-70">loading…</div>;

//   const http = d?.http ?? { p95_ms: null, errors_rate: 0 };
//   const cpu  = Array.isArray(d?.cpu_mcores)? d.cpu_mcores : [];
//   const mem  = Array.isArray(d?.mem_bytes)? d.mem_bytes : [];

//   return (
//     <div className="rounded-2xl shadow p-4">
//       <div className="grid grid-cols-4 gap-4">
//         <Stat k="Desired"     v={d?.replicas?.desired ?? 0}/>
//         <Stat k="Available"   v={d?.replicas?.available ?? 0}/>
//         <Stat k="HTTP p95 ms" v={http.p95_ms ?? "—"}/>
//         <Stat k="HTTP 5xx r/s"v={(http.errors_rate ?? 0).toFixed(3)}/>
//       </div>
//       <div className="mt-3 text-xs">
//         CPU: {cpu.map((x:any)=>`${x.pod}:${x.mcores}m`).join("  ") || "—"}<br/>
//         MEM: {mem.map((x:any)=>`${x.pod}:${x.bytes}`).join("  ") || "—"}
//       </div>
//     </div>
//   );
// }
// function Stat({k,v}:{k:string;v:any}) {
//   return (
//     <div className="p-3 bg-neutral-900 rounded-xl">
//       <div className="text-xs opacity-60">{k}</div>
//       <div className="text-lg">{v}</div>
//     </div>
//   );
// }
