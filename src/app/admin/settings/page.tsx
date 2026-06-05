"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const API_KEY_FIELDS = [
  { key: "GOOGLE_MAPS_API_KEY", label: "Google Maps API Key", secret: true },
  { key: "PAYSTACK_SECRET_KEY", label: "Paystack Secret Key", secret: true },
  { key: "PAYSTACK_PUBLIC_KEY", label: "Paystack Public Key", secret: false },
  { key: "MAILGUN_API_KEY", label: "Mailgun API Key", secret: true },
  { key: "MAILGUN_DOMAIN", label: "Mailgun Domain", secret: false },
  { key: "AWS_ACCESS_KEY_ID", label: "AWS Access Key (S3)", secret: true },
  { key: "AWS_SECRET_ACCESS_KEY", label: "AWS Secret Key (S3)", secret: true },
  { key: "AWS_S3_BUCKET", label: "S3 Bucket Name", secret: false },
  { key: "AWS_REGION", label: "AWS Region", secret: false },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api.get<{ settings: Record<string, string> }>("/api/admin/settings").then((r) => {
      if (r.data) setSettings(r.data.settings);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    const r = await api.put<{ success: boolean }>("/api/admin/settings", { settings });
    if (r.data?.success) setMsg({ type: "success", text: "Settings saved" });
    else setMsg({ type: "error", text: r.error || "Save failed" });
    setSaving(false);
    setTimeout(() => setMsg(null), 3000);
  };

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">API keys and integrations</p>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">API Keys & Integrations</h2>
        <p className="text-xs text-gray-400 mb-4">Keys are stored server-side and never exposed to clients.</p>
        <div className="space-y-3">
          {API_KEY_FIELDS.map(({ key, label, secret }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <div className="flex gap-2">
                <input
                  type={secret ? "password" : "text"}
                  value={settings[key] || ""}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder="Not set"
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
                <Badge variant="default">{secret ? "Secret" : "Public"}</Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission Rates</h2>
          <p className="text-xs text-gray-400 mb-3">Default rates applied to new deals.</p>
          <a href="/admin/commissions" className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Manage on Commissions Page
          </a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Security & Compliance</h2>
          <div className="space-y-3">
            {[
              { label: "JWT Access Tokens", status: "15-min expiry", variant: "success" as const },
              { label: "Refresh Tokens", status: "7-day, httpOnly", variant: "success" as const },
              { label: "Rate Limiting", status: "Active", variant: "success" as const },
              { label: "HTTPS / HSTS", status: "Enforced", variant: "success" as const },
              { label: "Audit Logging", status: "Active", variant: "success" as const },
              { label: "API Keys (this page)", status: "Server-side only", variant: "success" as const },
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
