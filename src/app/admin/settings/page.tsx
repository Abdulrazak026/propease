"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type SettingsMap = Record<string, string>;

const TABS = [
  "General", "SEO", "Legal", "Properties",
  "CRM & Leads", "Integrations", "Users & Agents",
  "Appearance", "System",
] as const;

type Tab = (typeof TABS)[number];

function getDefaultSettings(): SettingsMap {
  return {
    site_name: "MBPP",
    site_tagline: "Find Your Dream Property in Kano",
    support_email: "support@mbpproperties.com",
    support_phone: "0800 000 0000",
    support_whatsapp: "0800 000 0000",
    office_address: "Kano Municipal, Kano State, Nigeria",
    business_hours: "Mon–Fri 8:00 AM – 6:00 PM | Sat 9:00 AM – 2:00 PM",
    meta_title: "MBPP — Real Estate Marketplace, Kano",
    meta_description: "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria. Your trusted real estate marketplace.",
    og_image: "",
    google_analytics_id: "",
    google_tag_manager_id: "",
    facebook_pixel_id: "",
    robots_txt: "",
    terms_of_service: "",
    privacy_policy: "",
    cookie_consent_enabled: "true",
    cookie_consent_text: "We use cookies to improve your experience. By continuing, you agree to our privacy policy.",
    lead_form_disclaimer: "By submitting this form, you agree to our Terms of Service and Privacy Policy.",
    measurement_unit: "sqft",
    currency: "NGN",
    currency_position: "left",
    thousands_separator: ",",
    decimal_separator: ".",
    property_statuses: "For Sale,For Rent,Sold,Pending,Under Contract",
    property_types: "Apartment,Villa,Commercial,Land,Shop,Warehouse",
    amenities_list: "Pool,Gym,Security,Parking,Borehole,Solar,Furnished,Serviced Quarter,CCTV,Gated Estate",
    lead_routing: "listing_agent",
    lead_statuses: "New,Contacted,Scheduled,Offer Made,Closed,Lost",
    auto_responder_enabled: "true",
    agent_notify_email: "true",
    agent_notify_sms: "false",
    google_maps_api_key: "",
    resend_api_key: "",
    smtp_host: "",
    smtp_port: "",
    smtp_user: "",
    smtp_pass: "",
    smtp_encryption: "tls",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    twitter_url: "",
    agent_directory_visible: "true",
    default_commission_rate: "5",
    brand_primary_color: "#0d6e4e",
    brand_secondary_color: "#f97316",
    brand_accent_color: "#facc15",
    heading_font: "Inter",
    body_font: "Inter",
    hero_bg_image: "",
    hero_bg_video: "",
    custom_css: "",
    custom_js_header: "",
    custom_js_footer: "",
    recaptcha_site_key: "",
    recaptcha_secret_key: "",
    maintenance_mode: "false",
    timezone: "Africa/Lagos",
    date_format: "DD/MM/YYYY",
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>(getDefaultSettings());
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api.get<{ settings: SettingsMap }>("/api/admin/settings").then((r) => {
      if (r.data) setSettings((prev) => ({ ...prev, ...r.data!.settings }));
      setLoading(false);
    });
  }, []);

  const update = (key: string, value: string) => setSettings((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    const r = await api.put<{ success: boolean }>("/api/admin/settings", { settings });
    setMsg(r.data?.success ? { type: "success", text: "Settings saved" } : { type: "error", text: r.error || "Save failed" });
    setSaving(false);
    setTimeout(() => setMsg(null), 4000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const s = settings;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure every aspect of your real estate platform</p>
        </div>
      </div>

      {msg && <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg.text}</div>}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>

      {/* Tab: General */}
      {activeTab === "General" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Field label="Site Name" value={s.site_name} onChange={(v) => update("site_name", v)} />
          <Field label="Tagline / Slogan" value={s.site_tagline} onChange={(v) => update("site_tagline", v)} />
          <Field label="Support Email" type="email" value={s.support_email} onChange={(v) => update("support_email", v)} />
          <Field label="Phone Number" value={s.support_phone} onChange={(v) => update("support_phone", v)} />
          <Field label="WhatsApp Number" value={s.support_whatsapp} onChange={(v) => update("support_whatsapp", v)} />
          <div className="lg:col-span-2"><Field label="Office Address" value={s.office_address} onChange={(v) => update("office_address", v)} /></div>
          <div className="lg:col-span-2"><Field label="Business Hours" value={s.business_hours} onChange={(v) => update("business_hours", v)} /></div>
        </div>
      )}

      {/* Tab: SEO */}
      {activeTab === "SEO" && (
        <div className="space-y-4">
          <Field label="Meta Title" value={s.meta_title} onChange={(v) => update("meta_title", v)} />
          <TextArea label="Meta Description" value={s.meta_description} onChange={(v) => update("meta_description", v)} />
          <Field label="OG Image URL" value={s.og_image} onChange={(v) => update("og_image", v)} placeholder="https://..." />
          <Field label="Google Analytics ID (G-XXXXX)" value={s.google_analytics_id} onChange={(v) => update("google_analytics_id", v)} />
          <Field label="Google Tag Manager ID (GTM-XXXXX)" value={s.google_tag_manager_id} onChange={(v) => update("google_tag_manager_id", v)} />
          <Field label="Facebook Pixel ID" value={s.facebook_pixel_id} onChange={(v) => update("facebook_pixel_id", v)} />
          <TextArea label="robots.txt" value={s.robots_txt} onChange={(v) => update("robots_txt", v)} rows={4} />
        </div>
      )}

      {/* Tab: Legal */}
      {activeTab === "Legal" && (
        <div className="space-y-4">
          <TextArea label="Terms of Service" value={s.terms_of_service} onChange={(v) => update("terms_of_service", v)} rows={6} />
          <TextArea label="Privacy Policy" value={s.privacy_policy} onChange={(v) => update("privacy_policy", v)} rows={6} />
          <Toggle label="Cookie Consent Banner" value={s.cookie_consent_enabled} onChange={(v) => update("cookie_consent_enabled", v ? "true" : "false")} />
          <TextArea label="Cookie Consent Text" value={s.cookie_consent_text} onChange={(v) => update("cookie_consent_text", v)} rows={2} />
          <TextArea label="Lead Form Disclaimer" value={s.lead_form_disclaimer} onChange={(v) => update("lead_form_disclaimer", v)} rows={2} />
        </div>
      )}

      {/* Tab: Properties */}
      {activeTab === "Properties" && (
        <div className="space-y-4">
          <Select label="Measurement Unit" value={s.measurement_unit} onChange={(v) => update("measurement_unit", v)} options={[["sqft", "Square Feet (Sq Ft)"], ["sqm", "Square Meters (Sq M)"]]} />
          <Select label="Currency" value={s.currency} onChange={(v) => update("currency", v)} options={[["NGN", "₦ NGN"], ["USD", "$ USD"], ["EUR", "€ EUR"], ["GBP", "£ GBP"]]} />
          <Select label="Currency Position" value={s.currency_position} onChange={(v) => update("currency_position", v)} options={[["left", "Left (₦1,000)"], ["right", "Right (1,000 ₦)"]]} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Thousands Separator" value={s.thousands_separator} onChange={(v) => update("thousands_separator", v)} />
            <Field label="Decimal Separator" value={s.decimal_separator} onChange={(v) => update("decimal_separator", v)} />
          </div>
          <Field label="Property Statuses (comma-separated)" value={s.property_statuses} onChange={(v) => update("property_statuses", v)} />
          <Field label="Property Types (comma-separated)" value={s.property_types} onChange={(v) => update("property_types", v)} />
          <TextArea label="Amenities / Features (comma-separated)" value={s.amenities_list} onChange={(v) => update("amenities_list", v)} rows={2} />
        </div>
      )}

      {/* Tab: CRM & Leads */}
      {activeTab === "CRM & Leads" && (
        <div className="space-y-4">
          <Select label="Lead Routing" value={s.lead_routing} onChange={(v) => update("lead_routing", v)} options={[["listing_agent", "Assign to listing agent"], ["round_robin", "Round robin"], ["admin", "Assign to admin"]]} />
          <Field label="Lead Statuses (comma-separated)" value={s.lead_statuses} onChange={(v) => update("lead_statuses", v)} />
          <Toggle label="Auto-responder on new inquiry" value={s.auto_responder_enabled} onChange={(v) => update("auto_responder_enabled", v ? "true" : "false")} />
          <Toggle label="Email agent on new lead" value={s.agent_notify_email} onChange={(v) => update("agent_notify_email", v ? "true" : "false")} />
          <Toggle label="SMS agent on new lead" value={s.agent_notify_sms} onChange={(v) => update("agent_notify_sms", v ? "true" : "false")} />
        </div>
      )}

      {/* Tab: Integrations */}
      {activeTab === "Integrations" && (
        <div className="space-y-4">
          <Field label="Google Maps API Key" type="password" value={s.google_maps_api_key} onChange={(v) => update("google_maps_api_key", v)} />
          <Field label="Resend API Key" type="password" value={s.resend_api_key} onChange={(v) => update("resend_api_key", v)} />
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">SMTP is optional. If Resend API key is set above, it takes priority over SMTP for all transactional emails.</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="SMTP Host" value={s.smtp_host} onChange={(v) => update("smtp_host", v)} />
            <Field label="SMTP Port" value={s.smtp_port} onChange={(v) => update("smtp_port", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="SMTP Username" value={s.smtp_user} onChange={(v) => update("smtp_user", v)} />
            <Field label="SMTP Password" type="password" value={s.smtp_pass} onChange={(v) => update("smtp_pass", v)} />
          </div>
          <Select label="SMTP Encryption" value={s.smtp_encryption} onChange={(v) => update("smtp_encryption", v)} options={[["tls", "TLS"], ["ssl", "SSL"], ["none", "None"]]} />
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Social Media Links</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Field label="Facebook URL" value={s.facebook_url} onChange={(v) => update("facebook_url", v)} />
              <Field label="Instagram URL" value={s.instagram_url} onChange={(v) => update("instagram_url", v)} />
              <Field label="LinkedIn URL" value={s.linkedin_url} onChange={(v) => update("linkedin_url", v)} />
              <Field label="YouTube URL" value={s.youtube_url} onChange={(v) => update("youtube_url", v)} />
              <Field label="X (Twitter) URL" value={s.twitter_url} onChange={(v) => update("twitter_url", v)} />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users & Agents */}
      {activeTab === "Users & Agents" && (
        <div className="space-y-4">
          <Toggle label="Show Agent Directory publicly" value={s.agent_directory_visible} onChange={(v) => update("agent_directory_visible", v ? "true" : "false")} />
          <Field label="Default Commission Rate (%)" type="number" value={s.default_commission_rate} onChange={(v) => update("default_commission_rate", v)} />
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Role Permissions</h3>
            <p className="text-xs text-gray-500 mb-3">Managed per-role from the Roles & Permissions section. Contact support for role-based access control.</p>
          </div>
        </div>
      )}

      {/* Tab: Appearance */}
      {activeTab === "Appearance" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Brand Colors</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex gap-2"><input type="color" value={s.brand_primary_color} onChange={(e) => update("brand_primary_color", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" /><input value={s.brand_primary_color} onChange={(e) => update("brand_primary_color", e.target.value)} className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-mono" /></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex gap-2"><input type="color" value={s.brand_secondary_color} onChange={(e) => update("brand_secondary_color", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" /><input value={s.brand_secondary_color} onChange={(e) => update("brand_secondary_color", e.target.value)} className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-mono" /></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Accent Color</label>
              <div className="flex gap-2"><input type="color" value={s.brand_accent_color} onChange={(e) => update("brand_accent_color", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" /><input value={s.brand_accent_color} onChange={(e) => update("brand_accent_color", e.target.value)} className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-mono" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Heading Font" value={s.heading_font} onChange={(v) => update("heading_font", v)} options={[["Inter", "Inter"], ["Roboto", "Roboto"], ["Poppins", "Poppins"], ["Merriweather", "Merriweather"], ["Lato", "Lato"]]} />
            <Select label="Body Font" value={s.body_font} onChange={(v) => update("body_font", v)} options={[["Inter", "Inter"], ["Roboto", "Roboto"], ["Poppins", "Poppins"], ["Open Sans", "Open Sans"], ["Lato", "Lato"]]} />
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Homepage Hero</h3>
            <Field label="Hero Background Image URL" value={s.hero_bg_image} onChange={(v) => update("hero_bg_image", v)} />
            <Field label="Hero Video URL (optional)" value={s.hero_bg_video} onChange={(v) => update("hero_bg_video", v)} />
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Code</h3>
            <TextArea label="Custom CSS" value={s.custom_css} onChange={(v) => update("custom_css", v)} rows={4} />
            <TextArea label="Custom JS (Header)" value={s.custom_js_header} onChange={(v) => update("custom_js_header", v)} rows={3} />
            <TextArea label="Custom JS (Footer)" value={s.custom_js_footer} onChange={(v) => update("custom_js_footer", v)} rows={3} />
          </div>
        </div>
      )}

      {/* Tab: System */}
      {activeTab === "System" && (
        <div className="space-y-4">
          <Field label="reCAPTCHA Site Key" value={s.recaptcha_site_key} onChange={(v) => update("recaptcha_site_key", v)} />
          <Field label="reCAPTCHA Secret Key" type="password" value={s.recaptcha_secret_key} onChange={(v) => update("recaptcha_secret_key", v)} />
          <Select label="Timezone" value={s.timezone} onChange={(v) => update("timezone", v)} options={[["Africa/Lagos", "Africa/Lagos (GMT+1)"], ["Africa/Nairobi", "Africa/Nairobi (GMT+3)"], ["Africa/Johannesburg", "Africa/Johannesburg (GMT+2)"], ["UTC", "UTC"]]} />
          <Select label="Date Format" value={s.date_format} onChange={(v) => update("date_format", v)} options={[["DD/MM/YYYY", "DD/MM/YYYY"], ["MM/DD/YYYY", "MM/DD/YYYY"], ["YYYY-MM-DD", "YYYY-MM-DD"]]} />
          <Toggle label="Maintenance Mode" value={s.maintenance_mode} onChange={(v) => update("maintenance_mode", v ? "true" : "false")} />
          {s.maintenance_mode === "true" && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">Site is in maintenance mode — only admins can access the platform.</div>}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-5 sticky bottom-4 shadow-lg">
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}

/* ---- Reusable field components ---- */

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-y" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
        {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: string; onChange: (v: boolean) => void }) {
  const on = value === "true";
  return (
    <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-50 border border-gray-100">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <button type="button" onClick={() => onChange(!on)} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
