// lib/grafana.ts
const GRAFANA_BASE =
  (process.env.NEXT_PUBLIC_GRAFANA_BASE || "/grafana").replace(/\/+$/, "");

const DASH_UID =
  process.env.NEXT_PUBLIC_GRAFANA_DASH_UID || "app-observability";

// slug اختياري (Grafana لا يعتمد عليه فعليًا)
const DASH_SLUG = "app-dashboard";

// نافذة الزمن الافتراضية
const DEFAULT_FROM = "now-15m";
const DEFAULT_TO = "now";

export function grafanaDashboardUrl(ns: string, app: string) {
  const params = new URLSearchParams({
    "var-namespace": ns,
    "var-app": app,
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    theme: "dark",
    kiosk: "tv", // اختياري: عرض أنظف
  });

  // /grafana/d/<uid>/<slug>?...
  return `${GRAFANA_BASE}/d/${encodeURIComponent(DASH_UID)}/${DASH_SLUG}?${params.toString()}`;
}

// رابط Explore للوجز (اختياري)
export function grafanaExploreLokiUrl(ns: string, app: string) {
  // ليست إلزامية؛ للمستقبل لو أردت زر "Logs"
  const left = {
    datasource: "Loki",
    queries: [{ expr: `{namespace="${ns}",app="${app}"}` }],
    range: { from: DEFAULT_FROM, to: DEFAULT_TO },
  };
  const params = new URLSearchParams({
    left: JSON.stringify(left),
    theme: "dark",
  });
  return `${GRAFANA_BASE}/explore?${params.toString()}`;
}
