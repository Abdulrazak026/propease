"use client";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { resolveImageUrl } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

const defaultTeam = [
  { name: "Ahmad Abubakar", role: "Managing Director", bio: "Started MBPP in 2017 after buying and selling three properties the hard way. Now he focuses on capital, partnerships, and making sure the company doesn't lose its soul as it grows.", photo: "" },
  { name: "Barr. Sulaiman Usman", role: "Legal Adviser", bio: "Twenty years in Kano property law. He reads the contracts the rest of us skip, and he's the reason our agreements have held up in every dispute we've seen.", photo: "" },
  { name: "Umar Nuhu", role: "Admin Officer", bio: "The person who actually keeps the lights on. Sales records, expense tracking, the filing cabinet nobody else wants to touch — that's Umar.", photo: "" },
  { name: "Tasiu Sani", role: "Source & Procurement", bio: "Walks neighborhoods we haven't listed in yet. If a property is about to come up for sale, Tasiu usually knows before the sign goes up.", photo: "" },
  { name: "Engr. Salisu Muhammad", role: "Operations Manager", bio: "Runs the ambassador network. Every field agent, every photographer, every viewing — coordinated from his desk or in person.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance & IT", bio: "Keeps the books honest and the servers up. If you've ever gotten a payout on time, you have Abdulmalik to thank.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Our newest construction and renovation lead. If you're buying off-plan through us, Zahradden is the one making sure they actually build it.", photo: "" },
  { name: "Engr. Sani Umar", role: "Platform Manager", bio: "Built the search, the filters, the owner dashboard. If something on the site works well, Sani probably wrote it. If it doesn't, he's already on it.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Office Secretary", bio: "The first voice you hear when you call. Ahmad runs scheduling, internal coordination, and our social media — the latter he does better than any of us expected.", photo: "" },
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
    <div className="flex flex-col">
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src={resolveImageUrl(get("about_hero_image")) || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop"} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/80 to-gray-950" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em] mb-5">Since 2017 · Kano</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight">
              We started because<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">renting in Kano was broken.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/55 mt-6 leading-relaxed">
              Fake listings. Agents who disappear after the first deposit. Agreements written on a serviette. We&apos;d been burned ourselves, so we built the marketplace we wished we&apos;d had.
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
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">Our story</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">From a WhatsApp group to a platform.</h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-base text-gray-600 leading-relaxed">
            <p>
              MBPP started as a side project in 2017. Our founder had just sold a duplex in Nassarawa and lost a chunk of the proceeds to an agent who turned out to be working three other buyers. He posted a single message in a Kano real estate WhatsApp group asking who&apos;d had a similar experience. Forty people replied the same day.
            </p>
            <p>
              We started with a Google Form and a shared spreadsheet. The first year, we listed 12 properties by hand, photographed them with a phone, and matched them with tenants from our personal networks. The second year, 80 properties. The third, we had to hire.
            </p>
            <p>
              Today we&apos;re a registered property company in Kano with a small, tight team. We don&apos;t pretend to be a national platform — Kano is what we know, and Kano is what we do well. The agents in our network live in the neighborhoods they list. The agreements we draw up have been tested in Kano courts. The support number is answered by someone in Kano.
            </p>
            <p>
              That&apos;s the whole pitch. We&apos;re local, we&apos;re accountable, and we&apos;d rather do fewer things properly than be everywhere and do them badly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">What we stand for</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Three commitments we don&apos;t bend on.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mt-12">
            {[
              { n: "01", t: "If we list it, we&apos;ve seen it", d: "Every property on MBPP has been visited by a local ambassador. No scraped photos, no copy-paste descriptions, no 'call for details' on a 4-bedroom asking ₦8M." },
              { n: "02", t: "If we represent an agent, we&apos;ve met them", d: "Our ambassador network is personal. We know who they are, where they operate, and how they close. If something goes sideways, we&apos;re the ones you call — not a bot." },
              { n: "03", t: "If we take a commission, you can see it", d: "The split is in the dashboard. Agent, ambassador, MBPP — all three lines visible to the parties who paid and received. No mystery percentages." },
            ].map((p) => (
              <div key={p.n} className="bg-white rounded-2xl border border-gray-100 p-7">
                <p className="text-xs font-bold text-gray-300 tabular-nums mb-4">{p.n}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug" dangerouslySetInnerHTML={{ __html: p.t }} />
                <p className="text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: p.d }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">The team</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Nine people. One office. All reachable.</h2>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              We&apos;re intentionally small. The agent who lists your property is two calls away from the legal adviser and one floor away from the platform engineer. Decisions happen in person, not in Jira.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-6 gap-y-8">
            {team.map((m) => (
              <div key={m.name} className="flex gap-4">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-base font-bold text-gray-500 overflow-hidden">
                  {m.photo ? (
                    <img src={resolveImageUrl(m.photo) || ""} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    m.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-[var(--color-primary)] font-medium mb-2">{m.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-3xl border border-emerald-100 p-10 sm:p-14 lg:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Got a property? Got a question? Either way — call us.
            </h2>
            <p className="text-base text-gray-600 mt-5 leading-relaxed">
              We&apos;d rather spend an hour on the phone with you than lose you to a bad experience. Real estate is a people business and we&apos;re not too cool to admit it.
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
