"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import DOMPurify from "dompurify";
import { resolveImageUrl } from "@/lib/utils";

type SettingsMap = Record<string, string>;

const TABS = ["General", "Branding", "SEO & Legal", "Properties", "Team", "Content", "Integrations", "Email Templates", "Staff & Roles", "System"] as const;
type Tab = (typeof TABS)[number];

function defaults(): SettingsMap {
  return {
    site_name: "Mutual Benefit Premier Properties", site_tagline: "Find Your Dream Property in Kano & Northern States",
    support_email: "support@mbpproperties.com", support_phone: "", support_whatsapp: "",
    office_address: "Kano Municipal, Kano State", business_hours: "Mon-Fri 8AM-6PM",
    meta_title: "MBPP Properties | Buy, Rent & Sell Houses in Kano & Northern States",
    meta_description: "Find verified houses, land, flats and commercial properties for rent and sale in Kano & Northern States, Nigeria. Your trusted real estate marketplace with secure transactions and verified agents.",
    og_image: "", ga_id: "", gtm_id: "", fb_pixel: "", robots_txt: "User-agent: *\nAllow: /\nSitemap: https://mbpproperties.com/sitemap.xml",
    seo_canonical_url: "https://mbpproperties.com/", seo_geo_region: "NG-KN", seo_geo_placename: "Kano, Nigeria",
    seo_geo_position: "12.0022;8.5920", seo_icbm: "12.0022, 8.5920",
    seo_content_language: "en-NG", seo_robots: "index, follow, max-image-preview:large", seo_og_locale: "en_NG",
    seo_schema_phone: "+234-xxx-xxx-xxxx", seo_schema_email: "info@mbpproperties.com",
    seo_schema_street: "Kano Municipal", seo_schema_city: "Kano", seo_schema_state: "Kano State", seo_schema_country: "NG",
    seo_schema_lat: "12.0022", seo_schema_lng: "8.5920",
    seo_schema_opening_days: "Monday,Tuesday,Wednesday,Thursday,Friday",
    seo_schema_open_time: "08:00", seo_schema_close_time: "18:00",
    seo_schema_area_served: "Kano, Northern Nigeria", seo_schema_same_as: "https://www.facebook.com/mbpproperties,https://www.instagram.com/mbpproperties,https://twitter.com/mbpproperties",
    seo_schema_description: "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria. Gidan siyarwa Kano, gidan haya.",
    seo_property_schema_enabled: "true",
    seo_hausa_keywords: "gidan siyarwa, gidan haya, sayar da gida, siyan gida, nema gidan haya, fatacin gida, property arewacin najeriya, house for sale, house for rent",
    terms_of_service: "# Terms of Service\n\n**Last updated: June 2026**\n\n## 1. Acceptance of Terms\nBy accessing or using MBPP, you agree to these Terms. If you do not agree, do not use the Platform.\n\n## 2. Services\nMBPP provides a real estate marketplace connecting property seekers with verified listings in Kano, Nigeria. Services include property browsing, tenant applications, agent management, and transaction facilitation.\n\n## 3. User Accounts\nYou must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. MBPP reserves the right to suspend accounts that violate these terms.\n\n## 4. Property Listings\nAll listings must be accurate and truthful. MBPP reserves the right to remove any listing that violates these terms or contains misleading information.\n\n## 5. Payments & Transactions\nAll payments are processed securely through authorized payment providers. MBPP is not liable for payment disputes between buyers, sellers, landlords, or tenants.\n\n## 6. Privacy\nYour data is handled according to our Privacy Policy. We never sell your personal information to third parties.\n\n## 7. Limitation of Liability\nMBPP is not liable for any direct or indirect damages arising from the use of the Platform. Properties listed are the responsibility of their respective owners or agents.\n\n## 8. Contact\nFor questions about these terms, contact support@mbpproperties.com.",
    privacy_policy: "# Privacy Policy\n\n**Last updated: June 2026**\n\n## 1. Information Collected\nWe collect: registration details (name, email, phone), property preferences, usage data, and communications with agents.\n\n## 2. Use of Information\nYour information is used to provide services, process transactions, communicate about listings and inquiries, and improve the Platform.\n\n## 3. Data Sharing\nData may be shared with agents/landlords for inquiries, payment processors for transactions, and authorities when required by law. We never sell your data.\n\n## 4. Security\nWe implement industry-standard security measures including encryption, secure servers, and access controls. However, no electronic storage is 100% secure.\n\n## 5. Your Rights\nYou may access, correct, or request deletion of your personal data at any time by contacting support@mbpproperties.com.\n\n## 6. Cookies\nWe use essential cookies for site functionality and optional analytics cookies. You can manage cookie preferences in your browser settings.\n\n## 7. Policy Updates\nThis policy may be updated periodically. Continued use of the Platform after changes constitutes acceptance of the updated policy.",
    cookie_text: "We use cookies to improve your experience. By continuing to browse, you agree to our use of cookies.",
    measurement: "sqft", currency: "NGN", currency_pos: "left",
    property_statuses: "For Sale,For Rent,Sold,Pending",
    property_types: "House,Flat,Land,Commercial,Shop,Warehouse",
    amenities: "Pool,Gym,Security,Parking,Borehole,Solar,Furnished,CCTV",
    lead_routing: "listing_agent", lead_statuses: "New,Contacted,Scheduled,Closed,Lost",
    auto_responder: "true", agent_notify_email: "true",
    google_maps_key: "", resend_api_key: "",
    smtp_host: "", smtp_port: "", smtp_user: "", smtp_pass: "", smtp_enc: "tls",
    facebook_url: "", instagram_url: "", linkedin_url: "", youtube_url: "", twitter_url: "", tiktok_url: "",
    welcome_template: "<h2>Welcome to MBPP!</h2><p>Hello <strong>{{name}}</strong>,</p><p>Your account has been created and is ready to use. You can now browse properties, contact agents, and manage your listings.</p><p>If you have any questions, reach out to us at support@mbpproperties.com.</p>",
    approved_template: "<h2>Account Approved!</h2><p>Hello <strong>{{name}}</strong>,</p><p>Your <strong>{{role}}</strong> account has been approved. You now have full access to your dashboard and all platform features.</p><p><a href='{{login_url}}'>Sign in to your account</a></p>",
    reset_template: "<h2>Reset Your Password</h2><p>Hello <strong>{{name}}</strong>,</p><p>We received a request to reset your password. Click the button below to create a new password. This link expires in 15 minutes.</p><p><a href='{{reset_url}}'>Reset Password</a></p><p>If you did not request this, please ignore this email.</p>",
    inquiry_template: "<h2>New Inquiry: {{property_title}}</h2><p><strong>{{client_name}}</strong> ({{client_contact}}) sent an inquiry about your listing:</p><blockquote>{{message}}</blockquote><p>Log in to your dashboard to respond.</p>",
    application_template: "<h2>Application Update</h2><p>Hello,</p><p>Your application for <strong>{{property_title}}</strong> has been updated.</p><p>Status: <strong>{{status}}</strong></p><p>Log in to your dashboard for more details.</p>",
    agreement_template: "<h2>Tenancy Agreement Ready</h2><p>Hello <strong>{{name}}</strong>,</p><p>The tenancy agreement for <strong>{{property_title}}</strong> is ready for your review and signature.</p><p>Log in to your dashboard to view and sign the agreement.</p>",
    payment_template: "<h2>Payment Receipt</h2><p>Hello <strong>{{name}}</strong>,</p><p>We have received your payment of <strong>₦{{amount}}</strong> for <strong>{{purpose}}</strong>.</p><p>Reference: {{reference}}</p><p>Log in to your dashboard to view the full receipt.</p>",
    agent_application_template: "<h2>Agent Application Received</h2><p>Hello <strong>{{name}}</strong>,</p><p>Thank you for applying to become an agent with MBPP. We have received your application and our team is reviewing your credentials.</p><p>We will get back to you within 48 hours with an update.</p>",
    agent_terms: "<p><strong>1. Code of Conduct</strong><br />As an MBPP agent, you agree to represent properties truthfully, maintain client confidentiality, and act in the best interest of both property owners and tenants.</p>\n<p><strong>2. Listing Accuracy</strong><br />All property listings must include accurate information, current photographs, and truthful descriptions. Misrepresentation will result in immediate termination.</p>\n<p><strong>3. Commission Structure</strong><br />Agents earn a commission of 5% on each successful rental or sale transaction facilitated through MBPP. Commissions are paid within 7 days of transaction completion.</p>\n<p><strong>4. Verification Requirements</strong><br />Agents must provide valid identification (NIN or BVN), proof of address, and two professional references. MBPP reserves the right to verify all provided information.</p>\n<p><strong>5. Exclusive Platform</strong><br />Properties listed on MBPP must not be listed on competing platforms at a lower price. Agents are encouraged to use MBPP as their primary listing platform.</p>\n<p><strong>6. Data Protection</strong><br />Agents must comply with the Nigeria Data Protection Regulation (NDPR). Client personal information must not be shared with third parties without explicit consent.</p>\n<p><strong>7. Dispute Resolution</strong><br />Any disputes arising from agent activities shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria.</p>\n<p><strong>8. Termination</strong><br />MBPP reserves the right to terminate an agent's account with 14 days' notice if terms are violated. Agents may terminate their account at any time with 7 days' notice.</p>",
    agent_dir_visible: "true", default_commission: "5",
    primary_color: "#0d6e4e", secondary_color: "#f97316", accent_color: "#facc15",
    heading_font: "Inter", body_font: "Inter",
    hero_image: "", about_hero_image: "", flyer_image: "", custom_css: "", custom_js: "",
    completed_projects: JSON.stringify([
      { image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop", title: "Luxury Villa, Tarauni", subtitle: "4-bedroom duplex with modern finishes" },
      { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop", title: "Modern Estate, Nassarawa", subtitle: "6 units of 3-bedroom apartments" },
      { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop", title: "Smart Homes, Kano Municipal", subtitle: "Eco-friendly smart homes" },
      { image: "https://images.unsplash.com/photo-1600566753086-00f18f6b7c92?w=800&h=500&fit=crop", title: "Gated Community, Fagge", subtitle: "Secure compound with 8 townhouses" },
    ]),
    developments_in_progress: JSON.stringify([
      { image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=500&fit=crop", title: "Green Valley Estate", subtitle: "Phase 2 construction ongoing" },
      { image: "https://images.unsplash.com/photo-1590674899484-d5640f854633?w=800&h=500&fit=crop", title: "City Center Towers", subtitle: "12-storey commercial complex" },
      { image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=500&fit=crop", title: "Harmony Heights", subtitle: "Luxury hilltop development" },
    ]),
    recaptcha_site: "", recaptcha_secret: "",
    maintenance_mode: "false", timezone: "Africa/Lagos", date_format: "DD/MM/YYYY",
    team_members: JSON.stringify([
      { name: "Engr. Ahmad Abubakar, PhD", role: "CEO & Managing Director", bio: "Strategic leadership & final authority. Investment management & capital control. Enterprise growth & market expansion.", photo: "" },
      { name: "Sulaiman Usman (LLB, B.L, LLM)", role: "Legal Adviser", bio: "Contract management & compliance. Oversees all legal documentation, property contracts, and regulatory compliance.", photo: "" },
      { name: "Umar Nuhu Umar", role: "Admin Officer", bio: "Executive support & corporate services. Manages day-to-day administrative operations and corporate coordination.", photo: "" },
      { name: "Engr. Tasiu Sani", role: "Sales Manager", bio: "Property marketing & client relations. Leads property marketing strategies and maintains client relationships.", photo: "" },
      { name: "Engr. Salisu Mohd Nuhu", role: "Operations Manager", bio: "Property development & asset management. Oversees property development projects and asset portfolio management.", photo: "" },
      { name: "Abdulmalik Abubakar", role: "Finance Manager", bio: "Accounting & budget management. Handles financial records, budgeting, and fiscal planning.", photo: "" },
      { name: "Zahradden Aliyu", role: "Project Manager", bio: "Project planning, execution & delivery. Manages construction projects from planning to completion.", photo: "" },
      { name: "Engr. Sani Umar, PhD", role: "Technology Manager", bio: "Digital platform & IT support. Manages the MBPP digital platform and technical infrastructure.", photo: "" },
      { name: "Ahmad Abubakar Ali", role: "Media Manager", bio: "Corporate promotion & communications. Handles social media, marketing content, and public communications.", photo: "" },
    ]),
    research_reports: JSON.stringify([
      { title: "Kano Residential Market Report: Q1 2026", date: "April 2026", summary: "Average rents rose 12% year-on-year across Kano Municipal. Tarauni and Nassarawa saw the highest demand for 2-bedroom flats.", metrics: ["12% YoY rent increase", "340 active listings", "4.2 avg days on market", "\u20A6850K avg annual rent"] },
      { title: "Northern Nigeria Real Estate Outlook 2026", date: "January 2026", summary: "Comprehensive analysis of property trends across Kano, Kaduna, and Katsina states including urban migration patterns and infrastructure impact.", metrics: ["6 states covered", "2,100+ data points", "15 city districts", "3-year forecast"] },
      { title: "Rental Affordability Index: Kano State", date: "March 2026", summary: "How rent-to-income ratios vary across Kano\u2019s eight local government areas. Fagge remains the most affordable district for young professionals.", metrics: ["28% avg rent-to-income", "\u20A6180K median salary", "8 LGAs analysed", "5 property types"] },
      { title: "Commercial Property Trends in Kano", date: "February 2026", summary: "Demand for retail and office space is shifting toward the new Kano City Centre development. Industrial space in Fagge remains undersupplied.", metrics: ["22% vacancy rate", "\u20A62.1M avg annual rent", "3 new developments", "+8% commercial growth"] },
    ]),
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
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm min-h-[100px] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }} />
      ) : (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" />
      )}
    </div>
  );
}

function EmailTemplateSection({ label, settingKey, settings, set }: { label: string; settingKey: string; settings: SettingsMap; set: (k: string, v: string) => void }) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const loadPreview = async () => {
    setLoadingPreview(true);
    setPreviewError(null);
    try {
      const r = await api.get<{ html: string }>(`/api/admin/settings/email-preview/${settingKey}`);
      if (r.data?.html) {
        setPreviewHtml(r.data.html);
        setShowPreview(true);
      } else if (r.status !== 200) {
        setPreviewError(`Failed to load preview (${r.status})`);
      } else {
        setPreviewError("No preview content returned");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      setPreviewError(status ? `Failed to load preview (${status})` : (err?.message || "Failed to load preview"));
    }
    setLoadingPreview(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <button type="button" onClick={loadPreview} disabled={loadingPreview} className="text-[10px] font-medium px-2.5 py-1 rounded bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50">
          {loadingPreview ? "Loading..." : "Preview Full Email"}
        </button>
      </div>
      <div className="p-3">
        <textarea value={settings[settingKey] || ""} onChange={(e) => set(settingKey, e.target.value)} rows={4} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" placeholder="Leave empty to use the default template..." />
        {previewError && <p className="text-xs text-red-500 mt-1">{previewError}</p>}
      </div>
      {showPreview && previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Email Preview: {label}</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              <iframe srcDoc={previewHtml} className="w-full h-[600px] border-0" title="Email Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TeamMember { name: string; role: string; bio: string; photo: string; }
interface ResearchReport { title: string; date: string; summary: string; metrics: string[]; }
interface CarouselProject { image: string; title: string; subtitle: string; }

function parseJson<T>(raw: string): T[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>(defaults());
  const [tab, setTab] = useState<Tab>("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(parseJson<TeamMember>((defaults()).team_members));
  const [researchReports, setResearchReports] = useState<ResearchReport[]>(parseJson<ResearchReport>((defaults()).research_reports));
  const [completedProjects, setCompletedProjects] = useState<CarouselProject[]>(parseJson<CarouselProject>((defaults()).completed_projects));
  const [developmentsProjects, setDevelopmentsProjects] = useState<CarouselProject[]>(parseJson<CarouselProject>((defaults()).developments_in_progress));

  useEffect(() => {
    api.get<{ settings: SettingsMap }>("/api/admin/settings").then((r) => {
      if (r.data?.settings) {
        const merged: SettingsMap = {};
        for (const [k, v] of Object.entries(r.data.settings)) {
          if (v) merged[k] = v; // skip empty values to preserve defaults
        }
        setSettings((p) => ({ ...p, ...merged }));
        if (merged.team_members) setTeamMembers(parseJson<TeamMember>(merged.team_members));
        if (merged.research_reports) setResearchReports(parseJson<ResearchReport>(merged.research_reports));
        if (merged.completed_projects) setCompletedProjects(parseJson<CarouselProject>(merged.completed_projects));
        if (merged.developments_in_progress) setDevelopmentsProjects(parseJson<CarouselProject>(merged.developments_in_progress));
      }
      setLoading(false);
    });
  }, []);

  const s = (k: string) => settings[k] || "";
  const set = (k: string, v: string) => setSettings((p) => ({ ...p, [k]: v }));

  const updateMember = (i: number, field: keyof TeamMember, value: string) => {
    const updated = teamMembers.map((m, idx) => idx === i ? { ...m, [field]: value } : m);
    setTeamMembers(updated);
    set("team_members", JSON.stringify(updated));
  };

  const addMember = () => {
    const updated = [...teamMembers, { name: "", role: "", bio: "", photo: "" }];
    setTeamMembers(updated);
    set("team_members", JSON.stringify(updated));
  };

  const removeMember = (i: number) => {
    const updated = teamMembers.filter((_, idx) => idx !== i);
    setTeamMembers(updated);
    set("team_members", JSON.stringify(updated));
  };

  const updateReport = (i: number, field: string, value: string | string[]) => {
    const updated = researchReports.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    setResearchReports(updated);
    set("research_reports", JSON.stringify(updated));
  };

  const addReport = () => {
    const updated = [...researchReports, { title: "", date: "", summary: "", metrics: [] }];
    setResearchReports(updated);
    set("research_reports", JSON.stringify(updated));
  };

  const removeReport = (i: number) => {
    const updated = researchReports.filter((_, idx) => idx !== i);
    setResearchReports(updated);
    set("research_reports", JSON.stringify(updated));
  };

  const updateProject = (list: "completed" | "developments", i: number, field: keyof CarouselProject, value: string) => {
    const setter = list === "completed" ? setCompletedProjects : setDevelopmentsProjects;
    const key = list === "completed" ? "completed_projects" : "developments_in_progress";
    setter((prev: CarouselProject[]) => {
      const updated = prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p);
      set(key, JSON.stringify(updated));
      return updated;
    });
  };

  const addProject = (list: "completed" | "developments") => {
    const setter = list === "completed" ? setCompletedProjects : setDevelopmentsProjects;
    const key = list === "completed" ? "completed_projects" : "developments_in_progress";
    setter((prev: CarouselProject[]) => {
      const updated = [...prev, { image: "", title: "", subtitle: "" }];
      set(key, JSON.stringify(updated));
      return updated;
    });
  };

  const removeProject = (list: "completed" | "developments", i: number) => {
    const setter = list === "completed" ? setCompletedProjects : setDevelopmentsProjects;
    const key = list === "completed" ? "completed_projects" : "developments_in_progress";
    setter((prev: CarouselProject[]) => {
      const updated = prev.filter((_, idx) => idx !== i);
      set(key, JSON.stringify(updated));
      return updated;
    });
  };

  const save = async () => {
    setSaving(true); setMsg(null);
    const r = await api.put<{ success: boolean }>("/api/admin/settings", { settings });
    setMsg(r.data?.success ? { type: "success", text: "Saved" } : { type: "error", text: r.error || "Failed" });
    setSaving(false); setTimeout(() => setMsg(null), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <MediaPicker label="Homepage Hero Image" current={s("hero_image")} onSelect={(url) => set("hero_image", url)} />
          <MediaPicker label="About Page Hero Image" current={s("about_hero_image")} onSelect={(url) => set("about_hero_image", url)} />
          <MediaPicker label="Site Logo" current={s("site_logo")} onSelect={(url) => set("site_logo", url)} />
          <MediaPicker label="Favicon" current={s("site_favicon")} onSelect={(url) => set("site_favicon", url)} />
          <MediaPicker label="Flyer Image (homepage)" current={s("flyer_image")} onSelect={(url) => set("flyer_image", url)} />
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
          <MediaPicker label="OG Image (social share preview)" current={s("og_image")} onSelect={(url) => set("og_image", url)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <F label="Google Analytics" v={s("ga_id")} onChange={(v) => set("ga_id", v)} placeholder="G-XXXXX" />
            <F label="Google Tag Manager" v={s("gtm_id")} onChange={(v) => set("gtm_id", v)} placeholder="GTM-XXXXX" />
            <F label="Facebook Pixel" v={s("fb_pixel")} onChange={(v) => set("fb_pixel", v)} />
          </div>
          <TA label="robots.txt" v={s("robots_txt")} onChange={(v) => set("robots_txt", v)} rows={3} />
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900">Geo & Local SEO</h3>
          <p className="text-xs text-gray-500 mb-2">These values appear in meta tags and structured data for Google local search results.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Canonical URL" v={s("seo_canonical_url")} onChange={(v) => set("seo_canonical_url", v)} placeholder="https://mbpproperties.com/" />
            <F label="Content Language" v={s("seo_content_language")} onChange={(v) => set("seo_content_language", v)} placeholder="en-NG" />
            <F label="Geo Region" v={s("seo_geo_region")} onChange={(v) => set("seo_geo_region", v)} placeholder="NG-KN" />
            <F label="Geo Placename" v={s("seo_geo_placename")} onChange={(v) => set("seo_geo_placename", v)} placeholder="Kano, Nigeria" />
            <F label="Geo Position (lat;lng)" v={s("seo_geo_position")} onChange={(v) => set("seo_geo_position", v)} placeholder="12.0022;8.5920" />
            <F label="ICBM (lat, lng)" v={s("seo_icbm")} onChange={(v) => set("seo_icbm", v)} placeholder="12.0022, 8.5920" />
            <F label="Robots Meta" v={s("seo_robots")} onChange={(v) => set("seo_robots", v)} placeholder="index, follow, max-image-preview:large" />
            <F label="OG Locale" v={s("seo_og_locale")} onChange={(v) => set("seo_og_locale", v)} placeholder="en_NG" />
          </div>
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900">Business Schema (Structured Data)</h3>
          <p className="text-xs text-gray-500 mb-2">Appears in Google rich results as a LocalBusiness listing. Fill in your real business details.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Business Phone" v={s("seo_schema_phone")} onChange={(v) => set("seo_schema_phone", v)} placeholder="+234-xxx-xxx-xxxx" />
            <F label="Business Email" v={s("seo_schema_email")} onChange={(v) => set("seo_schema_email", v)} placeholder="info@mbpproperties.com" />
            <F label="Street Address" v={s("seo_schema_street")} onChange={(v) => set("seo_schema_street", v)} placeholder="Kano Municipal" />
            <F label="City" v={s("seo_schema_city")} onChange={(v) => set("seo_schema_city", v)} placeholder="Kano" />
            <F label="State / Region" v={s("seo_schema_state")} onChange={(v) => set("seo_schema_state", v)} placeholder="Kano State" />
            <S label="Country" v={s("seo_schema_country")} onChange={(v) => set("seo_schema_country", v)} opts={[["NG","Nigeria"],["US","United States"],["GB","United Kingdom"]]} />
            <F label="Latitude" v={s("seo_schema_lat")} onChange={(v) => set("seo_schema_lat", v)} placeholder="12.0022" />
            <F label="Longitude" v={s("seo_schema_lng")} onChange={(v) => set("seo_schema_lng", v)} placeholder="8.5920" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <F label="Opening Days (comma-separated)" v={s("seo_schema_opening_days")} onChange={(v) => set("seo_schema_opening_days", v)} placeholder="Monday,Tuesday,..." />
            <F label="Open Time" v={s("seo_schema_open_time")} onChange={(v) => set("seo_schema_open_time", v)} placeholder="08:00" />
            <F label="Close Time" v={s("seo_schema_close_time")} onChange={(v) => set("seo_schema_close_time", v)} placeholder="18:00" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Area Served" v={s("seo_schema_area_served")} onChange={(v) => set("seo_schema_area_served", v)} placeholder="Kano" />
            <F label="Social Media URLs (comma-separated)" v={s("seo_schema_same_as")} onChange={(v) => set("seo_schema_same_as", v)} placeholder="https://facebook.com/...,https://instagram.com/..." />
          </div>
          <TA label="Schema Description" v={s("seo_schema_description")} onChange={(v) => set("seo_schema_description", v)} rows={2} />
          <TA label="Hausa & Pidgin Keywords" v={s("seo_hausa_keywords")} onChange={(v) => set("seo_hausa_keywords", v)} rows={2} />
          <p className="text-[10px] text-gray-400 -mt-2">Comma-separated Hausa, Pidgin and local search terms. E.g. gidan siyarwa kano, house for sale, plaza kano, flat kano</p>
          <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-50 border border-gray-100" onClick={() => set("seo_property_schema_enabled", s("seo_property_schema_enabled") === "true" ? "false" : "true")}>
            <div>
              <span className="text-sm font-medium text-gray-900">Property Listing Schema</span>
              <p className="text-[10px] text-gray-500">Adds RealEstateListing structured data on each property page for Google rich results.</p>
            </div>
            <button type="button" className={`relative w-11 h-6 rounded-full transition-colors ${s("seo_property_schema_enabled") === "true" ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${s("seo_property_schema_enabled") === "true" ? "translate-x-5" : ""}`} />
            </button>
          </div>
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
          <div className="border-t border-gray-100 pt-3 mt-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Available Cities ({s("available_cities").split(";").filter(c => c.trim()).length})</h4>
            <CityManager value={s("available_cities")} onChange={(v) => set("available_cities", v)} />
          </div>
        </>)}

        {/* Team */}
        {tab === "Team" && (<>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Core Team Members</h3>
            <p className="text-xs text-gray-500">{teamMembers.length} members</p>
          </div>
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            {teamMembers.map((m, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Member {i + 1}</span>
                  <button type="button" onClick={() => removeMember(i)} className="text-[10px] text-red-500 hover:text-red-700">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Name" v={m.name || ""} onChange={(v) => updateMember(i, "name", v)} />
                  <F label="Role" v={m.role || ""} onChange={(v) => updateMember(i, "role", v)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
                  <textarea value={m.bio || ""} onChange={(e) => updateMember(i, "bio", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" />
                </div>
                <MediaPicker label="Photo" current={m.photo || ""} onSelect={(url) => updateMember(i, "photo", url)} />
              </div>
            ))}
            <button type="button" onClick={addMember} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors">+ Add Member</button>
          </div>
        </>)}

        {/* Content */}
        {tab === "Content" && (<>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Market Research Reports</h3>
            <p className="text-xs text-gray-500">{researchReports.length} reports</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">These appear on the homepage research section and the /research page.</p>
          <div className="space-y-4">
            {researchReports.map((r, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Report {i + 1}</span>
                  <button type="button" onClick={() => removeReport(i)} className="text-[10px] text-red-500 hover:text-red-700">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Title" v={r.title || ""} onChange={(v) => updateReport(i, "title", v)} />
                  <F label="Date" v={r.date || ""} onChange={(v) => updateReport(i, "date", v)} placeholder="e.g. April 2026" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Summary</label>
                  <textarea value={r.summary || ""} onChange={(e) => updateReport(i, "summary", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Metrics (comma-separated)</label>
                  <input value={(r.metrics || []).join(", ")} onChange={(e) => updateReport(i, "metrics", e.target.value.split(",").map(m => m.trim()))} placeholder="e.g. 12% YoY rent increase, 340 active listings" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                </div>
              </div>
            ))}
            <button type="button" onClick={addReport} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors">+ Add Report</button>
          </div>
          <hr className="border-gray-100 my-6" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Completed Projects (Carousel)</h3>
            <p className="text-xs text-gray-500">{completedProjects.length} items</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">These appear in the "OUR COMPLETED PROJECTS" carousel on the homepage.</p>
          <div className="space-y-4">
            {completedProjects.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Project {i + 1}</span>
                  <button type="button" onClick={() => removeProject("completed", i)} className="text-[10px] text-red-500 hover:text-red-700">Remove</button>
                </div>
                <F label="Title" v={p.title || ""} onChange={(v) => updateProject("completed", i, "title", v)} />
                <F label="Subtitle" v={p.subtitle || ""} onChange={(v) => updateProject("completed", i, "subtitle", v)} />
                <MediaPicker label="Image" current={p.image || ""} onSelect={(url) => updateProject("completed", i, "image", url)} />
              </div>
            ))}
            <button type="button" onClick={() => addProject("completed")} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors">+ Add Project</button>
          </div>

          <hr className="border-gray-100 my-6" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Developments In Progress (Carousel)</h3>
            <p className="text-xs text-gray-500">{developmentsProjects.length} items</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">These appear in the "OUR DEVELOPMENTS IN PROGRESS" carousel on the homepage.</p>
          <div className="space-y-4">
            {developmentsProjects.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Development {i + 1}</span>
                  <button type="button" onClick={() => removeProject("developments", i)} className="text-[10px] text-red-500 hover:text-red-700">Remove</button>
                </div>
                <F label="Title" v={p.title || ""} onChange={(v) => updateProject("developments", i, "title", v)} />
                <F label="Subtitle" v={p.subtitle || ""} onChange={(v) => updateProject("developments", i, "subtitle", v)} />
                <MediaPicker label="Image" current={p.image || ""} onSelect={(url) => updateProject("developments", i, "image", url)} />
              </div>
            ))}
            <button type="button" onClick={() => addProject("developments")} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors">+ Add Development</button>
          </div>

          <hr className="border-gray-100 my-6" />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-blue-900 mb-1">Blog Posts</h4>
            <p className="text-xs text-blue-700">Blog posts are managed at <a href="/admin/blog" className="underline font-medium">/admin/blog</a>. Latest 6 published posts appear automatically in the homepage news slider.</p>
          </div>
        </>)}

        {/* Integrations */}
        {tab === "Integrations" && (<>
          <h3 className="text-sm font-semibold text-gray-900">API Keys & Integrations</h3>
          <F label="Google Maps API Key" v={s("google_maps_key")} onChange={(v) => set("google_maps_key", v)} type="password" />
          <F label="Resend API Key (Email)" v={s("resend_api_key")} onChange={(v) => set("resend_api_key", v)} type="password" />
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">The Resend API key powers all transactional emails. Get one at <a href="https://resend.com" className="underline" target="_blank" rel="noopener noreferrer">resend.com</a>.</div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <F label="Facebook" v={s("facebook_url")} onChange={(v) => set("facebook_url", v)} />
            <F label="Instagram" v={s("instagram_url")} onChange={(v) => set("instagram_url", v)} />
            <F label="TikTok" v={s("tiktok_url")} onChange={(v) => set("tiktok_url", v)} />
            <F label="LinkedIn" v={s("linkedin_url")} onChange={(v) => set("linkedin_url", v)} />
            <F label="YouTube" v={s("youtube_url")} onChange={(v) => set("youtube_url", v)} />
            <F label="X / Twitter" v={s("twitter_url")} onChange={(v) => set("twitter_url", v)} />
          </div>
        </>)}

        {/* Email Templates */}
        {tab === "Email Templates" && (<>
          <h3 className="text-sm font-semibold text-gray-900">Email Templates</h3>
          <p className="text-xs text-gray-500">Customize the body of each email. The branded header, footer, and styling are added automatically. Use <code>{`{{name}}`}</code>, <code>{`{{role}}`}</code>, <code>{`{{propertyTitle}}`}</code> etc. as variables.</p>
          <EmailTemplateSection label="Welcome Email (on registration)" settingKey="welcome_template" settings={settings} set={set} />
          <EmailTemplateSection label="Agent Application Received" settingKey="agent_application_template" settings={settings} set={set} />
          <EmailTemplateSection label="Account Approved" settingKey="approved_template" settings={settings} set={set} />
          <EmailTemplateSection label="Account Suspended" settingKey="account_suspended_template" settings={settings} set={set} />
          <EmailTemplateSection label="Password Reset" settingKey="reset_template" settings={settings} set={set} />
          <EmailTemplateSection label="Password Changed" settingKey="password_changed_template" settings={settings} set={set} />
          <EmailTemplateSection label="New Inquiry Notification" settingKey="inquiry_template" settings={settings} set={set} />
          <EmailTemplateSection label="Application Received" settingKey="application_received_template" settings={settings} set={set} />
          <EmailTemplateSection label="Application Status Change" settingKey="application_template" settings={settings} set={set} />
          <EmailTemplateSection label="Agreement Ready" settingKey="agreement_template" settings={settings} set={set} />
          <EmailTemplateSection label="Agreement Signed" settingKey="agreement_signed_template" settings={settings} set={set} />
          <EmailTemplateSection label="Agreement Cancelled" settingKey="agreement_cancelled_template" settings={settings} set={set} />
          <EmailTemplateSection label="Listing Submitted for Review" settingKey="listing_submitted_template" settings={settings} set={set} />
          <EmailTemplateSection label="Listing Published" settingKey="listing_published_template" settings={settings} set={set} />
          <EmailTemplateSection label="Listing Rejected" settingKey="listing_rejected_template" settings={settings} set={set} />
          <EmailTemplateSection label="Verification Received" settingKey="verification_template" settings={settings} set={set} />
          <EmailTemplateSection label="Task Assigned" settingKey="task_assigned_template" settings={settings} set={set} />
          <EmailTemplateSection label="Task Status Changed" settingKey="task_status_template" settings={settings} set={set} />
          <EmailTemplateSection label="Task Comment Added" settingKey="task_comment_template" settings={settings} set={set} />
          <EmailTemplateSection label="Commission Earned" settingKey="commission_template" settings={settings} set={set} />
          <EmailTemplateSection label="Wallet Funded" settingKey="wallet_template" settings={settings} set={set} />
          <EmailTemplateSection label="Payment Receipt" settingKey="payment_template" settings={settings} set={set} />
          <EmailTemplateSection label="Withdrawal Requested" settingKey="withdrawal_requested_template" settings={settings} set={set} />
          <EmailTemplateSection label="Withdrawal Approved" settingKey="withdrawal_approved_template" settings={settings} set={set} />
          <EmailTemplateSection label="Withdrawal Rejected" settingKey="withdrawal_rejected_template" settings={settings} set={set} />
          <EmailTemplateSection label="Price Drop Alert" settingKey="price_drop_template" settings={settings} set={set} />
          <EmailTemplateSection label="New Message" settingKey="message_template" settings={settings} set={set} />
          <EmailTemplateSection label="Review Submitted" settingKey="review_submitted_template" settings={settings} set={set} />
          <EmailTemplateSection label="Review Moderated" settingKey="review_moderated_template" settings={settings} set={set} />
          <EmailTemplateSection label="Newsletter" settingKey="newsletter_template" settings={settings} set={set} />
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
              </div>
            ))}
          </div>
          <div className="mt-4">
            <a
              href="/admin/staffs"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Manage Staff &amp; Permissions
            </a>
          </div>
          <hr className="border-gray-100" />
          <h3 className="text-sm font-semibold text-gray-900">Agent Agreement</h3>
          <p className="text-xs text-gray-500">This text is shown to agents during the signup process at <code>/apply-as-agent</code>.</p>
          <RichTextArea label="Agent Terms & Conditions" value={s("agent_terms")} onChange={(v) => set("agent_terms", v)} rows={10} />
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
function MediaPicker({ label, current, onSelect }: { label: string; current: string; onSelect: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<{ id: string; url: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadImages = () => {
    setLoading(true);
    api.get<{ files: { id: string; url: string; filename: string }[] }>("/api/upload")
      .then((r) => { if (r.data?.files) setImages(r.data.files); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("https://mbpproperties.com/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        onSelect(resolveImageUrl(data.url) || data.url);
        setOpen(false);
        loadImages();
      }
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const previewUrl = resolveImageUrl(current);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input value={current} onChange={(e) => onSelect(e.target.value)} placeholder="Paste URL or pick from media" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        <button type="button" onClick={() => { setOpen(true); loadImages(); }} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">Browse</button>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">{uploading ? "..." : "Upload"}</button>
        {current && <button type="button" onClick={() => onSelect("")} className="px-2 py-2 text-xs text-red-500 hover:text-red-700" title="Remove">x</button>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      {previewUrl && <img src={previewUrl} alt="" className="h-10 mt-1 rounded border border-gray-200 object-contain" />}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Media Library</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              ) : images.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No images uploaded yet.</div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => { onSelect(resolveImageUrl(img.url) || img.url); setOpen(false); }}
                      className={`border-2 rounded-lg overflow-hidden hover:border-[var(--color-primary)] transition-colors ${current === img.url ? "border-[var(--color-primary)]" : "border-gray-200"}`}
                    >
                      <img src={resolveImageUrl(img.url) || ""} alt={img.filename} className="w-full h-24 object-cover" />
                      <p className="text-[10px] text-gray-500 p-1 truncate">{img.filename}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 mt-3 text-center">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs text-[var(--color-primary)] font-medium hover:underline">{uploading ? "Uploading..." : "Upload from computer"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

function CityManager({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("Kano State");
  const [syncing, setSyncing] = useState(false);

  const syncToDb = async () => {
    setSyncing(true);
    try {
      const r = await api.post<{ created: number; updated: number; total: number }>("/api/admin/cities/sync");
      if (r.data) alert(`Synced! ${r.data.created} created, ${r.data.updated} updated (${r.data.total} total).`);
    } catch { alert("Sync failed"); }
    setSyncing(false);
  };
  const cities = value.split(";").map(c => c.trim()).filter(Boolean).map(c => {
    const parts = c.split(",");
    return { name: parts[0]?.trim() || "", state: parts[1]?.trim() || "Kano State" };
  });

  const add = () => {
    if (!newCity.trim()) return;
    const entry = `${newCity.trim()}, ${newState.trim()}`;
    if (cities.some(c => c.name.toLowerCase() === newCity.trim().toLowerCase())) return;
    const updated = [...cities, { name: newCity.trim(), state: newState.trim() }];
    onChange(updated.map(c => `${c.name}, ${c.state}`).join("; "));
    setNewCity("");
  };

  const remove = (name: string) => {
    const updated = cities.filter(c => c.name !== name);
    onChange(updated.map(c => `${c.name}, ${c.state}`).join("; "));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
        {cities.map(c => (
          <span key={c.name} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs">
            {c.name}
            <button type="button" onClick={() => remove(c.name)} className="text-gray-400 hover:text-red-500 ml-1">&times;</button>
          </span>
        ))}
        {cities.length === 0 && <span className="text-xs text-gray-400">No cities configured</span>}
      </div>
      <div className="flex gap-2">
        <input value={newCity} onChange={e => setNewCity(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder="City name" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <input value={newState} onChange={e => setNewState(e.target.value)} placeholder="State" className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <button type="button" onClick={add} className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-medium rounded-lg hover:opacity-90">Add</button>
      </div>
      <button type="button" disabled={syncing} onClick={syncToDb} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
        {syncing ? "Syncing..." : "Sync to Database"}
      </button>
    </div>
  );
}
