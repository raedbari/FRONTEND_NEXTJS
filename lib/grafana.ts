// lib/grafana.ts
export function grafanaDashboardUrl(namespace: string, appName: string) {

  const baseUrl = process.env.NEXT_PUBLIC_GRAFANA_BASE_URL || "https://grafana.example.com";


  return `${baseUrl}/d/${namespace}-${appName}?orgId=1`;
}


export default grafanaDashboardUrl;
