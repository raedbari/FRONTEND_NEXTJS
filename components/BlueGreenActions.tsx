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
      className="animate-spin h-4 w-4 text-white"
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

      {/* ⚙️ Unified Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {[
          {
            label: "Prepare",
            onClick: () => setOpenPrepare(true),
            color: "from-cyan-500 to-cyan-400",
            glow: "rgba(0,255,255,0.3)",
          },
          {
            label: busy === "promote" ? "Promoting…" : "Promote",
            onClick: doPromote,
            color: "from-green-600 to-green-500",
            glow: "rgba(0,255,128,0.3)",
            spinner: busy === "promote",
          },
          {
            label: busy === "rollback" ? "Rolling back…" : "Rollback",
            onClick: doRollback,
            color: "from-rose-600 to-rose-500",
            glow: "rgba(255,64,100,0.3)",
            spinner: busy === "rollback",
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            disabled={busy !== null}
            className={`relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold 
              text-white transition-all duration-200
              bg-gradient-to-r ${btn.color}
              shadow-[0_0_20px_${btn.glow}]
              hover:shadow-[0_0_30px_${btn.glow}]
              hover:scale-[1.03]
              disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {btn.spinner && <Spinner />}
            {btn.label}
          </button>
        ))}
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
