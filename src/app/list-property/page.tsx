"use client";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";

export default function ListPropertyPage() {
  const { get: g } = useSettings();
  const whatsapp = (g("support_whatsapp") || "2348000000000").replace(/[^0-9]/g, "");
  return (
    <div className="flex flex-col">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Put your house on MBPP.
            </h1>
            <p className="text-base text-gray-600 mt-4 leading-relaxed max-w-xl">
              Three steps. We help you with the rest.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              n: "1",
              t: "Tell us about it",
              d: "House, flat, or land? How many rooms? Where in Kano? Takes 2 minutes.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
              ),
            },
            {
              n: "2",
              t: "We come take photos",
              d: "A local ambassador visits, shoots wide photos, and writes the description. You approve before it goes public.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
              ),
            },
            {
              n: "3",
              t: "We find a tenant",
              d: "Your place shows up in search, our emails, and WhatsApp broadcasts. We screen the calls so you only meet serious people.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              ),
            },
          ].map((s) => (
            <div key={s.n} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <p className="text-xs font-bold text-[var(--color-primary)] mb-1">Step {s.n}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{s.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center mb-10">What it costs</h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { t: "1 bedroom", v: "₦25,000" },
              { t: "2–3 bedroom", v: "₦40,000" },
              { t: "4+ bedroom", v: "₦75,000+" },
            ].map((p) => (
              <div key={p.t} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{p.t}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{p.v}</p>
                <p className="text-xs text-gray-500 mt-1">flat fee</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6 max-w-md mx-auto">
            No tenant in 60 days? Renews free.
          </p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="relative bg-[var(--color-primary)] rounded-3xl overflow-hidden p-8 sm:p-12 text-center sm:text-left">
          <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
            <div className="max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.1]">Start now. It&apos;s free.</h2>
              <p className="text-white/85 mt-2 text-sm leading-relaxed">Tell us about your place. We&apos;ll come see it within 2 days.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <Link href="/register" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-[var(--color-primary)] text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
                Get started
              </Link>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-all">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
