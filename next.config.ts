import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // لتجنب مشكلة lightningcss إذا رجعت:
  experimental: { optimizeCss: false },

  // 👇 تعطيل إيقاف البناء بسبب ESLint
  eslint: { ignoreDuringBuilds: true },

  // (اختياري) لو كان فيه أخطاء Typescript توقف البناء
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
