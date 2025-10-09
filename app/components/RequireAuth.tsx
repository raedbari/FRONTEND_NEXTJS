"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// دالة بسيطة لفحص انتهاء صلاحية الـJWT
function isTokenValid(t?: string | null): boolean {
  if (!t) return false;
  const parts = t.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload?.exp) {
      const now = Date.now();
      const expMs = Number(payload.exp) * 1000;
      if (isNaN(expMs)) return false;
      return expMs > now;
    }
    // إذا لا يوجد exp نعتبره غير صالح
    return false;
  } catch {
    return false;
  }
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!isTokenValid(token)) {
      // إنتهاء/عدم وجود توكن → ارجع للّوغين
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
