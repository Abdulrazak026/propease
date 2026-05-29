"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AdminSettings() {
  const [envVars, setEnvVars] = useState({
    GOOGLE_MAPS_API_KEY: "AIzaSyDemoKey123456789",
    PAYSTACK_PUBLIC_KEY: "pk_live_demo_xxxxxxxxx",
    PAYSTACK_SECRET_KEY: "sk_live_demo_xxxxxxxxx",
    CLOUDFLARE_R2_ENDPOINT: "https://demo.r2.cloudflarestorage.com",
    CLOUDFLARE_R2_BUCKET: "propease-demo",
    SUPABASE_URL: "https://demo.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showListings, setShowListings] = useState(true);
  const [showCustomOrder, setShowCustomOrder] = useState(true);
  const [featuredListing, setFeaturedListing] = useState("l1");

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">System-wide configuration</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Preview & Frontend</h2>
        <p className="text-xs text-gray-400 mb-4">Control how the public site behaves. Preview changes before they go live.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Preview Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">When enabled, only admins/heads see live content. Public sees a preview banner.</p>
            </div>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`relative w-11 h-6 rounded-full transition-colors ${previewMode ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${previewMode ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Shows a maintenance page to visitors. Staff can still access dashboards.</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-11 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-red-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${maintenanceMode ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Listings on Homepage</p>
              <p className="text-xs text-gray-500 mt-0.5">Toggle the public property grid on/off.</p>
            </div>
            <button
              onClick={() => setShowListings(!showListings)}
              className={`relative w-11 h-6 rounded-full transition-colors ${showListings ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showListings ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Custom Order Form</p>
              <p className="text-xs text-gray-500 mt-0.5">Enable or disable the /custom-order page.</p>
            </div>
            <button
              onClick={() => setShowCustomOrder(!showCustomOrder)}
              className={`relative w-11 h-6 rounded-full transition-colors ${showCustomOrder ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showCustomOrder ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Featured Listing (homepage hero)</label>
            <select
              value={featuredListing}
              onChange={(e) => setFeaturedListing(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            >
              <option value="l1">3-Bedroom Flat — Kano Municipal</option>
              <option value="l2">Land Plot — Fagge</option>
              <option value="l3">Commercial Shop — Tarauni</option>
              <option value="l4">5-Bedroom Duplex — Nassarawa</option>
            </select>
          </div>
        </div>
        <Button className="mt-4" onClick={() => alert("Preview settings saved! (Demo)")}>Save Preview Settings</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">API Keys & Integrations</h2>
        <p className="text-xs text-gray-400 mb-4">
          Stored as environment variables. Never exposed to clients.
        </p>
        <div className="space-y-3">
          {Object.entries(envVars).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{key}</label>
              <div className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) => setEnvVars({ ...envVars, [key]: e.target.value })}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
                <Badge variant="default">{key.includes("SECRET") || key.includes("KEY") ? "Secret" : "Visible"}</Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => alert("Settings saved! (Demo)")}>Save All Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission Rates</h2>
          <p className="text-xs text-gray-400 mb-3">Default rates applied to new deals. Can be overridden per deal.</p>
          <Button size="sm" variant="outline" onClick={() => alert("Navigating to commissions (Demo)")}>
            Manage on Commissions Page
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Security & Compliance</h2>
          <div className="space-y-3">
            {[
              { label: "JWT Secret Rotation", status: "Auto (90 days)", variant: "success" as const },
              { label: "Rate Limiting", status: "Active", variant: "success" as const },
              { label: "HTTPS / HSTS", status: "Enforced", variant: "success" as const },
              { label: "Audit Logging", status: "Active", variant: "success" as const },
              { label: "2FA for Admins", status: "Not Enabled", variant: "warning" as const },
              { label: "Data Export", status: "Available", variant: "success" as const },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-600">{item.label}</span>
                <Badge variant={item.variant}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Danger Zone</h2>
        <p className="text-xs text-gray-400 mb-4">Irreversible actions. Proceed with caution.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => alert("Demo — no actual action taken")}>Disable Platform</Button>
          <Button variant="outline" onClick={() => alert("Demo — no actual action taken")}>Export All Data</Button>
        </div>
      </div>
    </div>
  );
}
