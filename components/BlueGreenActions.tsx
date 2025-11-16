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
  const [open, setOpen] = React.useState<"prepare" | "promote" | "rollback" | null>(null);
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
      setOpen("promote");
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
      setOpen("rollback");
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
    <div className="space-y-10">
      {/* 💬 Alerts */}
      {error && (
        <div className="border border-rose-800 bg-rose-900/30 text-rose-300 text-sm rounded-lg px-4 py-2 shadow-[0_0_8px_rgba(255,0,0,0.2)]">
          {error}
        </div>
      )}
      {notice && (
        <div className="border border-cyan-600/40 bg-cyan-900/20 text-cyan-300 text-sm rounded-lg px-4 py-2 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          {notice}
        </div>
      )}

      {/* ⚙️ زرار Prepare */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setOpen(open === "prepare" ? null : "prepare")}
          disabled={busy !== null}
          className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Prepare
        </button>

        {open === "prepare" && (
          <div className="w-full max-w-2xl">
            <PrepareModal
              onClose={() => setOpen(null)}
              initial={{
                name: name ?? "",
                image: repo,
                tag,
                port: 80,
                health_path: "/",
                replicas: 1,
              }}
              afterSubmit={() => {
                setOpen(null);
                setNotice("✅ Prepare submitted successfully");
                onChanged?.();
              }}
            />
          </div>
        )}
      </div>

      {/* ⚙️ زرار Promote */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setOpen(open === "promote" ? null : "promote")}
          disabled={busy !== null}
          className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r from-green-600 to-green-500 shadow-[0_0_15px_rgba(0,255,128,0.3)] hover:shadow-[0_0_25px_rgba(0,255,128,0.3)] hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy === "promote" ? (
            <span className="flex items-center gap-2">
              <Spinner /> Promoting…
            </span>
          ) : (
            "Promote"
          )}
        </button>

        {open === "promote" && (
          <div className="w-full max-w-2xl">
            <PromoteModal
              onClose={() => setOpen(null)}
              initial={{ name: "" }}
              afterSubmit={() => {
                setOpen(null);
                setNotice("✅ Promote submitted successfully");
                onChanged?.();
              }}
            />
          </div>
        )}
      </div>

      {/* ⚙️ زرار Rollback */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setOpen(open === "rollback" ? null : "rollback")}
          disabled={busy !== null}
          className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r from-rose-600 to-rose-500 shadow-[0_0_15px_rgba(255,64,100,0.3)] hover:shadow-[0_0_25px_rgba(255,64,100,0.3)] hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy === "rollback" ? (
            <span className="flex items-center gap-2">
              <Spinner /> Rolling back…
            </span>
          ) : (
            "Rollback"
          )}
        </button>

        {open === "rollback" && (
          <div className="w-full max-w-2xl">
            <RollbackModal
              onClose={() => setOpen(null)}
              initial={{ name: "" }}
              afterSubmit={() => {
                setOpen(null);
                setNotice("✅ Rollback submitted successfully");
                onChanged?.();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
