// ==========================
// File: app/components/BlueGreenActions.tsx
// ==========================
"use client";
import React from "react";

import PrepareModal from "./PrepareModal";

export default function BlueGreenActions({
  name,
  namespace,
  image,
  onChanged,
}: {
  name: string;
  namespace: string;
  /** Full image string from status row, e.g. "nginx:1.27" */
  image?: string;
  onChanged?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<string | null>(null);

  function parseImage(img?: string) {
    if (!img) return { repo: "", tag: "" };
    const idx = img.lastIndexOf(":");
    if (idx === -1) return { repo: img, tag: "" };
    return { repo: img.slice(0, idx), tag: img.slice(idx + 1) };
  }
  const { repo, tag } = parseImage(image);

  async function doPromote() {
    try {
      setBusy("promote");
      await bgPromote(name, namespace);
      onChanged?.();
    } catch (e) {
      console.error(e);
      alert("Promote failed: " + (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function doRollback() {
    try {
      setBusy("rollback");
      await bgRollback(name, namespace);
      onChanged?.();
    } catch (e) {
      console.error(e);
      alert("Rollback failed: " + (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-sm"
        onClick={() => setOpen(true)}
        title="Prepare a preview deployment"
      >
        Prepare
      </button>
      <button
        className="btn btn-sm"
        onClick={doPromote}
        disabled={busy !== null}
        title="Swap traffic to preview (zero-downtime)"
      >
        {busy === "promote" ? "…" : "Promote"}
      </button>
      <button
        className="btn btn-sm"
        onClick={doRollback}
        disabled={busy !== null}
        title="Instantly switch back to previous version"
      >
        {busy === "rollback" ? "…" : "Rollback"}
      </button>

      {open && (
        <PrepareModal
          onClose={() => setOpen(false)}
          initial={{
            name,
            namespace,
            image: repo,
            tag,
            port: 80,
            health_path: "/",
            replicas: 1,
          }}
          afterSubmit={() => {
            setOpen(false);
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}

// ==========================
// File: lib/api.ts
// ==========================
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function postJSON<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try { const j = await res.json(); msg = j.detail || JSON.stringify(j); } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function bgPrepare(spec: any) {
  return postJSON("/apps/bluegreen/prepare", spec);
}
export function bgPromote(name: string, namespace: string) {
  return postJSON("/apps/bluegreen/promote", { name, namespace });
}
export function bgRollback(name: string, namespace: string) {
  return postJSON("/apps/bluegreen/rollback", { name, namespace });
}

// ==========================
// Patch: app/page.tsx (status table) — add the new column & actions
// NOTE: Replace the cell where you render the Scale input with an extra cell to the right.
// Example snippet to integrate (pseudo around your existing map of items):
/*
  <th style={{textAlign:'left'}}>Blue/Green</th>
  ...
  {items.map((row) => (
    <tr key={row.name}>
      ...existing cells...
      <td>
        <BlueGreenActions
          name={row.name}
          namespace={selectedNamespace || 'default'}
          image={row.image}
          onChanged={refresh}
        />
      </td>
    </tr>
  ))}
*/

// ==========================
// Env: .env.local (frontend)
// ==========================
/*
NEXT_PUBLIC_API_BASE=http://the-phantoms.duckdns.org:30000
*/
