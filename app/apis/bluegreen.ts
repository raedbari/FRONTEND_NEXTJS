// app/apis/bluegreen.ts
// الغرض: استدعاءات Blue/Green بدون تمرير namespace (يؤخذ من JWT في الباكند)

import { apiPost } from "@/lib/api";

// الحمولة القياسية
export type BGNamePayload = { name: string };

// دالة مساعدة لتوحيد الاستدعاء (ودعم الصيغة القديمة اختيارياً)
function normalizeNamePayload(
  arg1: BGNamePayload | string,
  _arg2?: string // namespace (مهمل عمداً لدعم التوافقية)
): BGNamePayload {
  if (typeof arg1 === "string") {
    return { name: arg1.trim() };
  }
  return { name: arg1.name.trim() };
}

/**
 * Promote preview -> production
 *
 * الاستخدام الموصى به:
 *   await bgPromote({ name: "my-app" });
 *
 * (توافقية اختيارية):
 *   await bgPromote("my-app", "ignored-namespace");
 */
export function bgPromote(arg1: BGNamePayload | string, _namespace?: string) {
  const payload = normalizeNamePayload(arg1, _namespace);
  return apiPost("/apps/bluegreen/promote", payload);
}

/**
 * Rollback to previous stable
 *
 * الاستخدام الموصى به:
 *   await bgRollback({ name: "my-app" });
 *
 * (توافقية اختيارية):
 *   await bgRollback("my-app", "ignored-namespace");
 */
export function bgRollback(arg1: BGNamePayload | string, _namespace?: string) {
  const payload = normalizeNamePayload(arg1, _namespace);
  return apiPost("/apps/bluegreen/rollback", payload);
}
