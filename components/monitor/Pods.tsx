// "use client";

// const USE_GRAFANA =
//   typeof process !== "undefined" &&
//   process.env.NEXT_PUBLIC_USE_GRAFANA_MONITORING === "true";

// type Props = { ns: string; app: string };

// export default function Pods({ ns, app }: Props) {
//   if (USE_GRAFANA) {
//     // في وضع Grafana لا نعرض جدول البودات هنا (متاح عبر لوحات/استكشاف)
//     return (
//       <div className="rounded-2xl shadow p-4 text-sm">
//         <h3 className="mb-2">Pods</h3>
//         <p className="opacity-70">Pods are available through Grafana panels and Explore.</p>
//       </div>
//     );
//   }

//   // ===== Legacy fallback =====
//   return <div className="rounded-2xl shadow p-4 text-sm opacity-70">legacy Pods…</div>;
// }
