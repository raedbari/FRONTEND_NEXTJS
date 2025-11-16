// lib/api.ts

// ==========================
//  API Base URL Resolver
// ==========================
const SSR_FALLBACK =
  process.env.SSR_API_BASE ??
  "http://platform-api.default.svc.cluster.local:8000";

export function getApiBase(): string {
  // داخل المتصفح → استخدم /api (Ingress)
  if (typeof window !== "undefined") return "/api";

  // داخل سيرفر Next.js (SSR)
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return fromEnv && fromEnv !== "" ? fromEnv : SSR_FALLBACK;
}

// ==========================
//  Token & Auth Helpers
// ==========================

// استرجاع التوكن بالطريقة الحديثة ← access_token
function getToken(): string | null {
  if (typeof window === "undefined") return null;

  // المفتاح الجديد
  const modern = localStorage.getItem("access_token");
  if (modern) return modern;

  // توافقية مع الإصدارات القديمة
  return localStorage.getItem("token");
}

// إضافة Authorization Header
function withAuthHeaders(init?: RequestInit): RequestInit {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  return {
    ...init,
    headers,
    credentials: "omit",
  };
}

// ==========================
//  GET Wrapper
// ==========================
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

// ==========================
//  POST Wrapper  (الصحيح 100%)
// ==========================
export async function apiPost(path: string, body?: any) {
  const base = getApiBase();

  const res = await fetch(`${base}${path}`, withAuthHeaders({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }));

  if (res.status === 401 || res.status === 403) {
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// =========================
//  Domain APIs
// ==========================
export async function getAppsStatus() {
  return apiGet("/apps/status");
}
