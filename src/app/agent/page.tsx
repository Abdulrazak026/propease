import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function AgentPage() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-primary)_0%,_transparent_55%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-accent)_0%,_transparent_45%)] opacity-15" />
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.15em] mb-5">For property managers</p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight">
                Rent collection that<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">actually happens.</span>
              </h1>
              <p className="text-base sm:text-lg text-white/55 mt-6 max-w-2xl leading-relaxed">
                Built for landlords in Kano who are tired of chasing tenants down for rent, keeping spreadsheets, and signing paper agreements. MBPP turns the messy parts into a few clicks.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-gray-950 text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all"
              >
                Sign in to dashboard
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/15 text-white hover:bg-white/5 transition-all"
              >
                Create free account
              </Link>
              <p className="text-xs text-white/40 mt-1">No card required. Free for up to 3 units.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 -mt-10 sm:-mt-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/5 p-6 sm:p-8">
          {[
            { v: "₦38M", l: "Rent tracked monthly" },
            { v: "97%", l: "On-time payment rate" },
            { v: "< 4 hrs", l: "Avg. maintenance response" },
            { v: "120+", l: "Active landlords" },
          ].map((s) => (
            <div key={s.l} className="text-center sm:text-left">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{s.v}</p>
              <p className="text-xs text-gray-500 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">The toolkit</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Four things every landlord does. We just made them faster.
            </h2>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              You don&apos;t need a CRM, a spreadsheet, and three different apps. MBPP bundles the four jobs that take up your week into one workflow.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
            {[
              { n: "01", t: "Rent collection", d: "Auto-reminders, Paystack checkout, and a ledger that updates the moment a tenant pays. No more 'I forgot' messages.", c: "bg-emerald-50 text-emerald-700" },
              { n: "02", t: "Tenant records", d: "Lease terms, ID, emergency contacts, and chat history — all on one page per tenant. Replace that Excel sheet from 2019.", c: "bg-amber-50 text-amber-700" },
              { n: "03", t: "Digital agreements", d: "Generate a Kano-compliant tenancy agreement, send it for e-signature, and store the PDF. Lawyers in your contact list optional.", c: "bg-blue-50 text-blue-700" },
              { n: "04", t: "Maintenance requests", d: "Tenants log issues in the app. You assign a contractor, track progress, and settle bills from the same screen.", c: "bg-rose-50 text-rose-700" },
            ].map((f) => (
              <div key={f.n} className="group bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 hover:border-gray-200 hover:shadow-md active:scale-[0.99] transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${f.c} text-xs font-bold mb-4`}>{f.n}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">From a landlord</p>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 tracking-tight leading-[1.25]">
              &ldquo;I used to spend two Sundays a month chasing rent and writing receipts by hand. Now I open the app on Monday, see who paid, and that&apos;s it. The rest of my week is mine.&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-white font-bold text-sm">SY</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Sani Yusuf</p>
                <p className="text-xs text-gray-500">Landlord · 6 units · Tarauni, Kano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">Set up in an afternoon. Run from your phone after that.</h2>
          </div>
          <div className="space-y-5">
            {[
              { t: "Add your properties", d: "Drop in the address, unit count, and current rent. Takes about 2 minutes per property." },
              { t: "Invite your tenants", d: "They get a text with a link. They sign in, see their balance, and can pay from any phone." },
              { t: "Get paid on the 1st", d: "Auto-reminders go out 3 days before rent is due. You'll see the deposit land before lunch." },
            ].map((s, i) => (
              <div key={i} className="flex gap-5">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">{i + 1}</div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{s.t}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="relative bg-gray-950 rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">Your portfolio. On one screen.</h2>
            <p className="text-white/60 mt-5 text-base sm:text-lg leading-relaxed">Stop juggling WhatsApp threads, paper receipts, and the bank app. Sign in and see where every naira is.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-gray-950 text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
                Sign in
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-all">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
