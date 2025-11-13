"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white px-6 py-16 relative overflow-hidden">
      {/* Neon background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_70%)] blur-3xl -z-10" />

      {/* Content */}
      <section className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          📘 Smart DevOps Platform Documentation
        </h1>

        <p className="text-lg text-white/80 leading-relaxed">
          This documentation explains how to use the Smart DevOps Platform correctly.
          It includes all rules, limitations, platform behaviors, and best practices
          for deploying and monitoring applications inside Kubernetes.
        </p>

        <hr className="border-cyan-500/20 my-8" />

        {/* Documentation Sections */}
        <div className="text-left space-y-10">

          {/* Deploy App Page */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              🚀 Deploy App Page — Deployment Rules
            </h2>
            <p className="text-white/80 leading-relaxed space-y-2">
              <strong>Use this page to deploy a new application inside Kubernetes.</strong>
              <br />Below are the required rules you must follow:
            </p>

            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-3">
              <li>
                <strong>App Name:</strong> must be lowercase, no spaces, no capital letters.  
                Allowed: <code>a-z 0-9 -</code>.  
                Must NOT start with a number.
              </li>
              <li>
                <strong>Image & Tag:</strong> Docker image name + version (example: <code>node:20</code>).
              </li>
              <li>
                <strong>Port Restriction:</strong>  
                You cannot deploy apps running on ports <strong>below 1024</strong>.  
                If you try, the platform will automatically change your port to  
                <strong className="text-cyan-300">8080</strong>.
              </li>
              <li>
                Your application MUST listen on the final assigned port inside the container
                (usually <strong>8080</strong>).
              </li>
              <li>
                <strong>Replicas:</strong> number of pods to run.
              </li>
              <li>
                <strong>Health Check Path:</strong> must exist and return HTTP 200.  
                Example: <code>/</code>.
              </li>
              <li>
                <strong>Environment Variables:</strong> key–value pairs (no spaces or special characters in key names).
              </li>
            </ul>

            <p className="text-white/70 mt-3">
              If any rule is broken, your deployment may fail or enter CrashLoopBackOff.
            </p>
          </div>

          {/* App Status Page */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              📊 App Status Page
            </h2>
            <p className="text-white/80 leading-relaxed">
              This page shows all running applications inside your namespace.
              You can view:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-2">
              <li>Status and health of your application</li>
              <li>Number of active Pods</li>
              <li>Health check state</li>
              <li>Restart count and error messages</li>
            </ul>

            <p className="text-white/80 mt-3">Available actions:</p>
            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-2">
              <li><strong>Restart App</strong> — recreates your Pods</li>
              <li><strong>Delete App</strong> — removes the deployment completely</li>
            </ul>
          </div>

          {/* Monitor Page */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              🧠 Monitor Page (Metrics)
            </h2>
            <p className="text-white/80 leading-relaxed">
              This page displays live metrics from Prometheus and Grafana:
            </p>

            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-2">
              <li>CPU usage for each Pod</li>
              <li>Memory consumption</li>
              <li>Network activity and traffic spikes</li>
            </ul>

            <p className="text-white/70 mt-2">
              If metrics do not appear, contact support or ensure your namespace dashboards are active.
            </p>
          </div>

          {/* Alerts System */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              🚨 Alerts System
            </h2>
            <p className="text-white/80 leading-relaxed">
              Prometheus alerts notify you when your application has issues.
              Alerts include:
            </p>

            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-2">
              <li>Pod failures</li>
              <li>CrashLoopBackOff</li>
              <li>High CPU usage</li>
              <li>High memory usage</li>
              <li>Pod stuck in Pending</li>
            </ul>

            <p className="text-white/70 mt-2">
              Alerts appear inside your dashboard and may also trigger email notifications.
            </p>
          </div>

          {/* Tenant Signup Rules */}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              👥 Tenant Signup Rules
            </h2>
            <p className="text-white/80 leading-relaxed">
              When creating a new account, your namespace must follow Kubernetes naming rules:
            </p>

            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-2">
              <li>Lowercase only — no uppercase allowed</li>
              <li>No spaces</li>
              <li>Allowed characters: <code>a-z 0-9 -</code></li>
              <li>Must NOT start with a number</li>
              <li>Minimum length: 3 characters</li>
            </ul>

            <p className="text-white/70 mt-2">
              These rules ensure your namespace is compatible with Kubernetes restrictions.
            </p>
          </div>

        </div>

        {/* Contact */}
        <div className="mt-10">
          <Link
            href="/auth/contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:from-cyan-500 hover:to-cyan-300 transition-all"
          >
            📩 Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
