// export async function login(email: string, password: string) {
//   const res = await fetch(`/api/auth/login`, {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json(); // {token, tenant_id, role}
// }

// export async function me() {
//   const res = await fetch(`/api/auth/me`, { cache: 'no-store' });
//   if (!res.ok) return null;
//   return res.json();
// }

// export async function logout() {
//   await fetch(`/api/auth/logout`, { method: 'POST' });
// }
// lib/auth.ts
export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await res.json();
  // احفظ التوكن في localStorage
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("tenant", JSON.stringify(data.tenant));

  return data;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("tenant");
  window.location.href = "/login";
}
