"use client";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { resolveImageUrl } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

const defaultTeam = [
  { name: "Ahmad Abubakar", role: "Managing Director", bio: "Started MBPP in 2017 after buying and selling three properties the hard way. Now he focuses on capital, partnerships, and making sure the company doesn't lose its soul as it grows.", photo: "" },
  { name: "Barr. Sulaiman Usman", role: "Legal Adviser", bio: "Twenty years in Kano property law. He reads the contracts the rest of us skip, and he's the reason our agreements have held up in every dispute we've seen.", photo: "" },
  { name: "Engr. Salisu Muhammad", role: "Operations Manager", bio: "Runs the ambassador network. Every field agent, every photographer, every viewing, coordinated from his desk or in person.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance & IT", bio: "Keeps the books honest and the servers up. If you've ever gotten a payout on time, you have Abdulmalik to thank.", photo: "" },
  { name: "Tasiu Sani", role: "Source & Procurement", bio: "Walks neighborhoods we haven't listed in yet. If a property is about to come up for sale, Tasiu usually knows before the sign goes up.", photo: "" },
  { name: "Engr. Sani Umar", role: "Platform Manager", bio: "Built the search, the filters, the owner dashboard. If something on the site works well, Sani probably wrote it. If it doesn't, he's already on it.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Our newest construction and renovation lead. If you're buying off-plan through us, Zahradden is the one making sure they actually build it.", photo: "" },
  { name: "Umar Nuhu", role: "Admin Officer", bio: "The person who actually keeps the lights on. Sales records, expense tracking, the filing cabinet nobody else wants to touch. That's Umar.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Office Secretary", bio: "The first voice you hear when you call. Ahmad runs scheduling, internal coordination, and our social media. He does the latter better than any of us expected.", photo: "" },
];

export default function AboutPage() {
  const { get, loading } = useSettings();
  let team: typeof defaultTeam;
  try {
    const raw = get("team_members");
    const parsed = raw ? JSON.parse(raw) : null;
    const defaultsByName: Record<string, (typeof defaultTeam)[number]> = {};
    for (const m of defaultTeam) defaultsByName[m.name] = m;
    if (Array.isArray(parsed) && parsed.length > 0) {
      team = parsed.map((m: (typeof defaultTeam)[number]) => ({
        ...m,
        photo: m.photo || defaultsByName[m.name]?.photo || "",
        bio: m.bio || defaultsByName[m.name]?.bio || "",
        role: m.role || defaultsByName[m.name]?.role || "",
      }));
    } else {
      team = defaultTeam;
    }
  } catch {
    team = defaultTeam;
  }

  return (
    <div className="flex flex-col">
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          {(() => {
            const heroImg = resolveImageUrl(get("about_hero_image"));
            return heroImg ? <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" /> : <div className="w-full h-full bg-gray-900 opacity-30" />;
          })()}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/80 to-gray-950" />
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
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em] mb-2">Since 2017 · Kano</p>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight">
                  MBPP
                </h1>
                <p className="text-sm sm:text-base text-white/50 mt-1">Mutual Benefit Premier Properties</p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-xl">
              We are a small property company. We work in Kano. We have been doing this since 2017.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 -mt-10 sm:-mt-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-xl shadow-gray-900/5">
          {[
            { v: "2017", l: "Founded in Kano" },
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
              We are MBPP, short for Mutual Benefit Premier Properties. We are a property company in Kano. We help people buy, rent, and sell houses, flats, and land. We also draw up and witness the agreements.
            </p>
            <p>
              The company was started in 2017 by Ahmad Abubakar. Before MBPP, he had bought and sold a few properties on his own and kept running into the same problems: fake listings, agents who stopped replying after taking a deposit, agreements that did not hold up when there was a dispute. MBPP is the company he wished had existed back then.
            </p>
            <p>
              We only work in Kano. The office is in Kano, the team is in Kano, the agents we work with are in Kano, and the disputes we help resolve are in Kano. If a client needs help outside the city, we point them to another agent we already know rather than try to handle it from a distance.
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

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">The team</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Nine people. One office.</h2>
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
                    isLead ? "sm:col-span-2 sm:items-center bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100/60" : ""
                  }`}
                  style={{ animation: `fadeUp 0.5s ease-out ${i * 60}ms both` }}
                >
                  <div className={`shrink-0 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 overflow-hidden ring-2 ring-white shadow-md shadow-gray-900/5 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/20 ${
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
                      <p className={`font-semibold text-gray-900 leading-tight transition-colors duration-300 group-hover:text-[var(--color-primary)] ${isLead ? "text-lg sm:text-xl" : "text-base"}`}>{m.name}</p>
                      {isLead && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-semibold uppercase tracking-wider">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118L10 14.347l-3.37 2.448c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.644 8.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                          Founder
                        </span>
                      )}
                    </div>
                    <p className={`text-[var(--color-primary)] font-medium mb-2 mt-0.5 ${isLead ? "text-sm" : "text-xs"}`}>{m.role}</p>
                    <p className={`text-gray-500 leading-relaxed ${isLead ? "text-base" : "text-sm"}`}>{m.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-3xl border border-emerald-100 p-10 sm:p-14 lg:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Call us, or stop by the office.
            </h2>
            <p className="text-base text-gray-600 mt-5 leading-relaxed">
              We pick up the phone, and the door is open.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-gray-950 text-white text-sm font-semibold rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all">
                Get in touch
              </Link>
              <Link href="/help" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-gray-200 text-gray-700 hover:bg-white transition-all">
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
