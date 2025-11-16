// app/apis/bluegreen.ts

import { apiPost } from "@/lib/api";

// الحمولة القياسية
export type BGNamePayload = { name: string };

function normalizeNamePayload(
  arg1: BGNamePayload | string,
  _arg2?: string // namespace (مهمل عمداً لدعم التوافقية)
): BGNamePayload {
  if (typeof arg1 === "string") {
    return { name: arg1.trim() };
  }
  return { name: arg1.name.trim() };
}

export function bgPromote(arg1: BGNamePayload | string, _namespace?: string) {
  const payload = normalizeNamePayload(arg1, _namespace);
  return apiPost("/apps/bluegreen/promote", payload);
}
export function bgRollback(arg1: BGNamePayload | string, _namespace?: string) {
  const payload = normalizeNamePayload(arg1, _namespace);
  return apiPost("/apps/bluegreen/rollback", payload);
}
