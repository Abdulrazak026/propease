"use client";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { resolveImageUrl } from "@/lib/utils";

const defaultTeam = [
  { name: "Ahmad Abubakar", role: "MD — Managing Director", bio: "Overall leadership, final approvals, capital management, investor relations, and strategic direction.", photo: "" },
  { name: "Barr. Sulaiman Usman", role: "Legal Adviser", bio: "Handles land titles, contracts, legal agreements, compliance, and dispute resolution.", photo: "" },
  { name: "Umar Nuhu", role: "Admin Officer", bio: "Manages sales records, expense tracking, compliance files, and media coordination.", photo: "" },
  { name: "Tasiu Sani", role: "Source & Procurement", bio: "Responsible for property sourcing, market research, negotiations, and acquisitions.", photo: "" },
  { name: "Engr. Salisu Muhammad", role: "Operations Manager", bio: "Oversees daily field operations, client relations, and on-site coordination.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance & IT", bio: "Handles financial records, accounting support, IT systems, data management, and documentation.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Supervises construction projects, ensures quality control, monitors progress, and timely delivery.", photo: "" },
  { name: "Engr. Sani Umar", role: "Platform Manager", bio: "Manages digital platforms, online systems, and all technical/virtual operations.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Office Secretary", bio: "Administrative support, documentation, scheduling, internal coordination, and social media management.", photo: "" },
];

export default function AboutPage() {
  const { get } = useSettings();
  let team: typeof defaultTeam;
  try {
    const raw = get("team_members");
    team = raw ? JSON.parse(raw) : defaultTeam;
  } catch {
    team = defaultTeam;
  }

  return (
    <div className="flex-1">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-accent)_0%,_transparent_50%)] opacity-10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 text-white/80 text-[11px] font-medium tracking-wider uppercase mb-8 border border-white/10 backdrop-blur-sm">About MBPP</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Making Real Estate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-amber-200">Simple & Accessible</span>
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            We are on a mission to transform real estate in Northern Nigeria through technology, transparency, and local expertise.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 relative z-10 mb-20">
          {[
            { value: "20+", label: "Verified Listings" },
            { value: "14+", label: "Cities Covered" },
            { value: "10+", label: "Agents & Staff" },
            { value: "₦30M+", label: "Revenue Generated" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">Why MBPP</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">Real estate in Kano needed a better way</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>Finding a home in Kano should not be a gamble. Too many people waste time and money on unreliable agents, fake listings, and wasted trips. We built MBPP to fix that.</p>
              <p>Our platform connects you with verified agents who know the neighborhoods. Every listing is checked. Every agent is vetted. Every transaction is tracked.</p>
              <p>Whether you are renting a flat in Kano Municipal, buying land in Tarauni, or looking for commercial space in Fagge, MBPP makes it easy.</p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" alt="Luxury property in Kano" className="w-full h-80 object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[var(--color-primary)]/5 rounded-2xl -z-10" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full -z-10" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            {
              title: "Verified Properties",
              text: "Every listing is confirmed by local ambassadors who know the area. No fake listings, no wasted trips.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
            },
            {
              title: "Trusted Agents",
              text: "Agents are assigned by city ambassadors. Performance is tracked through our task system and commission history.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              ),
            },
            {
              title: "Transparent Pricing",
              text: "Clear rent tiers with no hidden fees. Commission splits are visible to all parties — agents, ambassadors, and clients.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="group bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg hover:border-gray-200 active:scale-[0.99] transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">Our Team</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 tracking-tight">Meet the Core Team</h2>
            <p className="text-gray-500 mt-2 text-sm">The people behind MBPP.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((m) => (
              <div key={m.name} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  {m.photo ? (
                    <img src={resolveImageUrl(m.photo) || ""} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">{m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 text-center">{m.name}</h3>
                <p className="text-xs text-[var(--color-primary)] font-medium text-center mb-3">{m.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed text-center">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-12 md:p-16 text-center overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--color-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[var(--color-accent)]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Our Mission</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-sm leading-relaxed">
              To transform real estate in Northern Nigeria through technology, transparency, and local expertise. We believe everyone deserves a fair path to a home they love, and every agent deserves a platform that respects their work.
            </p>
            <Link href="/contact" className="inline-flex items-center min-h-[48px] px-8 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary)]/90 active:scale-[0.97] transition-all shadow-lg shadow-[var(--color-primary)]/20">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
