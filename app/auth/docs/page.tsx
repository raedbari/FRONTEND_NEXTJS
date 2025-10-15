"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white px-6 py-16 relative overflow-hidden">
      {/* Neon background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1625] via-[#07111d] to-black -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_70%)] blur-3xl -z-10" />

      {/* Page content */}
      <section className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          📘 Smart DevOps Platform Documentation
        </h1>
        <p className="text-lg text-white/80 leading-relaxed">
          Smart DevOps is an intelligent cloud platform that simplifies application deployment and monitoring on Kubernetes clusters.  
          It is designed to be simple, fast, and secure, allowing users to perform DevOps operations without directly dealing with complex infrastructure.
        </p>

        <hr className="border-cyan-500/20 my-8" />

        {/* Documentation sections */}
        <div className="text-left space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">🚀 Deploy App Page</h2>
            <p className="text-white/80">
              This page allows you to create a new application inside the Kubernetes cluster.  
              <br />
              - **Name (k8s):** The application's name inside Kubernetes.  
              - **Image & Tag:** The Docker image name and the tag to use.  
              - **Port:** The port number the app runs on inside the container.  
              - **Replicas:** Number of copies (Pods) to be deployed.  
              - **Health Check Path:** Path used for health checking (e.g., `/healthz`).  
              - **Environment Variables:** Configuration such as API keys, URLs, etc.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">📊 App Status Page</h2>
            <p className="text-white/80">
              View all active applications within the cluster and monitor each deployment's state.  
              - Status  
              - Number of active Pods  
              - Health Check state  
              - Action buttons:  
                - **Restart App** to restart the deployment  
                - **Delete App** to remove the deployment  
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">🧠 Monitor Page</h2>
            <p className="text-white/80">
              Displays real-time charts and metrics from Prometheus and Grafana for CPU, RAM, and Network usage for each Pod inside the cluster.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">🔐 Login & Auth System</h2>
            <p className="text-white/80">
              - Login is done using a JWT token stored in localStorage.  
              - The system validates the token before accessing the dashboard.  
              - When the token expires, the user is automatically redirected to the Login page.
            </p>
          </div>
        </div>

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
