import Link from "next/link";

const reports = [
  {
    title: "Kano Residential Market Report — Q1 2026",
    date: "April 2026",
    summary: "Average rents rose 12% year-on-year across Kano Municipal. Tarauni and Nassarawa saw the highest demand for 2-bedroom flats.",
    metrics: ["12% YoY rent increase", "340 active listings", "4.2 avg days on market", "₦850K avg annual rent"],
  },
  {
    title: "Northern Nigeria Real Estate Outlook 2026",
    date: "January 2026",
    summary: "Comprehensive analysis of property trends across Kano, Kaduna, and Katsina states including urban migration patterns and infrastructure impact.",
    metrics: ["6 states covered", "2,100+ data points", "15 city districts", "3-year forecast"],
  },
  {
    title: "Rental Affordability Index — Kano State",
    date: "March 2026",
    summary: "How rent-to-income ratios vary across Kano's eight local government areas. Fagge remains the most affordable district for young professionals.",
    metrics: ["28% avg rent-to-income", "₦180K median salary", "8 LGAs analysed", "5 property types"],
  },
  {
    title: "Commercial Property Trends in Kano",
    date: "February 2026",
    summary: "Demand for retail and office space is shifting toward the new Kano City Centre development. Industrial space in Fagge remains undersupplied.",
    metrics: ["22% vacancy rate", "₦2.1M avg annual rent", "3 new developments", "+8% commercial growth"],
  },
];

export default function ResearchPage() {
  return (
    <div className="flex-1">
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Research</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Market Research</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Data-driven insights into the Kano real estate market — powered by MBPP transaction data and local surveys.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report.title} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">{report.title}</h2>
                <span className="text-xs text-gray-400 shrink-0 ml-4">{report.date}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{report.summary}</p>
              <div className="flex flex-wrap gap-2">
                {report.metrics.map((m) => (
                  <span key={m} className="px-3 py-1 bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-xs font-medium rounded-full">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Request Custom Research</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Need data on a specific neighbourhood, property type, or price range? Our team can prepare a tailored report.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all"
          >
            Request Report
          </Link>
        </div>
      </div>
    </div>
  );
}
