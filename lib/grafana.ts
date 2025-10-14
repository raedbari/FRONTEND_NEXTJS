// lib/grafana.ts
export function grafanaDashboardUrl(namespace: string, appName: string) {
  // ✳️ استبدل هذا الرابط برابط الـ Grafana الحقيقي عندك
  const baseUrl = process.env.NEXT_PUBLIC_GRAFANA_BASE_URL || "https://grafana.example.com";

  // يمكنك تخصيص الداشبورد ID حسب نظامك، مثلاً appName أو namespace
  return `${baseUrl}/d/${namespace}-${appName}?orgId=1`;
}

// يمكنك إبقاء placeholder إن أردت، لكن export واحد فقط من كل نوع
export default grafanaDashboardUrl;
