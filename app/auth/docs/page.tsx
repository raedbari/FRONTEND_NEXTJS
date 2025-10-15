"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white px-6 py-16 relative overflow-hidden">
      {/* خلفية نيون */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_70%)] blur-3xl -z-10" />

      {/* محتوى الصفحة */}
      <section className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          📘 Smart DevOps Platform Documentation
        </h1>
        <p className="text-lg text-white/80 leading-relaxed">
          Smart DevOps هي منصة سحابية ذكية لتسهيل نشر ومراقبة التطبيقات على Kubernetes Cluster.  
          تم تصميمها لتكون بسيطة، سريعة، وآمنة، بحيث يمكن للمستخدمين تنفيذ عمليات DevOps بدون الحاجة للتعامل المباشر مع تعقيدات البنية التحتية.
        </p>

        <hr className="border-cyan-500/20 my-8" />

        {/* أقسام التوثيق */}
        <div className="text-left space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">🚀 صفحة Deploy App</h2>
            <p className="text-white/80">
              هذه الصفحة تتيح لك إنشاء تطبيق جديد داخل Kubernetes Cluster.  
              <br />
              - **Name (k8s):** اسم التطبيق داخل Kubernetes.  
              - **Image & Tag:** اسم الصورة من Docker Hub مع التاج المراد استخدامه.  
              - **Port:** رقم المنفذ الذي يعمل عليه التطبيق داخل الحاوية.  
              - **Replicas:** عدد النسخ (Pods) التي سيتم تشغيلها.  
              - **Health Check Path:** مسار التحقق من صحة التطبيق (مثلاً `/healthz`).  
              - **Environment Variables:** متغيرات البيئة (API keys, URLs, Config...).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">📊 صفحة App Status</h2>
            <p className="text-white/80">
              يمكنك من خلالها عرض جميع التطبيقات النشطة داخل Cluster ومتابعة حالة كل Deployment.  
              - الحالة (Status)  
              - عدد Pods النشطة  
              - حالة Health Check  
              - الأزرار:  
                - **Restart App** لإعادة التشغيل  
                - **Delete App** لحذف Deployment  
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">🧠 صفحة Monitor</h2>
            <p className="text-white/80">
              تعرض الرسوم البيانية والبيانات اللحظية من Prometheus و Grafana حول استخدام CPU، RAM و Network لكل Pod داخل Cluster.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">🔐 نظام Login و Auth</h2>
            <p className="text-white/80">
              - يتم تسجيل الدخول عبر JWT Token يُخزَّن في localStorage.  
              - النظام يتحقق من صلاحيته قبل الدخول إلى لوحة التحكم (Dashboard).  
              - عند انتهاء Token يتم إعادة توجيه المستخدم تلقائيًا إلى صفحة Login.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/auth/contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:from-cyan-500 hover:to-cyan-300 transition-all"
          >
            📩 تواصل معنا
          </Link>
        </div>
      </section>
    </main>
  );
}
