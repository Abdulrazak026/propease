import Link from "next/link";
import Button from "@/components/ui/Button";

const benefits = [
  { icon: "📸", title: "Professional Photos", desc: "Our ambassadors visit your property to take high-quality photos that attract serious tenants and buyers." },
  { icon: "📢", title: "Wide Exposure", desc: "Your listing reaches thousands of monthly visitors on MBPP and is shared across our social media channels." },
  { icon: "✅", title: "Tenant Screening", desc: "We pre-screen applicants so you only deal with qualified, serious tenants ready to move in." },
  { icon: "📝", title: "Digital Agreements", desc: "Generate legally compliant tenancy agreements with e-signatures. No paperwork, no delays." },
  { icon: "💰", title: "Secure Payments", desc: "Rent payments and holding deposits are processed securely through Paystack with full transaction records." },
  { icon: "📊", title: "Performance Dashboard", desc: "Track views, inquiries, and applications for your property in real time from your owner dashboard." },
];

const steps = [
  { num: "1", title: "Contact Us", desc: "Reach out through the form below or call us. We will discuss your property and pricing." },
  { num: "2", title: "Property Visit", desc: "An MBPP ambassador visits your property to take photos, verify details, and assess the listing." },
  { num: "3", title: "Listing Goes Live", desc: "Your property is published on MBPP with photos, description, and pricing. You will get a link to share." },
  { num: "4", title: "Receive Inquiries", desc: "Interested tenants and buyers send inquiries. You can respond directly through our messaging system." },
  { num: "5", title: "Close the Deal", desc: "Once a tenant or buyer is confirmed, we help with the agreement and payment processing." },
];

export default function ListPropertyPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-[var(--color-primary)] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
            List Your Property
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Sell or Rent with <span className="text-[var(--color-accent)]">MBPP</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Kano's fastest-growing real estate marketplace. List your property and reach thousands of serious buyers and tenants.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Why List With Us</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Everything You Need to Sell or Rent</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white rounded-lg border border-gray-200 p-5">
              <span className="text-2xl mb-3 block">{b.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{b.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">How It Works</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Get Your Property Listed in 5 Steps</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white text-lg font-bold flex items-center justify-center mx-auto mb-3">
                  {s.num}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
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
  );
}
