// lib/api.ts

// Base URL resolution (browser vs server)
const SSR_FALLBACK =
  process.env.SSR_API_BASE ??
  "http://platform-api.default.svc.cluster.local:8000";

export function getApiBase(): string {
  // In the browser, go through Ingress/TLS with a relative path
  if (typeof window !== "undefined") return "/api";

  // On the server (SSR), prefer explicit env, else cluster DNS
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return fromEnv && fromEnv !== "" ? fromEnv : SSR_FALLBACK;
}

// --- Auth helpers (local only) ---
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  // Primary key we use now
  const modern = localStorage.getItem("access_token");
  if (modern) return modern;
  // Backward-compat: older builds stored "token"
  return localStorage.getItem("token");
}

// Merge headers safely
function withAuthHeaders(init?: RequestInit): RequestInit {
  const token = getToken();
  const hdrs: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (token) hdrs.Authorization = `Bearer ${token}`;
  return {
    ...init,
    headers: hdrs,
    // we don't use cookies; keep requests clean
    credentials: "omit",
  };
}

// ---- Generic GET/POST wrappers ----
export async function apiGet(path: string, init?: RequestInit) {
  const base = getApiBase();
  const res = await fetch(`${base}${path}`, withAuthHeaders(init));
  if (res.status === 401 || res.status === 403) {
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function apiPost(path: string, body?: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }
  return res.json();
}

// ---- Domain APIs ----
export async function getAppsStatus() {
  return apiGet("/apps/status");
}
