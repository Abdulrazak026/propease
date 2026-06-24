import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | MBPP Properties",
  description: "Important disclaimers regarding the accuracy and use of information on the MBPP Properties website.",
  alternates: { canonical: "https://mbpproperties.com/disclaimer" },
};

const API = "https://mbpproperties.com";

async function getSiteName(): Promise<string> {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.settings?.site_name || "MBPP";
  } catch {
    return "MBPP";
  }
}

export default async function DisclaimerPage() {
  const brand = await getSiteName();

  return (
    <div className="flex-1 bg-white pb-20 lg:pb-0">
      <section className="bg-gray-50 py-12 sm:py-16 px-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-medium text-brand-gold uppercase tracking-wider">Legal</span>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-blue mt-2">Disclaimer</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: June 2026</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-12 text-gray-600 text-sm leading-relaxed space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">General Information</h2>
        <p>
          The information provided by {brand} on mbpproperties.com is for general informational purposes only.
          All information on the Site is provided in good faith, however we make no representation or warranty
          of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability,
          or completeness of any information on the Site.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Property Listings</h2>
        <p>
          Property listings displayed on {brand} are submitted by property owners, agents, and third-party
          contributors. {brand} does not verify the accuracy of property descriptions, pricing, availability,
          or any other information contained in listings. Prospective buyers and tenants should independently
          verify all information before entering into any agreement.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">No Professional Advice</h2>
        <p>
          The content on this website does not constitute legal, financial, or real estate professional advice.
          You should consult with qualified professionals for advice specific to your situation.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">External Links</h2>
        <p>
          The Site may contain links to external websites that are not provided or maintained by or in any way
          affiliated with {brand}. Please note that {brand} does not guarantee the accuracy, relevance,
          timeliness, or completeness of any information on these external websites.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Limitation of Liability</h2>
        <p>
          In no event shall {brand} or its affiliates be liable for any direct, indirect, consequential,
          incidental, special, or punitive damages arising out of or related to your use of the Site or any
          property transactions facilitated through the Site.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact Us</h2>
        <p>
          If you have any questions about this disclaimer, please contact us through our{" "}
          <a href="/contact" className="text-[var(--color-primary)] hover:underline">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
