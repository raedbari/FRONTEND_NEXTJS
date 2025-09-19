// lib/api.ts

// يبني عنوان الـAPI من نفس المضيف الحالي (DuckDNS أو الـIP) وعلى المنفذ 30000
// يعمل في المتصفح؛ أثناء SSR/البناء نستخدم Fallback من متغير بيئة اختياري.
function getApiBase(): string {
  if (typeof window !== "undefined") {
    // يبني العنوان على أساس نفس الـhost اللي فتحت منه الموقع
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:30000`;
  }
  // fallback وقت الـSSR أو الـbuild
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
  return fromEnv ?? "http://127.0.0.1:30000";
}


export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    cache: "no-store",
    credentials: "omit",                    // مهم لتفادي CORS
    ...(init ?? {}),
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "omit",                    // مهم لتفادي CORS
    body: JSON.stringify(body),
    cache: "no-store",
    ...init,
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
