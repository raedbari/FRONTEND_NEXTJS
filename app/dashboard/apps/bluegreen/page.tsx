"use client";
import React, { useState } from "react";
import PrepareModal from "./PrepareModal";
import PromoteModal from "./PromoteModal";
import RollbackModal from "./RollbackModal";

export default function BlueGreenPage() {
  const [activeModal, setActiveModal] = useState<null | "prepare" | "promote" | "rollback">(null);

  return (
    <div className="relative z-0">
      {/* الأزرار */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveModal("prepare")}
          className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow"
        >
          Prepare
        </button>
        <button
          onClick={() => setActiveModal("promote")}
          className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow"
        >
          Promote
        </button>
        <button
          onClick={() => setActiveModal("rollback")}
          className="px-5 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg shadow"
        >
          Rollback
        </button>
      </div>

      {/* نافذة واحدة فقط حسب الحالة */}
      {activeModal === "prepare" && (
        <PrepareModal
          initial={{
            name: "",
            image: "",
            tag: "",
            port: 80,
            health_path: "/",
            replicas: 1,
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "promote" && (
        <PromoteModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "rollback" && (
        <RollbackModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
