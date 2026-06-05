import Link from "next/link";
import Button from "@/components/ui/Button";

const articles = [
  {
    date: "28 May 2026",
    title: "Kano Property Market Sees 15% Growth in Q1 2026",
    excerpt: "Residential property values across Kano Municipal, Fagge, and Tarauni have risen sharply driven by urban migration and new infrastructure projects.",
    category: "Market Report",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  },
  {
    date: "20 May 2026",
    title: "MBPP Launches Digital Rent Agreements for Tenants",
    excerpt: "New e-signature feature allows tenants and landlords to complete legally binding tenancy agreements entirely online without physical paperwork.",
    category: "Platform Update",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
  },
  {
    date: "12 May 2026",
    title: "Understanding Rent Tiers in Kano: A Complete Guide",
    excerpt: "From budget-friendly flats in Fagge to premium homes in Kano Municipal, here is what you can expect at every price point.",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
  },
  {
    date: "5 May 2026",
    title: "New Agent Training Program Launches in June",
    excerpt: "MBPP introduces a certified training programme for new agents covering property law, customer service, and platform tools.",
    category: "Community",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
  },
  {
    date: "28 April 2026",
    title: "Tarauni District Development: What It Means for Renters",
    excerpt: "New road networks and commercial centres in Tarauni are making the district one of Kano's most attractive rental markets.",
    category: "Market Report",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop",
  },
  {
    date: "15 April 2026",
    title: "How MBPP Verifies Every Property Listing",
    excerpt: "Behind the scenes of our verification process — from ambassador site visits to photo authentication and document checks.",
    category: "Platform Update",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  },
  {
    date: "2 April 2026",
    title: "Renting vs Buying in Kano: Which Is Right for You?",
    excerpt: "An honest breakdown of the costs, benefits, and trade-offs of renting versus buying property in Kano State.",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
  },
  {
    date: "20 March 2026",
    title: "MBPP Partners with Local Banks for Rent Financing",
    excerpt: "New partnership enables tenants to pay rent in monthly instalments through partner banks, reducing upfront cost burden.",
    category: "Community",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
  },
];

const categories = ["All", "Market Report", "Platform Update", "Guide", "Community"];

export default function NewsPage() {
  return (
    <div className="flex-1">
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">News</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Latest Updates</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            News, guides, and market insights from the MBPP team.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {articles.map((article) => (
            <div key={article.title} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
              <div className="h-40 overflow-hidden">
                <img src={article.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-[var(--color-primary)] uppercase tracking-wider">{article.category}</span>
                  <span className="text-[10px] text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{article.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{article.excerpt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline">Load More Articles</Button>
        </div>
      </div>
    </div>
  );
}
