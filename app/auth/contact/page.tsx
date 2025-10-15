"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ تم إرسال الرسالة بنجاح! (محاكاة فقط)");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white px-6 py-16 relative overflow-hidden">
      {/* خلفية نيون */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_70%)] blur-3xl -z-10" />

      {/* العنوان */}
      <section className="w-full max-w-lg bg-[#0b1728]/60 backdrop-blur-md border border-cyan-500/10 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.1)] p-8 text-center">
        <h1 className="text-3xl font-bold text-cyan-300 mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          📬 تواصل معنا
        </h1>
        <p className="text-white/70 mb-8">
          هل لديك استفسار أو اقتراح حول منصة Smart DevOps؟  
          ارسل لنا رسالة وسنقوم بالرد عليك في أقرب وقت ممكن.
        </p>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-white/70 mb-1">الاسم</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0f1f33]/80 border border-cyan-500/10 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0f1f33]/80 border border-cyan-500/10 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">الرسالة</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0f1f33]/80 border border-cyan-500/10 text-white focus:outline-none focus:border-cyan-400 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 transition-all shadow-[0_0_20px_rgba(0,255,255,0.25)]"
          >
            إرسال الرسالة
          </button>
        </form>
      </section>
    </main>
  );
}
