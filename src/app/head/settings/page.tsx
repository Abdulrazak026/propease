"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function HeadSettings() {
  const [envVars, setEnvVars] = useState({
    GOOGLE_MAPS_API_KEY: "AIzaSyDemoKey123456789",
    PAYSTACK_PUBLIC_KEY: "pk_live_demo_xxxxxxxxx",
    PAYSTACK_SECRET_KEY: "sk_live_demo_xxxxxxxxx",
    CLOUDFLARE_R2_ENDPOINT: "https://demo.r2.cloudflarestorage.com",
    CLOUDFLARE_R2_BUCKET: "propease-demo",
    SUPABASE_URL: "https://demo.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo",
  });

  const handleSave = () => alert("Settings saved! (Demo)");

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform configuration and API keys</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">API Keys & Environment</h2>
        <p className="text-xs text-gray-400 mb-4">
          These values are stored as environment variables and never exposed to the client.
        </p>
        <div className="space-y-3">
          {Object.entries(envVars).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
              <div className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) => setEnvVars({ ...envVars, [key]: e.target.value })}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
                <Badge variant="default">{key.includes("SECRET") || key.includes("KEY") ? "Secret" : "Visible"}</Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={handleSave}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission Rates</h2>
          <p className="text-xs text-gray-400 mb-3">Configured on the Commissions page</p>
          <Button size="sm" variant="outline" onClick={() => alert("Navigating to commissions (demo)")}>
            Go to Commission Settings
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-3">
            {[
              { label: "JWT Secret Rotation", status: "Auto (90 days)", variant: "success" as const },
              { label: "Rate Limiting", status: "Active", variant: "success" as const },
              { label: "HTTPS / HSTS", status: "Enforced", variant: "success" as const },
              { label: "Audit Logging", status: "Active", variant: "success" as const },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-600">{item.label}</span>
                <Badge variant={item.variant}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
