import Link from "next/link";
import Button from "@/components/ui/Button";

const benefits = [
  {
    title: "Professional Photos",
    desc: "Our ambassadors visit your property to take high-quality photos that attract serious tenants and buyers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
  {
    title: "Wide Exposure",
    desc: "Your listing reaches thousands of monthly visitors on MBPP and is shared across our social media channels.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Tenant Screening",
    desc: "We pre-screen applicants so you only deal with qualified, serious tenants ready to move in.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Digital Agreements",
    desc: "Generate legally compliant tenancy agreements with e-signatures. No paperwork, no delays.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    desc: "Rent payments and holding deposits are processed securely through Paystack with full transaction records.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Performance Dashboard",
    desc: "Track views, inquiries, and applications for your property in real time from your owner dashboard.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Contact Us", desc: "Reach out through the form below or call us. We will discuss your property and pricing." },
  { num: "02", title: "Property Visit", desc: "An MBPP ambassador visits your property to take photos, verify details, and assess the listing." },
  { num: "03", title: "Listing Goes Live", desc: "Your property is published on MBPP with photos, description, and pricing. You will get a link to share." },
  { num: "04", title: "Receive Inquiries", desc: "Interested tenants and buyers send inquiries. You can respond directly through our messaging system." },
  { num: "05", title: "Close the Deal", desc: "Once a tenant or buyer is confirmed, we help with the agreement and payment processing." },
];

export default function ListPropertyPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 text-white/80 text-[11px] font-medium tracking-wider uppercase mb-8 border border-white/10 backdrop-blur-sm">List Your Property</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Sell or Rent with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">MBPP</span>
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Kano's fastest-growing real estate marketplace. List your property and reach thousands of serious buyers and tenants.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">Why List With Us</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 tracking-tight">Everything You Need to Sell or Rent</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">We handle the hard parts so you can focus on what matters.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {benefits.map((b) => (
            <div key={b.title} className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 active:scale-[0.99] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                {b.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{b.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-24">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">How It Works</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 tracking-tight">Get Your Property Listed in 5 Steps</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-primary)]/30 via-[var(--color-primary)]/10 to-transparent md:-translate-x-px" />
            <div className="space-y-12">
              {steps.map((s, i) => (
                <div key={s.num} className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                    {s.num}
                  </div>
                  <div className={`flex-1 min-w-0 pt-2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-[var(--color-primary)]/5 via-white to-[var(--color-primary)]/5 rounded-2xl border border-[var(--color-primary)]/10 p-10 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="relative">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Ready to Get Started?</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
              Fill out the form below or call us directly. We will get back to you within 24 hours.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">Chat on WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
