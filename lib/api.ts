// lib/api.ts

// يبني عنوان الـAPI من نفس المضيف الحالي (DuckDNS أو الـIP) وعلى المنفذ 30000.
// يعمل على المتصفح. عند التنفيذ على السيرفر (SSR) يستخدم Fallback من متغير بيئة اختياري.
function getApiBase(): string {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;   // نفس الدومين/الـIP الذي فتحت به الواجهة
    return `${protocol}//${hostname}:30000`;
  }
  // Fallback أثناء SSR أو أثناء البناء المحلي
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
  return fromEnv ?? "http://127.0.0.1:30000";
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, { cache: "no-store", ...(init ?? {}) });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: JSON.stringify(body),
    ...(init ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
