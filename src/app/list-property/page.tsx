import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function ListPropertyPage() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=900&fit=crop" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/40" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-[0.15em] mb-5">List with MBPP</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight">
              The listing that<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-200">finds the tenant.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/55 mt-6 leading-relaxed">
              We send a photographer, write the description, push it to our network, and field the first round of inquiries. You show up to viewings with a serious shortlist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-gray-950 text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
                Talk to a listing agent
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-all">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">What you get</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Six things we handle so you don&apos;t have to.
            </h2>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              We&apos;ve been doing this since 2017. Here&apos;s what we noticed every landlord ends up paying for separately — bundled into one listing fee.
            </p>
          </div>
          <div className="lg:col-span-7 divide-y divide-gray-100">
            {[
              { t: "A photographer at your door", d: "A trained ambassador visits, shoots with a wide lens, and writes the description. Most of our listings are photographed within 48 hours of you calling." },
              { t: "Distribution where tenants actually are", d: "Your property goes on MBPP, gets pushed to our Instagram and WhatsApp broadcast lists, and shows up in our weekly email to registered seekers in your city." },
              { t: "Pre-screened inquiries", d: "We ask the right questions before passing someone on. Serious tenants only — no tire-kickers calling about a 3-bedroom in Nassarawa when they need a room in Tarauni." },
              { t: "Legally sound agreements", d: "Once someone is ready, we generate a Kano-compliant tenancy agreement. E-signature, PDF copy to both parties, no printouts." },
              { t: "Paystack rent + deposit", d: "Holding deposits and the first year&apos;s rent go through Paystack. You get a clean record. No 'I sent it last week' messages." },
              { t: "An owner dashboard that doesn&apos;t lie", d: "Real-time view count, inquiry source, and viewing schedule. When a tenant asks why you picked them, the data is there." },
            ].map((b, i) => (
              <div key={i} className="py-6 first:pt-0">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-bold text-gray-300 tabular-nums shrink-0">0{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{b.t}</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{b.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3 text-center">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center leading-[1.15]">
              From the phone call to a signed agreement — usually ten days.
            </h2>
            <div className="mt-14 relative">
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gray-200 sm:-translate-x-px" />
              <div className="space-y-12">
                {[
                  { d: "Day 1", t: "You reach out", b: "Call, WhatsApp, or fill the form. We&apos;ll ask about the property, your price expectations, and when you&apos;re free for a visit." },
                  { d: "Day 2–3", t: "We visit and shoot", b: "A local ambassador comes over, takes wide-angle photos, checks the amenities, and writes the listing copy. You approve before it goes live." },
                  { d: "Day 3", t: "Listing goes live", b: "We publish on MBPP, push to Instagram and our WhatsApp broadcast, and email the registered seekers whose filters match your property." },
                  { d: "Day 4–8", t: "Inquiries and viewings", b: "We field the first round of messages and book viewings. You show up, we send reminders so no one ghosts you." },
                  { d: "Day 8–10", t: "Signed and paid", b: "Once a tenant is confirmed, we generate the agreement, collect the deposit + first rent through Paystack, and hand you a clean PDF." },
                ].map((s, i) => (
                  <div key={i} className="relative flex items-start gap-6 sm:gap-0 sm:items-stretch">
                    <div className="hidden sm:block sm:w-1/2 sm:pr-12 text-right">
                      <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{s.d}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{s.t}</p>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{s.b}</p>
                    </div>
                    <div className="absolute left-4 sm:left-1/2 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-primary)] border-4 border-gray-50 z-10" />
                    <div className="sm:hidden pl-10 flex-1">
                      <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{s.d}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{s.t}</p>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{s.b}</p>
                    </div>
                    <div className="hidden sm:block sm:w-1/2 sm:pl-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">No surprises on fees</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.15]">One listing fee. No hidden percentages later.</h2>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            We charge a flat listing fee that depends on your property type. If we don&apos;t find a tenant within 60 days, we renew the listing for free. The commission we receive from a successful tenancy is split with you — it&apos;s in the dashboard, line by line.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { t: "Studio / 1-bed", v: "₦25,000", d: "Flat listing fee. Renews free if no tenant in 60 days." },
            { t: "2–3 bedroom", v: "₦40,000", d: "Most common. Includes 8 professional photos." },
            { t: "4+ bed / commercial", v: "₦75,000+", d: "Priced per square meter. Quote on request." },
          ].map((p) => (
            <div key={p.t} className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">{p.t}</p>
              <p className="text-3xl font-bold text-gray-900 mt-3 tracking-tight">{p.v}</p>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 pb-20 sm:pb-28">
        <div className="relative bg-gray-950 rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-16">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">Got a property to list?</h2>
            <p className="text-white/60 mt-5 text-base sm:text-lg leading-relaxed">We&apos;ll come over, see the place, and give you a realistic price — no obligation. Most properties get a call back within 2 hours.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-gray-950 text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
                Book a free assessment
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-all">
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
