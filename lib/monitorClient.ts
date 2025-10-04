// const API = process.env.NEXT_PUBLIC_API_BASE!;
// async function j(u:string){ const r=await fetch(u,{cache:"no-store"}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
// export const listApps    = ()=> j(`${API}/monitor/apps`);
// export const getOverview = (ns:string,app:string)=> j(`${API}/monitor/overview?ns=${ns}&app=${app}`);
// export const getPods     = (ns:string,app:string)=> j(`${API}/monitor/pods?ns=${ns}&app=${app}`);
// export const getLogs     = (ns:string,app:string,q="",since=900,limit=500)=> j(`${API}/monitor/logs?ns=${ns}&app=${app}&q=${encodeURIComponent(q)}&since=${since}&limit=${limit}`);
// export const getEvents   = (ns:string,app:string,since=3600)=> j(`${API}/monitor/events?ns=${ns}&app=${app}&since=${since}`);

// const API = process.env.NEXT_PUBLIC_API_BASE!;
// async function j(u: string){ const r=await fetch(u,{cache:"no-store"}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
// export const listApps      = ()=> j(`${API}/monitor/apps`);
// export const getOverview   = (ns:string,app:string)=> j(`${API}/monitor/overview?ns=${ns}&app=${app}`);
// export const getPods       = (ns:string,app:string)=> j(`${API}/monitor/pods?ns=${ns}&app=${app}`);
// export const getLogs       = (ns:string,app:string,q="",since=900,limit=500)=> j(`${API}/monitor/logs?ns=${ns}&app=${app}&q=${encodeURIComponent(q)}&since=${since}&limit=${limit}`);
// export const getEvents     = (ns:string,app:string,since=3600)=> j(`${API}/monitor/events?ns=${ns}&app=${app}&since=${since}`);


// lib/monitorClient.ts
// نقطة حقيقة واحدة لكل نداءات المراقبة من الواجهة.

// lib/monitorClient.ts
const RAW = process.env.NEXT_PUBLIC_API_BASE;
const API = (RAW && RAW.trim() !== "" ? RAW : "/api").replace(/\/+$/, "");

async function j<T = any>(u: string): Promise<T> {
  const r = await fetch(u, { cache: "no-store" });
  if (!r.ok) {
    // لا تسرب HTML 500 للـUI
    const text = await r.text().catch(()=>"");
    throw new Error(text || `HTTP ${r.status}`);
  }
  return r.json() as Promise<T>;
}

// قبل: كانت تضرب /monitor/apps
export async function listApps() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "/api";
  const res = await fetch(`${base}/apps/status`, { cache: "no-store" });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  // backend يرجّع { items: StatusItem[] }
  return json.items as any[];
}

export const getOverview= (ns:string,app:string) =>
  j(`${API}/monitor/overview?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}`);
export const getPods    = (ns:string,app:string) =>
  j(`${API}/monitor/pods?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}`);
export const getLogs    = (ns:string,app:string,q="",since=900,limit=500) =>
  j(`${API}/monitor/logs?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}${q?`&q=${encodeURIComponent(q)}`:""}&since=${since}&limit=${limit}`);
export const getEvents  = (ns:string,app:string,since=3600) =>
  j(`${API}/monitor/events?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}&since=${since}`);
