// lib/api.ts
const SSR_FALLBACK = process.env.SSR_API_BASE
  ?? 'http://platform-api.default.svc.cluster.local:8000'; // يستدعي الـAPI داخل الكلاستر عند التنفيذ على الخادم

export function getApiBase(): string {
  // في المتصفح: استخدم مسار نسبي يمر عبر الـIngress/TLS
  if (typeof window !== 'undefined') return '/api';

  // في الخادم (SSR/Server Actions): خذ من المتغير العام إن وُجد، وإلا استخدم DNS الداخلي
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return fromEnv && fromEnv !== '' ? fromEnv : SSR_FALLBACK;
}

export async function apiGet(path: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAppsStatus() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/apps/status`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.json();
}
