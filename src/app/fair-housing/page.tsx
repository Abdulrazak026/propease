import Link from "next/link";

const protectedClasses = [
  "Race, colour, and ethnicity",
  "Religion and belief",
  "Sex, gender, and sexual orientation",
  "Disability and health status",
  "Family status and marital status",
  "Age",
  "National origin and place of birth",
];

export default function FairHousingPage() {
  return (
    <div className="flex-1">
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Fair Housing</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Fair Housing Guide</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            MBPP is committed to equal housing opportunity for everyone in Kano State and across Nigeria.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <div className="bg-[var(--color-primary)]/5 rounded-lg border border-[var(--color-primary)]/10 p-6 text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">EO</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Equal Housing Opportunity</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl mx-auto">
              We do not discriminate on the basis of race, colour, religion, sex, disability, familial status, or national origin.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-gray-900">Our Commitment</h2>
          <p>
            MBPP is dedicated to providing equal housing opportunities to all individuals regardless of their background. We believe that everyone deserves a fair chance to find a home they love, and we hold our agents, ambassadors, and partners to the same standard.
          </p>
          <p>
            Discrimination in housing is prohibited under the Constitution of the Federal Republic of Nigeria (1999) and relevant state laws. MBPP has a zero-tolerance policy for any form of housing discrimination on our platform.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">Protected Classes</h2>
          <p>Housing discrimination includes denying housing, setting different terms, or providing unequal service based on:</p>
          <ul className="list-disc pl-6 space-y-1">
            {protectedClasses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">What We Do</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All listings on MBPP are reviewed for discriminatory language or requirements</li>
            <li>Agents and ambassadors undergo fair housing awareness training</li>
            <li>Our platform features are accessible to users with disabilities</li>
            <li>We provide translations and support for non-English-speaking users</li>
            <li>We investigate all discrimination complaints promptly and thoroughly</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">Reporting Discrimination</h2>
          <p>
            If you believe you have experienced housing discrimination through MBPP or any property listed on our platform, please report it immediately.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-5 mt-4">
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> fairhousing@mbpp.ng</p>
              <p><strong>Phone:</strong> +234 800 000 0000</p>
              <p><strong>In Person:</strong> No. 15 Bompai Road, Kano Municipal, Kano State</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Fair Housing Resources</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[var(--color-primary)] hover:underline">Nigeria Mortgage Refinance Company (NMRC) — Fair Lending Guidelines</a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-primary)] hover:underline">Federal Ministry of Works and Housing — Tenant Rights in Nigeria</a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-primary)] hover:underline">Kano State Urban Planning and Development Authority (KNUPDA)</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
