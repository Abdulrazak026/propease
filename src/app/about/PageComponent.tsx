"use client";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { resolveImageUrl } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

const defaultTeam = [
  { name: "Engr. Ahmad Abubakar, PhD", role: "CEO & Managing Director", bio: "Strategic leadership & final authority. Investment management & capital control. Enterprise growth & market expansion.", photo: "" },
  { name: "Sulaiman Usman (LLB, B.L, LLM)", role: "Legal Adviser", bio: "Contract management & compliance. Oversees all legal documentation, property contracts, and regulatory compliance.", photo: "" },
  { name: "Umar Nuhu Umar", role: "Admin Officer", bio: "Executive support & corporate services. Manages day-to-day administrative operations and corporate coordination.", photo: "" },
  { name: "Engr. Tasiu Sani", role: "Sales Manager", bio: "Property marketing & client relations. Leads property marketing strategies and maintains client relationships.", photo: "" },
  { name: "Engr. Salisu Mohd Nuhu", role: "Operations Manager", bio: "Property development & asset management. Oversees property development projects and asset portfolio management.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance Manager", bio: "Accounting & budget management. Handles financial records, budgeting, and fiscal planning.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Project planning, execution & delivery. Manages construction projects from planning to completion.", photo: "" },
  { name: "Engr. Sani Umar, PhD", role: "Technology Manager", bio: "Digital platform & IT support. Manages the MBPP digital platform and technical infrastructure.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Media Manager", bio: "Corporate promotion & communications. Handles social media, marketing content, and public communications.", photo: "" },
];

export default function AboutPage() {
  const { get, loading } = useSettings();
  let team: typeof defaultTeam;
  try {
    const raw = get("team_members");
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      const normalizeName = (name: string) => name
        .replace(/^(Engr\.|Dr\.|Barr\.|Prof\.|Alh\.|Mallam)\s*/i, "")
        .replace(/\s*\(.*?\)\s*/g, "")
        .replace(/\s*(PhD|Ph\.D|LLB|B\.L|LLM|MSc|BSc|MBA)\s*/gi, "")
        .replace(/,\s*/g, "")
        .trim()
        .toLowerCase();
      const nameMapping: Record<string, string> = {
        "salisu muhammad": "engr. salisu mohd nuhu",
      };
      const photosByName: Record<string, string> = {};
      for (const m of parsed) {
        if (m.photo) {
          const normalized = normalizeName(m.name);
          photosByName[normalized] = m.photo;
          if (nameMapping[normalized]) {
            photosByName[nameMapping[normalized]] = m.photo;
          }
        }
      }
      team = defaultTeam.map(m => ({
        ...m,
        photo: m.photo || photosByName[normalizeName(m.name)] || "",
      }));
    } else {
      team = defaultTeam;
    }
  } catch {
    team = defaultTeam;
  }

  return (
    <div className="flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-10 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 bg-white/10 px-3.5 py-2 rounded-lg hover:bg-white/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>
      <section className="relative bg-gray-950 overflow-hidden">
            <div className="absolute inset-0">
          {(() => {
            const heroImg = resolveImageUrl(get("about_hero_image"));
            return heroImg ? <img src={heroImg} alt="MBPP Properties office and team in Kano" className="w-full h-full object-cover opacity-70 scale-110" /> : <div className="w-full h-full bg-gray-900 opacity-70" />;
          })()}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-gray-950/30 to-gray-950" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-5 mb-8">
              {(() => {
                const logo = get("site_logo");
                if (logo) {
                  return <img src={resolveImageUrl(logo) || ""} alt="MBPP Logo" className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl object-contain bg-white/10 p-2" />;
                }
                return (
                  <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-2xl shadow-emerald-900/40">
                    <span className="text-white font-bold text-4xl sm:text-5xl">P</span>
                  </div>
                );
              })()}
              <div>
                <p className="text-xs font-semibold text-brand-gold uppercase tracking-[0.15em] mb-2">Since 2025 · Kano &amp; Northern States</p>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight">
                  MBPP
                </h1>
                <p className="text-sm sm:text-base text-white/50 mt-1">Mutual Benefit Premier Properties</p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-xl">
              We are a Kano-based property company headquartered in Kano, serving clients across Northern Nigeria. We have been doing this since 2025.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 -mt-10 sm:-mt-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-xl shadow-gray-900/5">
          {[
            { v: "2025", l: "Founded in Kano" },
            { v: "120+", l: "Verified agents & staff" },
            { v: "₦38M", l: "Tracked monthly" },
            { v: "4 cities", l: "Across Northern Nigeria" },
          ].map((s) => (
            <div key={s.l} className="bg-white p-6 sm:p-8 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{s.v}</p>
              <p className="text-xs text-gray-500 mt-1.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">About us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Who we are, and what we do.</h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base text-gray-600 leading-relaxed">
            <p>
              We are MBPP, short for Mutual Benefit Premier Properties. We are a property company headquartered in Kano, serving clients across Northern Nigeria. We help people buy, rent, and sell houses, flats, and land. We also draw up and witness the agreements.
            </p>
            <p>
              The company was started in 2025 by Engr. Ahmad Abubakar, PhD. Before MBPP, he had bought and sold a few properties on his own and kept running into the same problems: fake listings, agents who stopped replying after taking a deposit, agreements that did not hold up when there was a dispute. MBPP is the company he wished had existed back then.
            </p>
            <p>
              We are headquartered in Kano. The office is in Kano, the team is in Kano, the agents we work with are in Kano, and the disputes we help resolve are in Kano. We also serve clients across other Northern States through our network of trusted agents and partners.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">How we work</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Three things we will not skip.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mt-12">
            {[
              { n: "01", t: "We visit every property before listing it", d: "Someone from our team goes to the property, takes the photos, and writes the description. If we have not been there, the listing does not go up." },
              { n: "02", t: "We meet every agent we work with", d: "There is no online signup. An agent joins our network through someone we already work with, and we meet them in person before they list anything." },
              { n: "03", t: "The commission split is in the deal record", d: "Agent, ambassador, and MBPP each get a line in the deal. The client can see what everyone is being paid. No side fees, no hidden extras." },
            ].map((p) => (
              <div key={p.n} className="bg-white rounded-2xl border border-gray-100 p-7">
                <p className="text-xs font-bold text-gray-300 tabular-nums mb-4">{p.n}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{p.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-[0.15em] mb-3">The team</p>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight leading-[1.15]">Nine people. One office.</h2>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Listed below in the order of who runs what. Call the office and the person who picks up can usually help, or pass you to the one who can.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-6 gap-y-10">
            {team.map((m, i) => {
              const isLead = i === 0;
              return (
                <div
                  key={m.name}
                  className={`group flex gap-4 p-3 -m-3 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-gray-900/5 hover:-translate-y-0.5 cursor-default ${
                    isLead ? "sm:col-span-2 sm:items-center bg-gradient-to-br from-brand-blue/5 to-white border border-brand-blue/10" : ""
                  }`}
                  style={{ animation: `fadeUp 0.5s ease-out ${i * 60}ms both` }}
                >
                  <div className={`shrink-0 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center font-bold text-white overflow-hidden ring-2 ring-white shadow-md shadow-gray-900/5 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-brand-blue/20 ${
                    isLead ? "w-24 h-24 sm:w-32 sm:h-32 text-lg" : "w-24 h-24 sm:w-28 sm:h-28 text-base"
                  }`}>
                    {m.photo ? (
                      <img src={resolveImageUrl(m.photo) || ""} alt={m.name} className="w-full h-full object-cover object-top" loading="lazy" />
                    ) : (
                      m.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-bold text-brand-blue leading-tight transition-colors duration-300 group-hover:text-brand-gold ${isLead ? "text-lg sm:text-xl" : "text-base"}`}>{m.name}</p>
                      {isLead && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-semibold uppercase tracking-wider">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118L10 14.347l-3.37 2.448c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.644 8.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                          Founder
                        </span>
                      )}
                    </div>
                    <p className={`text-brand-gold font-medium mb-2 mt-0.5 ${isLead ? "text-sm" : "text-xs"}`}>{m.role}</p>
                    <p className={`text-gray-500 leading-relaxed ${isLead ? "text-base" : "text-sm"}`}>{m.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="relative bg-brand-dark rounded-3xl p-10 sm:p-14 lg:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-blue/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.15]">
              Call us, or stop by the office.
            </h2>
            <p className="text-base text-gray-300 mt-5 leading-relaxed">
              We pick up the phone, and the door is open.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-brand-gold text-brand-dark text-sm font-bold rounded-full hover:bg-brand-gold-light active:scale-[0.97] transition-all">
                Get in touch
              </Link>
              <Link href="/help" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/10 transition-all">
                Visit help center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
