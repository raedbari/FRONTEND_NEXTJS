"use client";
import React from "react";
import PrepareModal from "./PrepareModal";
import PromoteModal from "./PromoteModal";
import RollbackModal from "./RollbackModal";
import { bgPromote, bgRollback } from "@/apis/bluegreen";

type Props = {
  name?: string;
  image?: string;
  onChanged?: () => void;
};

export default function BlueGreenActions({ name, image, onChanged }: Props) {
  const [openPrepare, setOpenPrepare] = React.useState(false);
  const [openPromote, setOpenPromote] = React.useState(false);
  const [openRollback, setOpenRollback] = React.useState(false);

  const [busy, setBusy] = React.useState<"promote" | "rollback" | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-cyan-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  function parseImage(img?: string) {
    if (!img) return { repo: "", tag: "" };
    const idx = img.lastIndexOf(":");
    return idx === -1
      ? { repo: img, tag: "" }
      : { repo: img.slice(0, idx), tag: img.slice(idx + 1) };
  }
  const { repo, tag } = parseImage(image);

  async function doPromote() {
    if (!name) {
      setOpenPromote(true);
      return;
    }
    try {
      setBusy("promote");
      setError(null);
      setNotice(null);
      await bgPromote({ name });
      setNotice("✅ Promote completed successfully");
      onChanged?.();
    } catch (e: any) {
      setError("❌ Promote failed: " + (e?.message || String(e)));
    } finally {
      setBusy(null);
    }
  }

  async function doRollback() {
    if (!name) {
      setOpenRollback(true);
      return;
    }
    try {
      setBusy("rollback");
      setError(null);
      setNotice(null);
      await bgRollback({ name });
      setNotice("✅ Rollback completed successfully");
      onChanged?.();
    } catch (e: any) {
      setError("❌ Rollback failed: " + (e?.message || String(e)));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* 💬 Alerts */}
      {error && (
        <div className="border border-rose-800 bg-rose-900/30 text-rose-300 text-sm rounded-lg px-4 py-2 shadow-[0_0_12px_rgba(255,0,0,0.2)]">
          {error}
        </div>
      )}
      {notice && (
        <div className="border border-cyan-600/40 bg-cyan-900/20 text-cyan-300 text-sm rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          {notice}
        </div>
      )}

      {/* ⚙️ Actions */}
      <div className="flex flex-wrap items-center gap-3 justify-center">
        {/* Prepare */}
        <button
          onClick={() => setOpenPrepare(true)}
          disabled={busy !== null}
          title="Prepare preview release"
          className="px-5 py-2 rounded-xl border border-cyan-400/30 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-200 shadow-[0_0_10px_rgba(0,255,255,0.1)] font-medium"
        >
          Prepare
        </button>

        {/* Promote */}
        <button
          onClick={doPromote}
          disabled={busy !== null}
          title="Promote preview to production"
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
            busy === "promote"
              ? "bg-cyan-700/60 cursor-not-allowed text-white/70"
              : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]"
          }`}
        >
          {busy === "promote" && <Spinner />}
          {busy === "promote" ? "Promoting…" : "Promote"}
        </button>

        {/* Rollback */}
        <button
          onClick={doRollback}
          disabled={busy !== null}
          title="Rollback to previous stable"
          className="px-5 py-2 rounded-xl border border-rose-500/40 text-rose-300 hover:border-rose-400 hover:text-white hover:bg-rose-500/10 transition-all duration-200 shadow-[0_0_10px_rgba(255,0,100,0.2)] font-medium flex items-center gap-2"
        >
          {busy === "rollback" && <Spinner />}
          {busy === "rollback" ? "Rolling back…" : "Rollback"}
        </button>
      </div>

      {/* 📦 Modals */}
      {openPrepare && (
        <PrepareModal
          onClose={() => setOpenPrepare(false)}
          initial={{
            name: name ?? "",
            image: repo,
            tag,
            port: 80,
            health_path: "/",
            replicas: 1,
          }}
          afterSubmit={() => {
            setOpenPrepare(false);
            setNotice("✅ Prepare submitted successfully");
            onChanged?.();
          }}
        />
      )}

      {openPromote && (
        <PromoteModal
          onClose={() => setOpenPromote(false)}
          initial={{ name: "" }}
          afterSubmit={() => {
            setOpenPromote(false);
            setNotice("✅ Promote submitted successfully");
            onChanged?.();
          }}
        />
      )}

      {openRollback && (
        <RollbackModal
          onClose={() => setOpenRollback(false)}
          initial={{ name: "" }}
          afterSubmit={() => {
            setOpenRollback(false);
            setNotice("✅ Rollback submitted successfully");
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}
