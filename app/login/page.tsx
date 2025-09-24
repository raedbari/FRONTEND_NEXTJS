'use client';
import { useState } from 'react';
import { login } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const next = useSearchParams().get('next') || '/apps';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      router.replace(next);
    } catch (e: any) {
      setErr(e.message || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-2xl shadow">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <input className="w-full border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="w-full border p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button className="w-full p-2 rounded bg-blue-600 text-white">Login</button>
      </form>
    </main>
  );
}
