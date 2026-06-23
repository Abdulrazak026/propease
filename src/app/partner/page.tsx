import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import PdfFlipbookWrapper from "@/components/partner/PdfFlipbookWrapper";

const API = "https://mbpproperties.com";

async function getSettings() {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return (await res.json()).settings || {};
  } catch { return {}; }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Partner With Us | MBPP Real Estate Investment",
    description: "Invest in verified Nigerian real estate through MBPP's Mudarabah partnership. Minimum ₦10M, 50/50 profit sharing, professional project oversight.",
    alternates: { canonical: "https://mbpproperties.com/partner" },
  };
}

export default async function PartnerPage() {
  const s = await getSettings();
  const pdfUrl = s.partner_proposal_pdf || "";
  const whatsappRaw = s.support_whatsapp || "";
  const whatsappClean = whatsappRaw.replace(/[^0-9]/g, "");
  const whatsappLink = whatsappClean ? `https://wa.me/${whatsappClean}` : "https://wa.me/2347074222284";

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

  let teamMembers: { name: string; role: string; bio: string; photo: string }[] = defaultTeam;
  try {
    const raw = s.team_members;
    if (raw) {
      const parsed = JSON.parse(raw);
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
        teamMembers = defaultTeam.map(m => ({
          ...m,
          photo: m.photo || photosByName[normalizeName(m.name)] || "",
        }));
      }
    }
  } catch {}

  return (
    <div className="flex flex-col">
      {/* BACK LINK */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-10 pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue bg-brand-blue/10 px-3.5 py-2 rounded-lg hover:bg-brand-blue/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>

      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-10 sm:pb-14">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-2">Mudarabah Investment</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-blue leading-[1.1] tracking-tight">
            Partner With Us
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed max-w-2xl">
            Building wealth through tangible Nigerian real estate assets. Your capital. Our expertise. Solid ground.
          </p>
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6">Executive Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "₦600M", label: "MBPP Net Worth" },
            { value: "≈4%", label: "Avg Monthly Profit" },
            { value: "3–12 mo", label: "Project Cycle" },
            { value: "₦10M", label: "Min. Investment" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-brand-blue">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE REAL ESTATE VERTICALS */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6">Our Core Real Estate Activities</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { num: "01", title: "Strategic Properties Acquisition", desc: "Identify and acquire high-potential, fully verified government-allocated properties valued at ₦50 million and below." },
            { num: "02", title: "Housing Development & Construction", desc: "Development of residential units, including bungalows, terraces, duplexes, and estates, with oversight of budgeting, construction quality, and market positioning." },
            { num: "03", title: "Property Renovation & Resale", desc: "Property enhancement through renovation and resale to increase value, with target profit margins of 8%–15%." },
          ].map((item) => (
            <div key={item.num} className="bg-white border border-gray-200 rounded-xl p-5">
              <span className="text-3xl font-black text-brand-gold/30">{item.num}</span>
              <h3 className="text-base font-bold text-brand-blue mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MANAGEMENT STRUCTURE */}
      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-2 text-center">Management Structure</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Department Leads & Execution Units</p>

          {/* CEO Card */}
          {teamMembers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {teamMembers[0].photo ? (
                    <img src={teamMembers[0].photo} alt={teamMembers[0].name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    teamMembers[0].name.split(" ").map(n => n[0]).join("").slice(0, 2)
                  )}
                </div>
                <div>
                  <p className="font-bold text-brand-blue text-base">{teamMembers[0].name}</p>
                  <p className="text-xs text-brand-gold font-medium">{teamMembers[0].role}</p>
                  <p className="text-xs text-gray-500 mt-1">{teamMembers[0].bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Department Leads Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.slice(1).map((m) => (
              <div key={m.name} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-sm mb-3">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    m.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                  )}
                </div>
                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-brand-gold font-medium mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MUDARABAH STRUCTURE */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6 text-center">Mudarabah Structure</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Clear separation between capital provision, project management, profit-sharing, and performance risk.</p>

        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { icon: "💰", title: "Investor / Rabb al-Mal", desc: "Provides capital for approved real estate projects." },
            { icon: "🏗️", title: "MBPP / Mudarib", desc: "Provides expertise, due diligence, project management, and sales execution." },
            { icon: "🏠", title: "Property Assets", desc: "Land, housing development, renovation, and resale projects." },
            { icon: "📊", title: "Profit Sharing", desc: "Profit is shared after completion or sale. MBPP 50%, Investor 50%." },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-brand-blue text-sm mt-3 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Investment Lifecycle */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-brand-blue mb-4 text-center">Investment Lifecycle</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
            {[
              "Capital Pooling & Project Selection",
              "Asset Procurement & Legal Verification",
              "Development / Renovation / Value Creation",
              "Marketing & Sales",
              "Profit Realization & Distribution",
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="bg-brand-blue text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-700 ml-2 mr-2 sm:mr-0">{step}</p>
                {i < 4 && <svg className="w-4 h-4 text-gray-300 hidden sm:block mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISK MANAGEMENT & TERMS */}
      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6 text-center">Risk Management & Terms</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Roles & Management", items: ["MBPP manages all projects and final approvals", "Investors receive periodic updates", "Profits may be withdrawn monthly"] },
              { title: "Documentation & Transparency", items: ["Ownership proof and key agreements on file", "Financial summaries shared on request", "Project updates provided regularly"] },
              { title: "Risk Disclosure", items: ["Returns depend on market conditions", "Sale timing affects profits", "MBPP reduces risk through due diligence"] },
              { title: "Termination & Exit", items: ["Mutual consent or project completion", "2 months written notice required", "Clean exit process"] },
              { title: "Confidentiality", items: ["Investor data remains confidential", "Property details protected", "Confidentiality continues after exit"] },
            ].map((card) => (
              <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-brand-blue text-sm mb-3">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <svg className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6 text-center">Track Record</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { value: "2025", label: "Year Established" },
            { value: "19", label: "Properties Sold" },
            { value: "11", label: "Projects Delivered" },
            { value: "₦950M+", label: "Total Turnover" },
            { value: "0", label: "Disputed Transactions" },
            { value: "₦0", label: "Net Loss" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xl sm:text-2xl font-black text-brand-blue">{stat.value}</p>
              <p className="text-[11px] text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PDF FLIPBOOK */}
      {pdfUrl && (
        <section className="max-w-4xl mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6 text-center">Full Investment Proposal</h2>
          <PdfFlipbookWrapper url={pdfUrl} />
        </section>
      )}

      {/* CONCLUSION + CTA */}
      <section className="bg-brand-dark py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Why Invest with MBPP?</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: "100% Accountability", desc: "MBPP takes full responsibility for property verification and transaction legitimacy." },
              { title: "Technology-Driven", desc: "A dedicated property platform supports faster market access." },
              { title: "Up to 50% Profit", desc: "Attractive profit-sharing while MBPP assumes major operational risks." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-brand-gold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-brand-gold text-brand-dark text-sm font-bold rounded-full hover:bg-brand-gold-light active:scale-[0.97] transition-all">
              Contact Us on WhatsApp
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/10 transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
