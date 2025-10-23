"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("https://smartdevops.lat/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Failed to send");

    alert("✅ Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  } catch (err) {
    console.error(err);
    alert("❌ Failed to send message. Please try again.");
  }
};


  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white px-6 py-16 relative overflow-hidden">
      {/* Neon background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_70%)] blur-3xl -z-10" />

      {/* Title */}
      <section className="w-full max-w-lg bg-[#0b1728]/60 backdrop-blur-md border border-cyan-500/10 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.1)] p-8 text-center">
        <h1 className="text-3xl font-bold text-cyan-300 mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          📬 Contact Us
        </h1>
        <p className="text-white/70 mb-8">
          Do you have a question or suggestion about the Smart DevOps platform?  
          Send us a message and we will get back to you as soon as possible.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-white/70 mb-1">Name</label>
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
            <label className="block text-white/70 mb-1">Email</label>
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
            <label className="block text-white/70 mb-1">Message</label>
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
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
