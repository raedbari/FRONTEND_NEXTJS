"use client";
import React from "react";
import PrepareModal from "./PrepareModal";
import PromoteModal from "./PromoteModal";
import RollbackModal from "./RollbackModal";
import { bgPromote, bgRollback } from "../apis/bluegreen";

type Props = {
  name?: string;       // ← اجعلها اختيارية لأن صفحة /bluegreen لا تمررها
  namespace?: string;  // ← كذلك
  image?: string;
  onChanged?: () => void;
};

export default function BlueGreenActions({
  name,
  namespace,
  image,
  onChanged,
}: Props) {
  const [openPrepare, setOpenPrepare]   = React.useState(false);
  const [openPromote, setOpenPromote]   = React.useState(false);
  const [openRollback, setOpenRollback] = React.useState(false);
  const [busy, setBusy] = React.useState<"promote"|"rollback"|null>(null);

  function parseImage(img?: string) {
    if (!img) return { repo: "", tag: "" };
    const idx = img.lastIndexOf(":");
    return idx === -1 ? { repo: img, tag: "" } : { repo: img.slice(0, idx), tag: img.slice(idx + 1) };
  }
  const { repo, tag } = parseImage(image);

  const hasNameNs = Boolean(name && namespace);

  async function doPromote() {
    if (!hasNameNs) { setOpenPromote(true); return; } // ← افتح مودال لو ناقصة
    try {
      setBusy("promote");
      await bgPromote(name!, namespace!);
      onChanged?.();
      alert("Promote done ✅");
    } catch (e:any) {
      alert("Promote failed: " + (e?.message || e));
    } finally { setBusy(null); }
  }

  async function doRollback() {
    if (!hasNameNs) { setOpenRollback(true); return; } // ← افتح مودال لو ناقصة
    try {
      setBusy("rollback");
      await bgRollback(name!, namespace!);
      onChanged?.();
      alert("Rollback done ✅");
    } catch (e:any) {
      alert("Rollback failed: " + (e?.message || e));
    } finally { setBusy(null); }
  }

  return (
    <div className="flex items-center gap-2">
      <button className="btn btn-sm" onClick={() => setOpenPrepare(true)}>Prepare</button>
      <button className="btn btn-sm" onClick={doPromote} disabled={busy!==null}>
        {busy==="promote" ? "…" : "Promote"}
      </button>
      <button className="btn btn-sm" onClick={doRollback} disabled={busy!==null}>
        {busy==="rollback" ? "…" : "Rollback"}
      </button>

      {openPrepare && (
        <PrepareModal
          onClose={() => setOpenPrepare(false)}
          initial={{ name: name ?? "", namespace: namespace ?? "project-env", image: repo, tag, port: 80, health_path:"/", replicas:1 }}
          afterSubmit={() => { setOpenPrepare(false); onChanged?.(); }}
        />
      )}

      {openPromote && (
        <PromoteModal
          onClose={() => setOpenPromote(false)}
          initial={{ name, namespace: namespace ?? "project-env" }}
          afterSubmit={() => { setOpenPromote(false); onChanged?.(); }}
        />
      )}

      {openRollback && (
        <RollbackModal
          onClose={() => setOpenRollback(false)}
          initial={{ name, namespace: namespace ?? "project-env" }}
          afterSubmit={() => { setOpenRollback(false); onChanged?.(); }}
        />
      )}
    </div>
  );
}
