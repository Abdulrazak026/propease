import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex-1">
      <section className="bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-light)] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Making Real Estate <span className="text-[var(--color-accent)]">Simple & Accessible</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            PropEase connects property seekers with verified agents across Kano. We are building the most trusted real estate platform in Northern Nigeria.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why PropEase?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Finding a home in Kano should not be a gamble. Too many people waste time and money on unreliable agents, fake listings, and wasted trips. We built PropEase to fix that.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our platform connects you with verified agents who know the neighborhoods. Every listing is checked. Every agent is vetted. Every transaction is tracked.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are renting a flat in Kano Municipal, buying land in Tarauni, or looking for commercial space in Fagge, PropEase makes it easy.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <p className="text-sm">Kano City Skyline</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: "🏘️", title: "Verified Properties", text: "Every listing is confirmed by local ambassadors who know the area. No fake listings, no wasted trips." },
            { icon: "👥", title: "Trusted Agents", text: "Agents are assigned by city ambassadors. Performance is tracked through our task system." },
            { icon: "💰", title: "Transparent Pricing", text: "Clear rent tiers, no hidden fees. Commission splits are visible to all parties." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm text-center">
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            To transform real estate in Northern Nigeria through technology, transparency, and local expertise. We believe everyone deserves a fair path to a home they love.
          </p>
          <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all shadow-lg shadow-[var(--color-primary)]/20">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
