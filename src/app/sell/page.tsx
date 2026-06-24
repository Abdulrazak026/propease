import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

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
    title: "Sell or Rent Your Property | MBPP",
    description: "List your property for rent or sale in Kano. MBPP handles visits, pricing, listing, and finding buyers or tenants. No charge, no obligation.",
    alternates: { canonical: "https://mbpproperties.com/sell" },
  };
}

export default async function SellPage() {
  const s = await getSettings();
  const whatsappRaw = s.support_whatsapp || "";
  const whatsappClean = whatsappRaw.replace(/[^0-9]/g, "");
  const whatsappMsg = encodeURIComponent("Hi! I want to list my property on MBPP.");
  const whatsappLink = whatsappClean ? `https://wa.me/${whatsappClean}?text=${whatsappMsg}` : `https://wa.me/2347074222284?text=${whatsappMsg}`;

  return (
    <div className="flex flex-col">
      {/* BACK LINK */}
      <div className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue bg-brand-blue/10 px-3.5 py-2 rounded-lg hover:bg-brand-blue/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>

      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-10 sm:pb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-blue leading-[1.1] tracking-tight">
            Sell or Rent Your Property
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed max-w-2xl">
            List your property with MBPP. We handle visits, pricing, listing, and finding buyers or tenants.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-brand-blue mb-4">How it works</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">Free visit</p>
              <p className="text-sm text-gray-600 leading-relaxed">We come to your place. No charge, no obligation.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">Fair price</p>
              <p className="text-sm text-gray-600 leading-relaxed">We look at recent sales in your area and suggest a realistic price.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">We find the buyer</p>
              <p className="text-sm text-gray-600 leading-relaxed">We list, show, and negotiate. You sign when the deal is right.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RENTAL OPTIONS */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6">Rental Options</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Option 1: Rent Only */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2.5 py-1 rounded-full">Option 1</span>
              <span className="text-xs font-medium text-gray-500">5% fee</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rent Only</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              MBPP lists and rents your property. We find the tenant, handle the agreement, and hand over to you.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Disclaimer:</strong> After handover, MBPP is not responsible for any damage or illegal activity by the tenant. Property oversight transfers to the owner.
              </p>
            </div>
          </div>

          {/* Option 2: Rent & Maintenance */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2.5 py-1 rounded-full">Option 2</span>
              <span className="text-xs font-medium text-gray-500">10% fee</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rent &amp; Maintenance</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              MBPP lists, rents, and maintains your property. We remain the overseer throughout the entire agreement period.
            </p>
            <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-lg p-3">
              <p className="text-xs text-brand-blue leading-relaxed">
                <strong>Full responsibility:</strong> MBPP remains overseer and is 100% responsible for the property during the tenancy agreement period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELLING TERMS */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-6">Selling Terms</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span><strong>MBPP Approval:</strong> All listings are subject to MBPP verification and approval before publication.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span><strong>Notification Requirement:</strong> Sellers must notify MBPP of any price changes, pending offers, or withdrawal of listing within 24 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span><strong>Commission:</strong> MBPP charges a commission on successful transactions. Rates depend on the service tier selected at listing.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <div className="relative bg-brand-dark rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl"></div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-[1.1]">List Your Property Today</h2>
          <p className="text-white/80 mt-2 text-sm leading-relaxed max-w-md mx-auto">One quick message. We&apos;ll take it from there.</p>
          <div className="mt-6">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 py-3.5 bg-brand-gold text-brand-dark text-sm font-bold rounded-full hover:bg-brand-gold-light active:scale-[0.97] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Get Started
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
