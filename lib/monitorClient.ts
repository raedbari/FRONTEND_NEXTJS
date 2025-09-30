// const API = process.env.NEXT_PUBLIC_API_BASE!;
// async function j(u:string){ const r=await fetch(u,{cache:"no-store"}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
// export const listApps    = ()=> j(`${API}/monitor/apps`);
// export const getOverview = (ns:string,app:string)=> j(`${API}/monitor/overview?ns=${ns}&app=${app}`);
// export const getPods     = (ns:string,app:string)=> j(`${API}/monitor/pods?ns=${ns}&app=${app}`);
// export const getLogs     = (ns:string,app:string,q="",since=900,limit=500)=> j(`${API}/monitor/logs?ns=${ns}&app=${app}&q=${encodeURIComponent(q)}&since=${since}&limit=${limit}`);
// export const getEvents   = (ns:string,app:string,since=3600)=> j(`${API}/monitor/events?ns=${ns}&app=${app}&since=${since}`);


// lib/monitorClient.ts
// نقطة حقيقة واحدة لكل نداءات المراقبة من الواجهة.

const RAW = process.env.NEXT_PUBLIC_API_BASE;
const API = (RAW && RAW.trim() !== "" ? RAW : "/api").replace(/\/+$/, "");

async function j<T = any>(u: string): Promise<T> {
  const r = await fetch(u, { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<T>;
}

// Apps list (deployments summary)
export const listApps = () =>
  j(`${API}/monitor/apps`);

// Single app overview (replicas, cpu, mem, http)
export const getOverview = (ns: string, app: string) =>
  j(`${API}/monitor/overview?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}`);

// Pods of an app
export const getPods = (ns: string, app: string) =>
  j(`${API}/monitor/pods?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}`);

// Logs with optional query and window/limit
export const getLogs = (
  ns: string,
  app: string,
  q = "",
  since = 900,
  limit = 500
) =>
  j(
    `${API}/monitor/logs?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}${
      q ? `&q=${encodeURIComponent(q)}` : ""
    }&since=${since}&limit=${limit}`
  );

// K8s events (CoreV1) for app
export const getEvents = (ns: string, app: string, since = 3600) =>
  j(`${API}/monitor/events?ns=${encodeURIComponent(ns)}&app=${encodeURIComponent(app)}&since=${since}`);
