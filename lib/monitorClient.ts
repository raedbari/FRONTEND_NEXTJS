const API = process.env.NEXT_PUBLIC_API_BASE!;
async function j(u:string){ const r=await fetch(u,{cache:"no-store"}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export const listApps    = ()=> j(`${API}/monitor/apps`);
export const getOverview = (ns:string,app:string)=> j(`${API}/monitor/overview?ns=${ns}&app=${app}`);
export const getPods     = (ns:string,app:string)=> j(`${API}/monitor/pods?ns=${ns}&app=${app}`);
export const getLogs     = (ns:string,app:string,q="",since=900,limit=500)=> j(`${API}/monitor/logs?ns=${ns}&app=${app}&q=${encodeURIComponent(q)}&since=${since}&limit=${limit}`);
export const getEvents   = (ns:string,app:string,since=3600)=> j(`${API}/monitor/events?ns=${ns}&app=${app}&since=${since}`);
