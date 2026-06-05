import Link from "next/link";
import Button from "@/components/ui/Button";

export default function SellPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-[var(--color-primary)] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
            Sell Your Property
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Sell Your Property with <span className="text-[var(--color-accent)]">MBPP</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Reach serious buyers in Kano. We handle the marketing, showings, and paperwork so you get the best price.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Selling with MBPP</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Get Top Dollar for Your Property</h2>
            <ul className="space-y-3">
              {[
                "Professional photography and virtual tours",
                "Targeted marketing to qualified buyers",
                "Expert price evaluation based on market data",
                "Handled viewings and negotiations",
                "Legal support through the sales process",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg overflow-hidden h-72">
            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop" alt="Sold property" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-20">
          {[
            { value: "₦50M+", label: "Properties Sold" },
            { value: "94%", label: "Of Asking Price" },
            { value: "14 days", label: "Avg. Time to Sale" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-2xl font-bold text-[var(--color-primary)]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ready to Sell?</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Fill out the form below and our team will contact you within 24 hours with a free valuation.
          </p>
          <Link href="/contact">
            <Button size="lg">Request Valuation</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
