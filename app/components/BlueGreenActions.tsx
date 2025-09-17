// ==========================
// File: app/components/BlueGreenActions.tsx
// ==========================
"use client";
import React from "react";

import PrepareModal from "./PrepareModal";
// ملاحظة: لأن lib/ خارج مجلد app/ فالمسار النسبي من app/components هو ../../lib/api
import { bgPromote, bgRollback } from "../apis/bluegreen";

type Props = {
  name: string;
  namespace: string;
  /** Full image string from status row, e.g. "nginx:1.27" */
  image?: string;
  onChanged?: () => void;
};

export default function BlueGreenActions({
  name,
  namespace,
  image,
  onChanged,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<"promote" | "rollback" | null>(null);

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
      alert("Promote done ✅");
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
      alert("Rollback done ✅");
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
