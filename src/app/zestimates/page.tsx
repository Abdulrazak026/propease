import Link from "next/link";

const steps = [
  { num: "1", title: "Property Details", desc: "Enter the location, type, size, and condition of the property you want valued." },
  { num: "2", title: "Market Comparison", desc: "Our algorithm compares your property against similar recently listed and transacted properties in the same neighbourhood." },
  { num: "3", title: "Price Estimate", desc: "Receive a valuation range with a confidence score based on data quality and market activity." },
  { num: "4", title: "Refine & Share", desc: "Adjust parameters, save the report, or share it with potential buyers, tenants, or agents." },
];

export default function ZestimatesPage() {
  return (
    <div className="flex-1">
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Zestimates</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Property Valuation Tool</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Get instant price estimates for any property in Kano. Powered by real listing data and local market intelligence.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">How It Works</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Know the Worth of Any Property Before You Bid</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Whether you are buying, selling, or renting, knowing the right price helps you negotiate with confidence. MBPP Zestimates uses current market data from across Kano to deliver accurate valuations.
            </p>
            <div className="space-y-4">
              {steps.map((s) => (
                <div key={s.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-80">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=500&fit=crop" alt="Property valuation" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { value: "₦50M+", label: "Properties Valued" },
            { value: "94%", label: "Accuracy Rate (within 10%)" },
            { value: "15s", label: "Average Estimate Time" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-primary)]/5 rounded-lg border border-[var(--color-primary)]/10 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Try It Now</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Get a free instant valuation on any property. No sign-up required for basic estimates.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all"
          >
            Estimate a Property
          </Link>
        </div>
      </div>
    </div>
  );
}
