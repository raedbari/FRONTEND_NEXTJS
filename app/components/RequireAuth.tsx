"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function base64UrlToJson(b64url: string) {
  // تحويل Base64URL إلى Base64 عادي
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(b64);
  return JSON.parse(json);
}

function isTokenValid(t: string | null): boolean {
  if (!t) return false;
  try {
    const parts = t.split(".");
    if (parts.length !== 3) return false;

    const payload = base64UrlToJson(parts[1]);
    if (!payload?.exp) return false;

    const nowMs = Date.now();
    const expMs = Number(payload.exp) * 1000;
    if (Number.isNaN(expMs)) return false;

    // اختياري: سكيّو بسيط لتفاوت الساعة (10 ثواني)
    return expMs > nowMs + 10_000;
  } catch {
    return false;
  }
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!isTokenValid(token)) {
      // نظّف أي بقايا، ثم حوّل
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tenant");
      } catch {}
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  // أثناء التحقق/التحويل ما نعرض أي شيء لتجنب الـflash
  if (!ready) return null;
  return <>{children}</>;
}
