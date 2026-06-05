"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";

type SettingsMap = Record<string, string>;

const TABS = ["General", "Branding", "SEO & Legal", "Properties", "Integrations", "Email Templates", "Staff & Roles", "System"] as const;
type Tab = (typeof TABS)[number];

function defaults(): SettingsMap {
  return {
    site_name: "MBPP", site_tagline: "Find Your Dream Property in Kano",
    support_email: "support@mbpproperties.com", support_phone: "", support_whatsapp: "",
    office_address: "Kano Municipal, Kano State", business_hours: "Mon-Fri 8AM-6PM",
    meta_title: "MBPP — Real Estate, Kano", meta_description: "Verified properties for rent and sale in Kano.",
    og_image: "", ga_id: "", gtm_id: "", fb_pixel: "", robots_txt: "",
    terms_of_service: "# Terms of Service\n\nLast updated: June 2026\n\nThese terms govern your use of MBPP Platform.",
    privacy_policy: "# Privacy Policy\n\nWe collect minimal data to provide our services.",
    cookie_text: "We use cookies to improve your experience.",
    measurement: "sqft", currency: "NGN", currency_pos: "left",
    property_statuses: "For Sale,For Rent,Sold,Pending",
    property_types: "House,Flat,Land,Commercial,Shop,Warehouse",
    amenities: "Pool,Gym,Security,Parking,Borehole,Solar,Furnished,CCTV",
    lead_routing: "listing_agent", lead_statuses: "New,Contacted,Scheduled,Closed,Lost",
    auto_responder: "true", agent_notify_email: "true",
    google_maps_key: "", resend_api_key: "",
    smtp_host: "", smtp_port: "", smtp_user: "", smtp_pass: "", smtp_enc: "tls",
    facebook_url: "", instagram_url: "", linkedin_url: "", youtube_url: "", twitter_url: "",
    welcome_template: "<h2>Welcome to MBPP, {{name}}!</h2><p>Your account has been created. Once approved, you'll be able to access all features.</p>",
    approved_template: "<h2>Account Approved, {{name}}!</h2><p>Your {{role}} account has been approved. <a href='{{login_url}}'>Sign in here</a>.</p>",
    reset_template: "<h2>Password Reset</h2><p>Click here to reset: <a href='{{reset_url}}'>{{reset_url}}</a>. Link expires in 15 minutes.</p>",
    inquiry_template: "<h2>New Inquiry — {{property_title}}</h2><p>{{client_name}} ({{client_contact}}) sent: {{message}}</p>",
    application_template: "<h2>Application Update — {{property_title}}</h2><p>Status: <strong>{{status}}</strong></p>",
    agreement_template: "<h2>Agreement Ready</h2><p>The tenancy agreement for {{property_title}} is ready for signing.</p>",
    payment_template: "<h2>Payment Receipt</h2><p>₦{{amount}} received for {{purpose}}. Ref: {{reference}}</p>",
    agent_dir_visible: "true", default_commission: "5",
    primary_color: "#0d6e4e", secondary_color: "#f97316", accent_color: "#facc15",
    heading_font: "Inter", body_font: "Inter",
    hero_image: "", custom_css: "", custom_js: "",
    recaptcha_site: "", recaptcha_secret: "",
    maintenance_mode: "false", timezone: "Africa/Lagos", date_format: "DD/MM/YYYY",
  };
}

function RichTextArea({ label, value, onChange, rows = 6 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatHelp, setShowFormatHelp] = useState(false);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowFormatHelp(!showFormatHelp)} className="text-[10px] text-gray-400 hover:text-gray-600">Format Help</button>
          <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-[10px] text-[var(--color-primary)] hover:underline">{showPreview ? "Edit" : "Preview"}</button>
        </div>
      </div>
      {showFormatHelp && (
        <div className="bg-gray-50 border border-gray-200 rounded p-2 text-[10px] text-gray-500 space-y-0.5">
          <p><code>**bold**</code> = <strong>bold</strong> | <code># H1</code> | <code>## H2</code> | <code>- list</code></p>
          <p><code>[link](url)</code> | <code>![alt](url)</code> | <code>&gt; blockquote</code></p>
          <p>Variables: <code>{`{{name}}`}</code> <code>{`{{role}}`}</code> <code>{`{{property_title}}`}</code> etc.</p>
        </div>
      )}
      {showPreview ? (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm min-h-[100px] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/{{(.*?)}}/g, "<code>{$1}</code>") }} />
      ) : (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>(defaults());
  const [tab, setTab] = useState<Tab>("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api.get<{ settings: SettingsMap }>("/api/admin/settings").then((r) => {
      if (r.data) setSettings((p) => ({ ...p, ...(r.data!.settings || {}) }));
      setLoading(false);
    });
  }, []);

  const s = (k: string) => settings[k] || "";
  const set = (k: string, v: string) => setSettings((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true); setMsg(null);
    const r = await api.put<{ success: boolean }>("/api/admin/settings", { settings });
    setMsg(r.data?.success ? { type: "success", text: "Saved" } : { type: "error", text: r.error || "Failed" });
    setSaving(false); setTimeout(() => setMsg(null), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
            <p className="text-xs text-gray-500">Configure every aspect of your platform</p>
          </div>
        </div>
        <Button onClick={save} disabled={saving} size="sm">{saving ? "Saving..." : "Save All"}</Button>
      </div>

      {msg && <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg.text}</div>}

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        {/* General */}
        {tab === "General" && (<>
          <h3 className="text-sm font-semibold text-gray-900">General Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <F label="Site Name" v={s("site_name")} onChange={(v) => set("site_name", v)} />
            <F label="Tagline" v={s("site_tagline")} onChange={(v) => set("site_tagline", v)} />
            <F label="Support Email" v={s("support_email")} onChange={(v) => set("support_email", v)} type="email" />
            <F label="Phone" v={s("support_phone")} onChange={(v) => set("support_phone", v)} />
            <F label="WhatsApp" v={s("support_whatsapp")} onChange={(v) => set("support_whatsapp", v)} />
            <div className="col-span-2"><F label="Office Address" v={s("office_address")} onChange={(v) => set("office_address", v)} /></div>
            <div className="col-span-2"><F label="Business Hours" v={s("business_hours")} onChange={(v) => set("business_hours", v)} /></div>
          </div>
        </>)}

        {/* Branding */}
        {tab === "Branding" && (<>
          <h3 className="text-sm font-semibold text-gray-900">Brand Identity</h3>
          <div className="grid grid-cols-3 gap-3">
            {[["primary_color", "Primary"], ["secondary_color", "Secondary"], ["accent_color", "Accent"]].map(([k, l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{l}</label>
                <div className="flex gap-2">
                  <input type="color" value={s(k)} onChange={(e) => set(k, e.target.value)} className="w-9 h-9 rounded border cursor-pointer" />
                  <input value={s(k)} onChange={(e) => set(k, e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs font-mono" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <S label="Heading Font" v={s("heading_font")} onChange={(v) => set("heading_font", v)} opts={[["Inter","Inter"],["Poppins","Poppins"],["Merriweather","Merriweather"]]} />
            <S label="Body Font" v={s("body_font")} onChange={(v) => set("body_font", v)} opts={[["Inter","Inter"],["Roboto","Roboto"],["Lato","Lato"]]} />
          </div>
          <F label="Hero Image URL" v={s("hero_image")} onChange={(v) => set("hero_image", v)} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Custom CSS</label><textarea value={s("custom_css")} onChange={(e) => set("custom_css", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Custom JS</label><textarea value={s("custom_js")} onChange={(e) => set("custom_js", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" /></div>
          </div>
        </>)}

        {/* SEO & Legal */}
        {tab === "SEO & Legal" && (<>
          <h3 className="text-sm font-semibold text-gray-900">SEO</h3>
          <F label="Meta Title" v={s("meta_title")} onChange={(v) => set("meta_title", v)} />
          <TA label="Meta Description" v={s("meta_description")} onChange={(v) => set("meta_description", v)} rows={2} />
          <div className="grid grid-cols-3 gap-3">
            <F label="Google Analytics" v={s("ga_id")} onChange={(v) => set("ga_id", v)} placeholder="G-XXXXX" />
            <F label="Google Tag Manager" v={s("gtm_id")} onChange={(v) => set("gtm_id", v)} placeholder="GTM-XXXXX" />
            <F label="Facebook Pixel" v={s("fb_pixel")} onChange={(v) => set("fb_pixel", v)} />
          </div>
          <TA label="robots.txt" v={s("robots_txt")} onChange={(v) => set("robots_txt", v)} rows={3} />
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900">Legal Documents</h3>
          <RichTextArea label="Terms of Service" value={s("terms_of_service")} onChange={(v) => set("terms_of_service", v)} rows={8} />
          <RichTextArea label="Privacy Policy" value={s("privacy_policy")} onChange={(v) => set("privacy_policy", v)} rows={8} />
          <F label="Cookie Consent Text" v={s("cookie_text")} onChange={(v) => set("cookie_text", v)} />
        </>)}

        {/* Properties */}
        {tab === "Properties" && (<>
          <h3 className="text-sm font-semibold text-gray-900">Property Configuration</h3>
          <div className="grid grid-cols-2 gap-3">
            <S label="Measurement" v={s("measurement")} onChange={(v) => set("measurement", v)} opts={[["sqft","Sq Ft"],["sqm","Sq M"]]} />
            <S label="Currency" v={s("currency")} onChange={(v) => set("currency", v)} opts={[["NGN","₦ NGN"],["USD","$ USD"]]} />
          </div>
          <F label="Property Statuses (comma-separated)" v={s("property_statuses")} onChange={(v) => set("property_statuses", v)} />
          <F label="Property Types (comma-separated)" v={s("property_types")} onChange={(v) => set("property_types", v)} />
          <F label="Amenities (comma-separated)" v={s("amenities")} onChange={(v) => set("amenities", v)} />
        </>)}

        {/* Integrations */}
        {tab === "Integrations" && (<>
          <h3 className="text-sm font-semibold text-gray-900">API Keys & Integrations</h3>
          <F label="Google Maps API Key" v={s("google_maps_key")} onChange={(v) => set("google_maps_key", v)} type="password" />
          <F label="Resend API Key (Email)" v={s("resend_api_key")} onChange={(v) => set("resend_api_key", v)} type="password" />
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">The Resend API key powers all transactional emails. Get one at <a href="https://resend.com" className="underline" target="_blank">resend.com</a>.</div>
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900">SMTP (Optional Fallback)</h3>
          <div className="grid grid-cols-2 gap-3">
            <F label="Host" v={s("smtp_host")} onChange={(v) => set("smtp_host", v)} />
            <F label="Port" v={s("smtp_port")} onChange={(v) => set("smtp_port", v)} />
            <F label="Username" v={s("smtp_user")} onChange={(v) => set("smtp_user", v)} />
            <F label="Password" v={s("smtp_pass")} onChange={(v) => set("smtp_pass", v)} type="password" />
          </div>
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900">Social Media</h3>
          <div className="grid grid-cols-3 gap-3">
            <F label="Facebook" v={s("facebook_url")} onChange={(v) => set("facebook_url", v)} />
            <F label="Instagram" v={s("instagram_url")} onChange={(v) => set("instagram_url", v)} />
            <F label="LinkedIn" v={s("linkedin_url")} onChange={(v) => set("linkedin_url", v)} />
            <F label="YouTube" v={s("youtube_url")} onChange={(v) => set("youtube_url", v)} />
            <F label="X / Twitter" v={s("twitter_url")} onChange={(v) => set("twitter_url", v)} />
          </div>
        </>)}

        {/* Email Templates */}
        {tab === "Email Templates" && (<>
          <h3 className="text-sm font-semibold text-gray-900">Email Templates</h3>
          <p className="text-xs text-gray-500">Use variables like <code>{`{{name}}`}</code>, <code>{`{{role}}`}</code>, <code>{`{{property_title}}`}</code> etc.</p>
          <RichTextArea label="Welcome Email (on registration)" value={s("welcome_template")} onChange={(v) => set("welcome_template", v)} rows={5} />
          <RichTextArea label="Account Approved" value={s("approved_template")} onChange={(v) => set("approved_template", v)} rows={5} />
          <RichTextArea label="Password Reset" value={s("reset_template")} onChange={(v) => set("reset_template", v)} rows={5} />
          <RichTextArea label="New Inquiry Notification" value={s("inquiry_template")} onChange={(v) => set("inquiry_template", v)} rows={5} />
          <RichTextArea label="Application Status Change" value={s("application_template")} onChange={(v) => set("application_template", v)} rows={5} />
          <RichTextArea label="Agreement Ready" value={s("agreement_template")} onChange={(v) => set("agreement_template", v)} rows={5} />
          <RichTextArea label="Payment Receipt" value={s("payment_template")} onChange={(v) => set("payment_template", v)} rows={5} />
        </>)}

        {/* Staff & Roles */}
        {tab === "Staff & Roles" && (<>
          <h3 className="text-sm font-semibold text-gray-900">Staff & Role Management</h3>
          <div className="grid grid-cols-2 gap-3">
            <F label="Default Commission Rate (%)" v={s("default_commission")} onChange={(v) => set("default_commission", v)} type="number" />
          </div>
          <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-50 border border-gray-100" onClick={() => set("agent_dir_visible", s("agent_dir_visible") === "true" ? "false" : "true")}>
            <span className="text-sm font-medium text-gray-900">Show Agent Directory Publicly</span>
            <button type="button" className={`relative w-11 h-6 rounded-full transition-colors ${s("agent_dir_visible") === "true" ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${s("agent_dir_visible") === "true" ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="space-y-3 mt-3">
            {(["head", "ambassador", "agent"] as const).map((role) => (
              <div key={role} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{role}</p>
                  <p className="text-xs text-gray-500">{role === "head" ? "Full access, manage platform" : role === "ambassador" ? "Manage agents, create tasks" : "Handle listings, close deals"}</p>
                </div>
                <span className="text-xs text-gray-400">Permissions managed in Staffs page</span>
              </div>
            ))}
          </div>
        </>)}

        {/* System */}
        {tab === "System" && (<>
          <h3 className="text-sm font-semibold text-gray-900">System Configuration</h3>
          <F label="reCAPTCHA Site Key" v={s("recaptcha_site")} onChange={(v) => set("recaptcha_site", v)} />
          <F label="reCAPTCHA Secret" v={s("recaptcha_secret")} onChange={(v) => set("recaptcha_secret", v)} type="password" />
          <S label="Timezone" v={s("timezone")} onChange={(v) => set("timezone", v)} opts={[["Africa/Lagos","Africa/Lagos"],["UTC","UTC"]]} />
          <S label="Date Format" v={s("date_format")} onChange={(v) => set("date_format", v)} opts={[["DD/MM/YYYY","DD/MM/YYYY"],["MM/DD/YYYY","MM/DD/YYYY"],["YYYY-MM-DD","YYYY-MM-DD"]]} />
          <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-50 border border-gray-100" onClick={() => set("maintenance_mode", s("maintenance_mode") === "true" ? "false" : "true")}>
            <span className="text-sm font-medium text-gray-900">Maintenance Mode</span>
            <button type="button" className={`relative w-11 h-6 rounded-full transition-colors ${s("maintenance_mode") === "true" ? "bg-red-500" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${s("maintenance_mode") === "true" ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </>)}
      </div>
    </div>
  );
}

/* Mini components */
function F({ label, v, onChange, type = "text", placeholder }: { label: string; v: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700">{label}</label>
    <input type={type} value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
  </div>;
}
function TA({ label, v, onChange, rows = 3 }: { label: string; v: string; onChange: (v: string) => void; rows?: number }) {
  return <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700">{label}</label>
    <textarea value={v} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" />
  </div>;
}
function S({ label, v, onChange, opts }: { label: string; v: string; onChange: (v: string) => void; opts: [string, string][] }) {
  return <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700">{label}</label>
    <select value={v} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
      {opts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  </div>;
}
