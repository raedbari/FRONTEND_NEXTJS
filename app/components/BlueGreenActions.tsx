// app/components/BlueGreenActions.tsx
"use client";

import React from "react";
import PrepareModal from "./PrepareModal";
import { apiPost } from "@/lib/api";

type Props = {
  name: string;
  namespace: string;
  image?: string;            // من صف الحالة (اختياري)
  onChanged?: () => void;    // ننعش الجدول بعد النجاح
};

export default function BlueGreenActions({
  name,
  namespace,
  image,
  onChanged,
}: Props) {
  const [openPrepare, setOpenPrepare] = React.useState(false);
  const [busy, setBusy] = React.useState<null | "promote" | "rollback">(null);

  async function doPromote() {
    try {
      setBusy("promote");
      await apiPost("/apps/bluegreen/promote", { name, namespace });
      onChanged?.();
      alert("Promote done ✅");
    } catch (e: any) {
      alert(`Promote failed: ${e?.message || e}`);
    } finally {
      setBusy(null);
    }
  }

  async function doRollback() {
    try {
      setBusy("rollback");
      await apiPost("/apps/bluegreen/rollback", { name, namespace });
      onChanged?.();
      alert("Rollback done ✅");
    } catch (e: any) {
      alert(`Rollback failed: ${e?.message || e}`);
    } finally {
      setBusy(null);
    }
  }

  // استخراج repo/tag بشكل بسيط من image القادمة من الجدول
  function parseImage(img?: string) {
    if (!img) return { repo: "", tag: "" };
    const idx = img.lastIndexOf(":");
    if (idx === -1) return { repo: img, tag: "" };
    return { repo: img.slice(0, idx), tag: img.slice(idx + 1) };
  }
  const { repo, tag } = parseImage(image);

  return (
    <div className="flex items-center gap-2">
      {/* Prepare */}
      <button
        className="btn btn-sm"
        onClick={() => setOpenPrepare(true)}
        title="Prepare a preview deployment"
      >
        Prepare
      </button>

      {/* Promote */}
      <button
        className="btn btn-sm"
        onClick={doPromote}
        disabled={busy !== null}
        title="Swap traffic to preview (zero-downtime)"
      >
        {busy === "promote" ? "…" : "Promote"}
      </button>

      {/* Rollback */}
      <button
        className="btn btn-sm"
        onClick={doRollback}
        disabled={busy !== null}
        title="Instantly switch back to previous version"
      >
        {busy === "rollback" ? "…" : "Rollback"}
      </button>

      {openPrepare && (
        <PrepareModal
          onClose={() => setOpenPrepare(false)}
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
            setOpenPrepare(false);
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}
