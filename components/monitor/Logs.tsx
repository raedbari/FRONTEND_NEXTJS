// "use client";

// const USE_GRAFANA =
//   typeof process !== "undefined" &&
//   process.env.NEXT_PUBLIC_USE_GRAFANA_MONITORING === "true";

// const GRAFANA_BASE =
//   (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_BASE) || "/grafana";

// const GRAFANA_DASH =
//   (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GRAFANA_DASH_UID) ||
//   "app-observability";

// function grafanaExplore(ns: string, app: string) {
//   // يفتح Explore مباشرة على Loki مع المتغيرات
//   const params = new URLSearchParams({
//     left: JSON.stringify([
//       "now-1h", "now", "Loki",
//       { refId: "A", expr: `{namespace="${ns}",app="${app}"}` }
//     ])
//   });
//   return `${GRAFANA_BASE}/explore?${params.toString()}`;
// }

// type Props = { ns: string; app: string };

// export default function Logs({ ns, app }: Props) {
//   if (USE_GRAFANA) {
//     return (
//       <div className="rounded-2xl shadow p-4 space-y-2">
//         <div className="text-sm font-semibold">Logs (Loki)</div>
//         <a
//           className="btn btn-primary"
//           href={grafanaExplore(ns, app)}
//           target="_blank"
//           rel="noreferrer"
//         >
//           Open Logs in Grafana Explore
//         </a>
//       </div>
//     );
//   }

//   // ===== Legacy fallback =====
//   return <div className="rounded-2xl shadow p-4 text-sm opacity-70">legacy Logs…</div>;
// }
