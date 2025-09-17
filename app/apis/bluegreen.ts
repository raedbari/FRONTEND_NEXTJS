// app/apis/bluegreen.ts
import { apiPost } from "../../lib/api"; // أو "@/lib/api" لو عندك alias

export function bgPromote(name: string, namespace: string) {
  return apiPost("/apps/bluegreen/promote", { name, namespace });
}

export function bgRollback(name: string, namespace: string) {
  return apiPost("/apps/bluegreen/rollback", { name, namespace });
}

// (اختياري) لو أردت توحيد prepare هنا أيضًا:
// export function bgPrepare(spec: any) {
//   return apiPost("/apps/bluegreen/prepare", spec);
// }
