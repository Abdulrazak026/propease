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

  const handleSave = () => alert("Settings saved! (Demo — no actual API keys configured)");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform configuration and API keys</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
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
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <Badge variant="default">{key.includes("SECRET") || key.includes("KEY") ? "🔒 Secret" : "🔓 Visible"}</Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={handleSave}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission Rates</h2>
          <p className="text-xs text-gray-400 mb-3">Configured on the Commissions page</p>
          <Button size="sm" variant="outline" onClick={() => alert("Navigating to commissions (demo)")}>
            Go to Commission Settings
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">JWT Secret Rotation</span>
              <Badge variant="success">Auto (90 days)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rate Limiting</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">HTTPS / HSTS</span>
              <Badge variant="success">Enforced</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Audit Logging</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
