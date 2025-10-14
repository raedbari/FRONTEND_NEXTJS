// lib/adminClient.ts

export type PendingTenant = {
  id: number;
  name: string;
  email: string;
  k8s_namespace: string;
};

// اضبط BASE مرة واحدة
const BASE =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_API_BASE &&
  process.env.NEXT_PUBLIC_API_BASE.trim() !== ""
    ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, "")
    : "";

    

/** يرجع HeadersInit صالح دائمًا (بدون undefined) */
function buildHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}

export async function listPendingTenants(): Promise<PendingTenant[]> {
  const res = await fetch(`${BASE}/admin/tenants/pending`, {
    headers: buildHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function approveTenant(id: number) {
  const res = await fetch(`${BASE}/admin/tenants/${id}/approve`, {
    method: "POST",
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function rejectTenant(id: number, reason?: string) {
  const res = await fetch(`${BASE}/admin/tenants/${id}/reject`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
// lib/adminClient.ts

export type PendingTenant = {
  id: number;
  name: string;
  email: string;
  k8s_namespace: string;
};

// اضبط BASE مرة واحدة
const BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/+$/, "");

/** يرجع HeadersInit صالح دائمًا (بدون undefined) */
function buildHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}

export async function listPendingTenants(): Promise<PendingTenant[]> {
  const res = await fetch(`${BASE}/admin/tenants/pending`, {
    headers: buildHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function approveTenant(id: number) {
  const res = await fetch(`${BASE}/admin/tenants/${id}/approve`, {
    method: "POST",
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function rejectTenant(id: number, reason?: string) {
  const res = await fetch(`${BASE}/admin/tenants/${id}/reject`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
