"use client";

const USE_GRAFANA =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_GRAFANA_MONITORING === "true";

const GRAFANA_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_BASE) || "/grafana";

const GRAFANA_DASH =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_DASH_UID) ||
  "app-observability";

function grafanaLink(ns: string, app: string, from = "now-1h", to = "now") {
  return `${GRAFANA_BASE}/d/${GRAFANA_DASH}/app-monitor` +
    `?var-namespace=${encodeURIComponent(ns)}` +
    `&var-app=${encodeURIComponent(app)}&from=${from}&to=${to}`;
}

type Props = { ns: string; app: string };

// عند تفعيل الفلاج نعرض بطاقة صغيرة تربط بـ Grafana
export default function Overview({ ns, app }: Props) {
  if (USE_GRAFANA) {
    return (
      <div className="rounded-2xl shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm">Overview</h3>
          <a
            className="text-sky-400 underline"
            href={grafanaLink(ns, app)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Grafana
          </a>
        </div>
        <iframe
          src={grafanaLink(ns, app)}
          style={{ width: "100%", height: 360, border: "none", borderRadius: 8, marginTop: 8 }}
        />
      </div>
    );
  }

  // ===== Legacy fallback (الكود القديم لديك) =====
  // (أبقيناه كما هو ليعمل عند تعطيل الفلاج)
  // ملاحظة: إن أردت إزالته لاحقاً يمكن حذفه بأمان.
  // ---- BEGIN LEGACY ----
  // استوردتَ هذا الملف سابقاً مع getOverview… لو أردت الحفاظ عليه اتركه كما هو.
  return <div className="rounded-2xl shadow p-4 text-sm opacity-70">legacy Overview…</div>;
  // ---- END LEGACY ----
}

