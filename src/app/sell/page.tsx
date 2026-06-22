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
  const s = await getSettings();
  return {
    title: "Partner with MBPP | Rent or Sell Your Property",
    description: "List your property for rent or sale in Kano. MBPP handles visits, pricing, listing, and finding buyers or tenants. No charge, no obligation.",
    alternates: { canonical: "https://mbpproperties.com/sell" },
  };
}

export default async function SellPage() {
  const s = await getSettings();
  const whatsappRaw = s.support_whatsapp || "";
  const whatsappClean = whatsappRaw.replace(/[^0-9]/g, "");
  const whatsappLink = whatsappClean ? `https://wa.me/${whatsappClean}` : "https://wa.me/2348000000000";

  return (
    <div className="flex flex-col">
      {/* BACK LINK */}
      <div className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>

      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-10 sm:pb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            Partner with MBPP
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed max-w-2xl">
            List your property for rent or sale. We handle visits, pricing, listing, and finding buyers or tenants.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — Single Tile */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How it works</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-gray-900 text-sm mb-1">Free visit</p>
              <p className="text-sm text-gray-600 leading-relaxed">We come to your place. No charge, no obligation.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm mb-1">Fair price</p>
              <p className="text-sm text-gray-600 leading-relaxed">We look at recent sales in your area and suggest a realistic price.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm mb-1">We find the buyer</p>
              <p className="text-sm text-gray-600 leading-relaxed">We list, show, and negotiate. You sign when the deal is right.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RENTAL OPTIONS */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Rental Options</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Option 1: Rent Only */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">Option 1</span>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">Option 2</span>
              <span className="text-xs font-medium text-gray-500">10% fee</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rent &amp; Maintenance</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              MBPP lists, rents, and maintains your property. We remain the overseer throughout the entire agreement period.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs text-emerald-800 leading-relaxed">
                <strong>Full responsibility:</strong> MBPP remains overseer and is 100% responsible for the property during the tenancy agreement period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS & CONDITIONS */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Terms &amp; Conditions</h3>
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <li><strong>MBPP Approval:</strong> All listings are subject to MBPP verification and approval before publication.</li>
            <li><strong>Notification Requirement:</strong> Sellers must notify MBPP of any price changes, pending offers, or withdrawal of listing within 24 hours.</li>
            <li><strong>Commission:</strong> MBPP charges a commission on successful transactions. Rates depend on the service tier selected at listing.</li>
            <li><strong>Rent Only (Option 1):</strong> After handover to the tenant, MBPP is not responsible for any damage to the property or illegal activity carried out by the tenant.</li>
            <li><strong>Rent &amp; Maintenance (Option 2):</strong> MBPP remains the overseer of the property and is 100% responsible for the property throughout the duration of the tenancy agreement.</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <div className="relative bg-[var(--color-primary)] rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.1]">Sell or Rent with us</h2>
          <p className="text-white/85 mt-2 text-sm leading-relaxed max-w-md mx-auto">One quick call. We&apos;ll take it from there.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-[var(--color-primary)] text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
              Get started
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-all">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
