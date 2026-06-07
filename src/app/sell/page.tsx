import Link from "next/link";
import Footer from "@/components/layout/Footer";

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
            {
              t: "Free visit",
              d: "We come to your place. No charge, no obligation.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              ),
            },
            {
              t: "Fair price",
              d: "We look at recent sales in your area and suggest a realistic price.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ),
            },
            {
              t: "We find the buyer",
              d: "We list, show, and negotiate. You sign when the deal is right.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              ),
            },
          ].map((s) => (
            <div key={s.t} className="bg-white border border-gray-200 rounded-2xl p-6 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mx-auto sm:mx-0 mb-4">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{s.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
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
