// 'use client';

// import React, { useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// export default function LoginClient() {
//   const params = useSearchParams();
//   const [username, setUsername] = useState('');   // <-- بدل email
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),   // <-- هنا username بدل email
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       // نجاح: إعادة التوجيه
//       // window.location.href = params.get('next') ?? '/';
//     } catch (e: any) {
//       setErr(e.message ?? 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{maxWidth: 360, margin: '64px auto', fontFamily: 'sans-serif'}}>
//       <h1>Login</h1>
//       <form onSubmit={onSubmit}>
//         <label>Username</label>
//         <input
//           type="text"                   // <-- text مش email
//           value={username}
//           onChange={e => setUsername(e.target.value)}
//           required
//           style={{display:'block', width:'100%', margin:'8px 0'}}
//         />
//         <label>Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//           style={{display:'block', width:'100%', margin:'8px 0'}}
//         />
//         <button disabled={loading} type="submit">
//           {loading ? 'Logging in…' : 'Login'}
//         </button>
//       </form>
//       {err && <p style={{color:'crimson'}}>{err}</p>}
//     </div>
//   );
// }
