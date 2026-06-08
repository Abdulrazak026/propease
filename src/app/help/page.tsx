"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";

const TOPICS = [
  {
    title: "Getting started",
    desc: "Account setup, first search, saving listings.",
    items: [
      "How do I create an account on MBPP?",
      "Do I need an account to browse properties?",
      "How do I save a listing I like?",
      "Can I get email alerts when new properties match my search?",
    ],
  },
  {
    title: "For tenants",
    desc: "Viewings, agreements, paying rent.",
    items: [
      "How do I book a viewing?",
      "Is there a fee to use MBPP as a tenant?",
      "What does the tenancy agreement cover?",
      "How do I pay rent and deposit?",
    ],
  },
  {
    title: "For landlords",
    desc: "Listing, photography, payouts, taxes.",
    items: [
      "How much does it cost to list a property?",
      "Who takes the photos?",
      "How and when do I get paid?",
      "Do you handle tax documentation?",
    ],
  },
  {
    title: "For agents & ambassadors",
    desc: "Joining the network, commissions, training.",
    items: [
      "How do I become an MBPP ambassador?",
      "What&apos;s the commission split?",
      "Do I need a real estate license?",
      "What training do you provide?",
    ],
  },
  {
    title: "Account & security",
    desc: "Passwords, two-factor, deleting your account.",
    items: [
      "I forgot my password. How do I reset it?",
      "How do I enable two-factor authentication?",
      "How do I delete my account?",
      "Is my personal data shared with anyone?",
    ],
  },
  {
    title: "Payments & disputes",
    desc: "Paystack, refunds, holding deposits.",
    items: [
      "Is my payment information secure?",
      "What happens if a deal falls through?",
      "How do refunds work?",
      "I had a problem with a transaction. Who do I contact?",
    ],
  },
];

const TOPIC_ICONS: Record<string, ReactNode> = {
  "Getting started": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>
  ),
  "For tenants": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" /></svg>
  ),
  "For landlords": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
  ),
  "For agents & ambassadors": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
  ),
  "Account & security": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
  ),
  "Payments & disputes": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>
  ),
};

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const { get: g } = useSettings();
  const whatsapp = (g("support_whatsapp") || "2348000000000").replace(/[^0-9]/g, "");
  const phone = (g("support_phone") || "+2348000000000").replace(/[^0-9+]/g, "");
  const email = g("support_email", "support@mbpproperties.com");
  const hours = g("business_hours", "Mon-Fri 8AM-6PM");
  const heroImage = g("hero_image") || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=900&fit=crop";

  const q = query.toLowerCase().trim();
  const filteredTopics = q
    ? TOPICS.map(t => ({
        ...t,
        items: t.items.filter(i => i.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)),
      })).filter(t => t.items.length > 0)
    : TOPICS;

  return (
    <div className="flex flex-col">
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/80 to-gray-950" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold text-sky-300 uppercase tracking-[0.15em] mb-5">Help center</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.02] tracking-tight">
              How can we help?
            </h1>
            <p className="text-base sm:text-lg text-white/55 mt-5 leading-relaxed">
              Search 60+ articles, browse common topics, or message the team. We answer most messages in under an hour during business hours.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for anything…"
                  className="w-full min-h-[60px] pl-14 pr-5 py-4 rounded-full bg-white text-gray-900 placeholder-gray-400 text-base shadow-2xl shadow-gray-900/30 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/40">
              <span>Popular:</span>
              {["Book a viewing", "Listing fees", "Pay rent", "Reset password"].map((tag) => (
                <button key={tag} onClick={() => setQuery(tag)} className="text-white/70 hover:text-white transition-colors underline underline-offset-4">{tag}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">Browse by topic</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Everything we&apos;ve been asked, in one place.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {filteredTopics.map((t) => (
            <div key={t.title} className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-900/5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/8 text-[var(--color-primary)] flex items-center justify-center mb-5">
                {TOPIC_ICONS[t.title] || TOPIC_ICONS["Getting started"]}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{t.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{t.desc}</p>
              <div className="space-y-2">
                {t.items.slice(0, q ? t.items.length : 3).map((item) => (
                  <a key={item} href="#" className="flex items-start gap-2 text-sm text-gray-700 hover:text-[var(--color-primary)] transition-colors group">
                    <span className="text-gray-300 group-hover:text-[var(--color-primary)] transition-colors mt-0.5">→</span>
                    <span className="leading-snug">{item}</span>
                  </a>
                ))}
              </div>
              {!q && t.items.length > 3 && (
                <button onClick={() => setOpenTopic(openTopic === t.title ? null : t.title)} className="mt-4 text-xs font-semibold text-[var(--color-primary)] hover:underline">
                  {openTopic === t.title ? "Show less" : `See all ${t.items.length} articles`}
                </button>
              )}
              {!q && openTopic === t.title && (
                <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                  {t.items.slice(3).map((item) => (
                    <a key={item} href="#" className="flex items-start gap-2 text-sm text-gray-700 hover:text-[var(--color-primary)] transition-colors group">
                      <span className="text-gray-300 group-hover:text-[var(--color-primary)] transition-colors mt-0.5">→</span>
                      <span className="leading-snug">{item}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {filteredTopics.length === 0 && (
          <div className="mt-12 text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-600">No results for &quot;<span className="font-semibold text-gray-900">{query}</span>&quot;.</p>
            <p className="text-xs text-gray-500 mt-2">Try a different keyword, or message us directly below.</p>
          </div>
        )}
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">Still stuck?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Talk to a real person.</h2>
              <p className="text-base text-gray-600 mt-4 leading-relaxed">
                Our team is in the office Mon–Fri, 8am to 6pm, and Sat 10am to 2pm. WhatsApp gets the fastest response, but we also pick up the phone and reply to email.
              </p>
              <div className="mt-8 space-y-4">
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">WhatsApp us</p>
                    <p className="text-sm text-gray-500 mt-0.5">Average response: 12 minutes during business hours.</p>
                  </div>
                </a>
                <a href={`tel:${phone}`} className="flex items-start gap-4 group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">Call us</p>
                    <p className="text-sm text-gray-500 mt-0.5">{phone} · {hours}.</p>
                  </div>
                </a>
                <a href={`mailto:${email}`} className="flex items-start gap-4 group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">Email us</p>
                    <p className="text-sm text-gray-500 mt-0.5">{email} · Replies within 4 business hours.</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl shadow-gray-900/5">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop" alt="MBPP support team" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-5 max-w-[240px]">
                <div className="flex items-center gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-900">&quot;They picked up on a Saturday. Fixed my listing in 20 minutes.&quot;</p>
                <p className="text-xs text-gray-500 mt-2">Maryam I., Landlord</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="relative bg-gray-950 rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-[1.15]">Still can&apos;t find what you need?</h2>
            <p className="text-white/55 mt-4 text-base leading-relaxed">Send a message and we&apos;ll point you in the right direction, usually within a few hours.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-gray-950 text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
                Send a message
              </Link>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-all">
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
