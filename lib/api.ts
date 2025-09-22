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

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    // لا حاجة لأي منفذ أو بروتوكول هنا — المتصفح سيستعمل نفس الأصل عبر /api
    ...(init ?? {}),
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    body: JSON.stringify(body),
    ...(init ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
