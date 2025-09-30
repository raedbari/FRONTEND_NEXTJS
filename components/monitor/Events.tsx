"use client";

const USE_GRAFANA =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_GRAFANA_MONITORING === "true";

type Props = { ns: string; app: string };

export default function Events({ ns, app }: Props) {
  if (USE_GRAFANA) {
    // أحداث Kubernetes يمكن عرضها عبر Loki أيضاً إن كانت مُصدّرة كـ logs
    return (
      <div className="rounded-2xl shadow p-4 text-sm">
        <h3 className="mb-2">Events</h3>
        <p className="opacity-70">
          Kubernetes Events can be queried from Loki/Grafana (Explore) if they are shipped as logs.
        </p>
      </div>
    );
  }

  // ===== Legacy fallback =====
  return <div className="rounded-2xl shadow p-4 text-sm opacity-70">legacy Events…</div>;
}
