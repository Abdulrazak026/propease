import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SITE_URL = "https://mbpproperties.com";

const FALLBACK_POSTS: Record<string, { title: string; excerpt: string; content: string; coverImage: string; publishedAt: string; authorName: string }> = {
  "first-time-buyers-guide": {
    title: "First-time Buyer's Guide to Kano Real Estate",
    excerpt: "Everything you need to know before buying your first home in Kano, from choosing a neighborhood to closing the deal.",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop",
    publishedAt: "2026-05-22T00:00:00Z",
    authorName: "Aisha Bello",
    content: `<p>Buying your first home in Kano is a milestone, but it can also feel like stepping into the dark. This guide walks you through the decisions that matter, in the order you actually face them.</p>

<h2>1. Decide where you want to live, not just what you want to buy</h2>
<p>People often start by looking at houses, but the neighborhood is what you'll live with for the next decade. Spend two weekends walking Tarauni, Nassarawa, Fagge, and Gwale at different times of day. Talk to the trader by the gate. Ask about water supply, drainage during the rainy season, and how far it is to the main road. The right house in the wrong area will drain you.</p>

<h2>2. Set a budget that includes the hidden costs</h2>
<p>The price of the property is not the price of buying the property. Add at least 8 to 12 percent for documentation, agency fees, title verification, and minor renovations. If you are paying in installments, ask the seller for a full payment schedule in writing and check whether the price is fixed for the entire period or subject to review.</p>

<h2>3. Verify the title before you pay a kobo</h2>
<p>In Kano, the safest titles are registered with the Kano State Land Bureau and backed by a Certificate of Occupancy. Customary land without registered title is cheaper but exposes you to disputes with traditional landowners years down the line. Always insist on a search at the Land Bureau, and budget about two to four weeks for the search to complete.</p>

<h2>4. Use an agent you can verify</h2>
<p>Walk into any of our MBPP offices and ask for an agent we have on record. We vet every agent in our network, and we publish the commission split before you commit. If an agent refuses to share the commission in writing, that is your signal to walk away.</p>

<h2>5. Get an agreement reviewed by a lawyer</h2>
<p>The agreement of sale is the most important document in the transaction. Spend the extra money to have a property lawyer review it. A one-hour review with us typically saves buyers from paying twice for the same land or losing their deposit when the deal falls through.</p>

<h2>6. Plan for the first 90 days after closing</h2>
<p>Repairs, registration, utility setup, and moving in all hit at once. Have a small buffer for surprises. New homeowners who run out of cash in the first month often have to take expensive short-term loans to fix the place they just bought.</p>

<p>Buying in Kano is not complicated, but it rewards people who slow down. The deals that fall apart are almost always the ones that moved too fast.</p>`,
  },
  "renting-vs-buying-2026": {
    title: "Renting vs Buying in 2026: What Makes More Sense?",
    excerpt: "A breakdown of the real costs, market trends, and lifestyle trade-offs of renting versus buying in Northern Nigeria.",
    coverImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop",
    publishedAt: "2026-05-10T00:00:00Z",
    authorName: "Ahmad Abubakar",
    content: `<p>There is no universally correct answer to whether you should rent or buy in 2026. The honest answer depends on how long you plan to stay, how stable your income is, and what you would do with the money if you did not tie it up in a property.</p>

<h2>The math in 2026</h2>
<p>Average rent for a 3-bedroom in middle-class Kano neighborhoods is between \u20A61.2M and \u20A62M per year. Buying the same property typically costs \u20A625M to \u20A645M, which means the price-to-rent ratio is around 18 to 25. By most global benchmarks, a ratio above 20 favors renting, and a ratio below 15 favors buying. Most of Kano sits in the gray zone.</p>

<h2>Reasons to keep renting in 2026</h2>
<ul>
<li>You might relocate within three years for work or family reasons.</li>
<li>You are building capital in a business or income-earning asset that beats property appreciation.</li>
<li>You want flexibility to switch neighborhoods as your family grows or shrinks.</li>
<li>You do not yet have 30 to 40 percent of the property price available as a down payment plus fees.</li>
</ul>

<h2>Reasons to buy in 2026</h2>
<ul>
<li>You plan to live in the same city for at least seven years.</li>
<li>Rent prices in your target neighborhood are rising 8 to 12 percent per year.</li>
<li>You have stable income and can absorb a 30 to 50 percent payment upfront.</li>
<li>You want predictable monthly housing costs rather than annual rent renewals.</li>
</ul>

<h2>The honest middle path</h2>
<p>If you can afford a small plot in a developing area and are willing to build incrementally over five years, buying land now and saving for construction often beats both renting and buying a finished home. Land in emerging parts of Kumbotso, Dawakin Kudu, and the outer Tarauni ring is still accessible for first-time buyers and tends to appreciate faster than completed houses in saturated areas.</p>

<p>If you are not sure, talk to us. We will walk you through your specific numbers without trying to sell you anything. That is what we are here for.</p>`,
  },
  "kano-neighborhood-spotlight": {
    title: "Neighborhood Spotlight: Tarauni & Nassarawa",
    excerpt: "Two of the most in-demand areas for renters in Kano Municipal. What makes them tick, and what you'll pay.",
    coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop",
    publishedAt: "2026-04-28T00:00:00Z",
    authorName: "Zahradden Aliyu",
    content: `<p>Tarauni and Nassarawa are the two neighborhoods that come up the most in conversations with renters and first-time buyers in Kano. They are close to the city center, well served by main roads, and have a mix of older family compounds and newer developments.</p>

<h2>Tarauni in 2026</h2>
<p>Tarauni is dense, lively, and affordable by central Kano standards. A 2-bedroom flat in a decent block rents for \u20A6450K to \u20A6700K per year. Water supply has improved over the last three years but is still inconsistent in pockets away from the main road. The market on Tuesday and Friday is the social center of the area and adds real value to daily life if you like walking.</p>

<h2>Nassarawa in 2026</h2>
<p>Nassarawa is split into the older Nassarawa GRA and the wider Nassarawa local government. The GRA is where most of the diplomatic and senior executive housing sits, with 4 and 5-bedroom houses at \u20A660M and up. The wider Nassarawa has more 2 and 3-bedroom flats in the \u20A6800K to \u20A61.5M annual rent range and is increasingly popular with young families.</p>

<h2>Who should pick Tarauni</h2>
<p>If you work in the city center, value a strong social fabric, and are renting on a single income, Tarauni gives you the most location for the least money. The trade-off is less space and older buildings.</p>

<h2>Who should pick Nassarawa</h2>
<p>If you have a family and prioritize school access, quieter streets, and newer construction, Nassarawa is the right fit. You will pay 30 to 50 percent more than Tarauni for a comparable size.</p>

<p>We currently list active properties in both neighborhoods. Reach out if you would like a shortlist tailored to your budget and move-in date.</p>`,
  },
  "tenant-rights-nigeria": {
    title: "Understanding Your Rights as a Tenant in Nigeria",
    excerpt: "From rent advance limits to eviction notice periods, here's what every tenant should know before signing.",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop",
    publishedAt: "2026-04-15T00:00:00Z",
    authorName: "Barr. Sulaiman Usman",
    content: `<p>Most disputes we mediate between tenants and landlords in Kano come from the same root cause: neither side reads the agreement. Below is a plain-English summary of the rights that already exist in Nigerian tenancy law.</p>

<h2>Rent advance is negotiable, not fixed</h2>
<p>There is no law that says a landlord must collect two or three years upfront. The Kano State Rent Control and the federal tenancy laws both allow for one year, two years, or any period the parties agree to. A landlord who insists on three years upfront without giving a clear discount is using scarcity to extract a premium, and that is a red flag.</p>

<h2>Notice before eviction</h2>
<p>If you have paid your rent and are not in breach, a landlord cannot lock you out or remove your belongings without a court order. The typical notice period is six months for yearly tenants and one month for monthly tenants, but the agreement can extend these. Read the notice clause carefully.</p>

<h2>Receipts for every payment</h2>
<p>Always collect a signed receipt or bank transfer confirmation for any payment, including agent fees, caution fees, and service charges. If a dispute ends in court, the receipts are your strongest evidence. We provide digital receipts through the MBPP dashboard for every transaction.</p>

<h2>Repairs and maintenance</h2>
<p>For structural issues (roof, walls, plumbing) the landlord is generally responsible. For daily wear and tear (light bulbs, door handles, painting), the tenant is. The agreement should specify who handles what, and the inspection report at move-in is the only document a court will look at when there is a dispute.</p>

<h2>What to do if you are locked out illegally</h2>
<p>Call the police immediately and file a report. Then contact a lawyer. Do not try to force your way back in. The legal process is faster than most tenants expect, especially when you have receipts and a written agreement.</p>

<p>If you are signing a new agreement or are in a dispute, our legal team offers a 30-minute consultation at no charge to anyone who lists or rents through MBPP.</p>`,
  },
};

async function getPost(slug: string) {
  const fallback = FALLBACK_POSTS[slug];
  if (fallback) {
    return {
      slug,
      title: fallback.title,
      excerpt: fallback.excerpt,
      content: fallback.content,
      coverImage: fallback.coverImage,
      publishedAt: fallback.publishedAt,
      author: { name: fallback.authorName },
    };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found | MBPP" };
  return {
    title: `${post.title} | MBPP`,
    description: post.excerpt?.slice(0, 160),
    alternates: { canonical: `${SITE_URL}/news/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt?.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="flex-1">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: post.title },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: { "@type": "Person", name: post.author?.name },
            publisher: {
              "@type": "Organization",
              name: "MBPP",
              logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
            },
          }),
        }}
      />

      <article className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <span>{post.author?.name || "MBPP Editorial"}</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
