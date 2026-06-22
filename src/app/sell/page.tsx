import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Sell Your Property in Kano | MBPP",
  description: "Tell us about your property. We'll come see it, suggest a fair price, and find a buyer. No charge, no obligation.",
  alternates: { canonical: "https://mbpproperties.com/sell" },
};

export default function SellPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-10 sm:pb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            Want to sell your house?
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed max-w-2xl">
            Tell us about it. We&apos;ll come see it and give you a price. If you agree, we list it and find a buyer.
          </p>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { t: "Free visit", d: "We come to your place. No charge, no obligation." },
            { t: "Fair price", d: "We look at recent sales in your area and suggest a realistic price." },
            { t: "We find the buyer", d: "We list, show, and negotiate. You sign when the deal is right." },
          ].map((s) => (
            <div key={s.t} className="bg-white border border-gray-200 rounded-2xl p-6 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{s.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <li><strong>MBPP Approval:</strong> All listings are subject to MBPP verification and approval before publication.</li>
            <li><strong>Notification Requirement:</strong> Sellers must notify MBPP of any price changes, pending offers, or withdrawal of listing within 24 hours.</li>
            <li><strong>Commission:</strong> MBPP charges a commission on successful transactions. Rates depend on the service tier selected at listing.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <div className="relative bg-[var(--color-primary)] rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.1]">Sell with us</h2>
          <p className="text-white/85 mt-2 text-sm leading-relaxed max-w-md mx-auto">One quick call. We&apos;ll take it from there.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-[var(--color-primary)] text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
              Get started
            </Link>
            <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-all">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
