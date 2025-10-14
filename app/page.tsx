// app/page.tsx
"use client";

import { Badge, Button, Card } from "../components/ui";

export default function Home() {
  return (
    <section style={{ display: "grid", placeContent: "center", minHeight: "70vh" }}>
      <Card style={{ padding: 28, maxWidth: 920 }}>
        {/* أعلى البطاقة */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <Badge>raedbari</Badge>
          <Badge>ramibari</Badge>
        </div>

        {/* العنوان المتدرّج */}
        <h1 style={{ fontSize: 42, lineHeight: 1.15, margin: "10px 0 6px" }}>
          Welcome to our <span className="heading-gradient">Smart DevOps</span><br />
          <span className="heading-gradient">Deployment project</span>
        </h1>

        {/* سطر الوصف */}
        <p style={{ color: "var(--muted)" }}>
          Continuous Integration → Containerization → Orchestrated Delivery → Observability → Monitoring → Resilience Testing
        </p>

        {/* الشارات */}
        <div className="badges" style={{ marginTop: 16 }}>
          {["Terraform","Docker","Kubernetes","GitHub Actions","Prometheus","Grafana","Loki","Ansible","Chaos Mesh"].map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        {/* فوتر بسيط */}
        <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 13 }}>
          Deployed via Kubernetes • Listening on port 3000
        </p>

        {/* الأزرار */}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button onClick={() => (window.location.href = "/apps/new")}>Deploy App</Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/apps")}>View Apps Status</Button>
        </div>
      </Card>
    </section>
  );
}
