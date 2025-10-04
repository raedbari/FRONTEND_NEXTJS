// app/monitor/[namespace]/[app]/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { grafanaDashboardUrl } from "@/lib/grafana";

type Params = { params: { namespace: string; app: string } };

export default function Page({ params }: Params) {
  const { namespace, app } = params;
  const router = useRouter();

  useEffect(() => {
    const url = grafanaDashboardUrl(namespace, app);
    // افتح تبويب جديد أو بدّل نفس الصفحة:
    window.location.href = url;
  }, [namespace, app, router]);

  return <div className="p-6 text-sm opacity-70">Redirecting to Grafana…</div>;
}
