// app/monitor/[namespace]/[app]/page.tsx
export const dynamic = "force-dynamic";

// ===== Grafana Integration (feature flag) =====
const USE_GRAFANA =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_GRAFANA_MONITORING === "true";

const GRAFANA_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_BASE) || "/grafana";

const GRAFANA_DASH =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_DASH_UID) ||
  "app-observability";

const grafanaLink = (ns: string, app: string, from = "now-1h", to = "now") =>
  `${GRAFANA_BASE}/d/${GRAFANA_DASH}/app-monitor` +
  `?var-namespace=${encodeURIComponent(ns)}` +
  `&var-app=${encodeURIComponent(app)}` +
  `&from=${from}&to=${to}`;

// ===== Legacy Components (fallback) =====
import Overview from "@/components/monitor/Overview";
import Charts   from "@/components/monitor/Charts";
import Logs     from "@/components/monitor/Logs";
import Pods     from "@/components/monitor/Pods";
import Events   from "@/components/monitor/Events";

type Params = { params: { namespace: string; app: string } };

export default function Page({ params }: Params) {
  const { namespace, app } = params;

  // إذا كان الفلاج مفعّل → نستخدم Grafana فقط
  if (USE_GRAFANA) {
    return (
      <section className="p-6 space-y-6">
        <h1 className="text-xl font-semibold">{namespace} / {app}</h1>
        <p>
          Monitoring powered by{" "}
          <a
            className="text-sky-400 underline"
            href={grafanaLink(namespace, app)}
            target="_blank"
            rel="noreferrer"
          >
            Grafana Dashboard
          </a>
        </p>
        <iframe
          src={grafanaLink(namespace, app)}
          style={{ width: "100%", height: "85vh", border: "none", borderRadius: 8 }}
        />
      </section>
    );
  }

  // ===== Legacy Monitoring (fallback) =====
  return (
    <section className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">{namespace} / {app}</h1>
      <Overview ns={namespace} app={app} />

      <div className="grid md:grid-cols-2 gap-6">
        <Charts ns={namespace} app={app} />
        <Logs   ns={namespace} app={app} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Pods   ns={namespace} app={app} />
        <Events ns={namespace} app={app} />
      </div>
    </section>
  );
}
