"use client";

import RequireAuth from "@/components/RequireAuth";
import BlueGreenActions from "@/components/BlueGreenActions";

export default function BlueGreenPage() {
  return (
    <RequireAuth>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Blue / Green Deployments</h2>
          <p className="text-white/60 text-sm mt-1">
            Prepare a preview release, promote it to production, or rollback safely.
          </p>
        </div>

        {/* المكوّن المسؤول عن عمليات Blue/Green */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
          <BlueGreenActions />
        </div>
      </div>
    </RequireAuth>
  );
}
