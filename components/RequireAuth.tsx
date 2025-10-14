"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/** تحويل Base64URL إلى JSON */
function decodeJwtPayload(token: string | null): any | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof window !== "undefined" ? atob(b64) : "";
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenValid(token: string | null, skewMs = 10_000): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  const expMs = Number(payload.exp) * 1000;
  if (Number.isNaN(expMs)) return false;
  return expMs > Date.now() + skewMs;
}

/** استخراج الدور والـNamespace وحالة التينانت إن وُجدت */
function readContext() {
  if (typeof window === "undefined") return { role: null as string | null, ns: null as string | null, status: null as string | null };
  const token = localStorage.getItem("token");
  const payload = decodeJwtPayload(token) || {};
  // مصدر ثانوي: localStorage.user (كما تفعل في بقية الصفحات)
  let status: string | null = null;
  let ns: string | null = null;
  try {
    const uRaw = localStorage.getItem("user");
    if (uRaw) {
      const u = JSON.parse(uRaw);
      status = u?.tenant?.status ?? status;
      ns = u?.tenant?.k8s_namespace ?? u?.tenant?.ns ?? ns;
    }
  } catch {}
  return {
    role: (payload.role as string) ?? null,
    ns: (payload.ns as string) ?? (payload.k8s_namespace as string) ?? ns ?? null,
    status: (payload.tenant_status as string) ?? status ?? null,
  };
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const adminRoute = useMemo(
    () => pathname?.startsWith("/dashboard/admin"),
    [pathname]
  );

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // 1) صلاحية التوكن
    if (!isTokenValid(token)) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tenant");
      } catch {}
      router.replace("/login");
      return;
    }

    // 2) التحقّق من حالة التينانت (pending => تحويل)
    const { role, status } = readContext();
    if (status && String(status).toLowerCase() === "pending") {
      router.replace("/pending");
      return;
    }

    // 3) منع الوصول للوحة الإدارة لغير platform_admin
    if (adminRoute && role !== "platform_admin") {
      router.replace("/dashboard/apps");
      return;
    }

    setReady(true);

    // 4) مزامنة الخروج عبر التبويبات
    function onStorage(e: StorageEvent) {
      if (e.key === "token" && !localStorage.getItem("token")) {
        router.replace("/login");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router, adminRoute]);

  // شاشة انتظار خفيفة بدل الفلاش
  if (!ready) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-white/70">
        <svg
          className="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Checking session…
      </div>
    );
  }

  return <>{children}</>;
}
