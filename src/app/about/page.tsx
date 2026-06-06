"use client";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

const defaultTeam = [
  { name: "Ahmad Abubakar", role: "MD \u2014 Managing Director", bio: "Overall leadership, final approvals, capital management, investor relations, and strategic direction.", photo: "" },
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
  <section className="relative bg-[var(--color-primary)] py-24 px-4 overflow-hidden">
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-10" />
  <div className="relative max-w-3xl mx-auto text-center">
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
  About MBPP
  </span>
  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
  Making Real Estate <span className="text-[var(--color-accent)]">Simple & Accessible</span>
  </h1>
  <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
  We are on a mission to transform real estate in Northern Nigeria through technology, transparency, and local expertise.
  </p>
  </div>
  </section>

  <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
  <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-8">
  {[
  { value: "20+", label: "Verified Listings" },
  { value: "14+", label: "Cities Covered" },
  { value: "10+", label: "Agents & Staff" },
  { value: "₦30M+", label: "Revenue Generated" },
  ].map((s) => (
  <div key={s.label} className="text-center">
  <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">{s.value}</p>
  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
  </div>
  ))}
  </div>
  </section>

  <section className="max-w-5xl mx-auto px-4 py-16">
  <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
  <div>
  <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Why MBPP</span>
  <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Real estate in Kano needed a better way</h2>
  <p className="text-gray-600 leading-relaxed mb-4">
  Finding a home in Kano should not be a gamble. Too many people waste time and money on unreliable agents, fake listings, and wasted trips. We built MBPP to fix that.
  </p>
  <p className="text-gray-600 leading-relaxed mb-4">
  Our platform connects you with verified agents who know the neighborhoods. Every listing is checked. Every agent is vetted. Every transaction is tracked.
  </p>
  <p className="text-gray-600 leading-relaxed">
  Whether you are renting a flat in Kano Municipal, buying land in Tarauni, or looking for commercial space in Fagge, MBPP makes it easy.
  </p>
  </div>
  <div className="rounded-lg overflow-hidden h-80 ">
  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" alt="Luxury property in Kano" className="w-full h-full object-cover" />
  </div>
  </div>

  <div className="grid md:grid-cols-3 gap-6 mb-20">
  {[
  { icon: "🏘️", title: "Verified Properties", text: "Every listing is confirmed by local ambassadors who know the area. No fake listings, no wasted trips." },
  { icon: "👥", title: "Trusted Agents", text: "Agents are assigned by city ambassadors. Performance is tracked through our task system and commission history." },
  { icon: "💰", title: "Transparent Pricing", text: "Clear rent tiers with no hidden fees. Commission splits are visible to all parties — agents, ambassadors, and clients." },
  ].map((item) => (
  <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-6 text-center card-hover">
  <span className="text-3xl mb-3 block">{item.icon}</span>
  <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
  <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
  </div>
  ))}
  </div>

  <div className="mb-20">
  <div className="text-center mb-10">
  <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Our Team</span>
  <h2 className="text-2xl font-bold text-gray-900 mt-1">Meet the Core Team</h2>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {team.map((m) => (
  <div key={m.name} className="bg-white rounded-lg border border-gray-200 p-5 text-center card-hover">
  <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-100 flex items-center justify-center">
    {m.photo ? (
      <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-lg font-bold text-gray-400">{m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
    )}
  </div>
  <h3 className="text-base font-semibold text-gray-900">{m.name}</h3>
  <p className="text-xs text-[var(--color-primary)] font-medium mb-2">{m.role}</p>
  <p className="text-xs text-gray-500 leading-relaxed">{m.bio}</p>
  </div>
  ))}
  </div>
  </div>

  <div className="text-center bg-gray-50 rounded-3xl p-12 border border-gray-100">
  <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
  <p className="text-gray-500 max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
  To transform real estate in Northern Nigeria through technology, transparency, and local expertise. We believe everyone deserves a fair path to a home they love, and every agent deserves a platform that respects their work.
  </p>
  <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all shadow-lg shadow-[var(--color-primary)]/20">
  Get in Touch
  </Link>
  </div>
  </section>
  </div>
  );
}
