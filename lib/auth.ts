
// lib/auth.ts
import { getApiBase } from "./api";

// ---- Login / Logout ----
export async function login(email: string, password: string) {
  const base = getApiBase();
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "omit",
  });

  if (!res.ok) {
    let msg = "Invalid email or password";
    try {
      const t = await res.text();
      if (t) msg = t;
    } catch {}
    throw new Error(msg);
  }

  const data: {
    access_token: string;
    user: { id: number; email: string; role: string };
    tenant: { id: number; name: string; k8s_namespace: string };
    expires_in: number;
    token_type: string;
  } = await res.json();

  localStorage.setItem("access_token", data.access_token);

  localStorage.setItem("token", data.access_token);

  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("tenant", JSON.stringify(data.tenant));
  localStorage.setItem("token_expires_in", String(data.expires_in || 0));

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token"); // legacy
  localStorage.removeItem("user");
  localStorage.removeItem("tenant");
  localStorage.removeItem("token_expires_in");
  window.location.href = "/login";
}

// ---- Getters ----
export function getToken(): string | null {

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

export function getUser<T = any>(): T | null {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as T) : null;
}

export function getTenant<T = any>(): T | null {
  const raw = localStorage.getItem("tenant");
  return raw ? (JSON.parse(raw) as T) : null;
}

export function getTenantNamespace(): string | null {
  const t = getTenant<{ k8s_namespace?: string }>();
  return t?.k8s_namespace ?? null;
}

export function isPlatformAdmin(): boolean {
  const u = getUser<{ role?: string }>();
  return (u?.role || "").toLowerCase() === "platform_admin";
}
