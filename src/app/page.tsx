"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters from "@/components/listings/PropertyFilters";
import { useListings } from "@/hooks/useListings";
import { EmptyState } from "@/components/ui/Skeleton";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";
import SoldPropertiesGallery from "@/components/listings/SoldPropertiesGallery";

interface City { id: string; name: string; }
interface BlogPost { id: string; slug: string; title: string; excerpt?: string | null; content?: string | null; coverImage: string | null; publishedAt: string | null; author?: { name: string } | null; }
interface ResearchReport { title: string; date: string; summary: string; metrics: string[]; }

const INITIAL_SHOW = 6;
const LOAD_MORE = 6;

const CATEGORY_PILLS = [
  { label: "All", value: "" },
  { label: "Houses", value: "house" },
  { label: "Flats", value: "flat" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
];

const FALLBACK_POSTS = [
  { id: "f1", slug: "first-time-buyers-guide", title: "First-time Buyer's Guide to Kano Real Estate", excerpt: "Everything you need to know before buying your first home in Kano, from choosing a neighborhood to closing the deal.", coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop", publishedAt: "2026-05-22T00:00:00Z", author: { name: "Aisha Bello" } },
  { id: "f2", slug: "renting-vs-buying-2026", title: "Renting vs Buying in 2026: What Makes More Sense?", excerpt: "A breakdown of the real costs, market trends, and lifestyle trade-offs of renting versus buying in Northern Nigeria.", coverImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop", publishedAt: "2026-05-10T00:00:00Z", author: { name: "Ahmad Abubakar" } },
  { id: "f3", slug: "kano-neighborhood-spotlight", title: "Neighborhood Spotlight: Tarauni & Nassarawa", excerpt: "Two of the most in-demand areas for renters in Kano Municipal. What makes them tick, and what you'll pay.", coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop", publishedAt: "2026-04-28T00:00:00Z", author: { name: "Zahradden Aliyu" } },
  { id: "f4", slug: "tenant-rights-nigeria", title: "Understanding Your Rights as a Tenant in Nigeria", excerpt: "From rent advance limits to eviction notice periods, here's what every tenant should know before signing.", coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop", publishedAt: "2026-04-15T00:00:00Z", author: { name: "Barr. Sulaiman Usman" } },
];

export default function HomePage() {
  const { get: getSetting } = useSettings();
  const heroImage = getSetting("hero_image") || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=900&fit=crop";
  const siteName = getSetting("site_name", "MBPP");
  const siteTagline = getSetting("site_tagline", "Find Your Dream Property in Kano");
  const heroRef = useRef<HTMLElement>(null);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [cities, setCities] = useState<City[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  let researchReports: ResearchReport[] = [];
  try { const raw = getSetting("research_reports"); if (raw) researchReports = JSON.parse(raw); } catch {}

  useEffect(() => {
    fetch("https://propease-production.up.railway.app/api/blog").then(r => r.json()).then(d => {
      const fetched = (d.posts || []).filter((p: BlogPost) => p.publishedAt);
      if (fetched.length > 0) setPosts(fetched);
      setPostsLoading(false);
    }).catch(() => setPostsLoading(false));
  }, []);

  const { listings, loading, filters, setFilters } = useListings();

  useEffect(() => {
    if (listings.length > 0) {
      const unique = new Map<string, City>();
      listings.forEach(l => {
        if (l.city) unique.set(l.city, { id: l.city, name: l.city });
      });
      setCities(Array.from(unique.values()));
    }
  }, [listings]);

  const handleFilterChange = (next: any) => {
    setFilters({
      search: next.search,
      propertyType: next.propertyType,
      listingType: next.listingType,
      rentTier: next.rentTier || "",
      city: next.city,
      category: next.category || "",
      minPrice: next.minPrice?.toString() || "",
      maxPrice: next.maxPrice?.toString() || "",
      minBeds: next.minBeds?.toString() || "",
      maxBeds: next.maxBeds?.toString() || "",
      minBaths: next.minBaths?.toString() || "",
      maxBaths: next.maxBaths?.toString() || "",
      minSqft: next.minSqft?.toString() || "",
      maxSqft: next.maxSqft?.toString() || "",
      paymentOption: next.paymentOption || "",
    });
    setShowCount(INITIAL_SHOW);
  };

  const visibleListings = listings.slice(0, showCount);

  const isSearching = !!(filters.search || filters.propertyType || filters.listingType || filters.city || filters.minPrice || filters.maxPrice || filters.minBeds || filters.maxBeds || filters.minBaths || filters.maxBaths || filters.category);

  return (
    <div className="flex flex-col">
      <section ref={heroRef} className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/40 to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-25 mix-blend-screen" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-14 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now serving 4 cities across Kano
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Find Your Home<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">in Kano.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/60 mt-5 sm:mt-6 max-w-xl leading-relaxed">{siteTagline}</p>

            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">30+</p>
                <p className="text-xs text-white/40 mt-0.5">Verified properties</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">14</p>
                <p className="text-xs text-white/40 mt-0.5">Neighborhoods</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">4</p>
                <p className="text-xs text-white/40 mt-0.5">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-200 shadow-sm" data-filter-search>
        <PropertyFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {isSearching ? "Search results" : "Properties for you"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{loading ? "Loading…" : listings.length > 0 ? `${listings.length} ${listings.length === 1 ? "property" : "properties"}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            {CATEGORY_PILLS.map((p) => {
              const active = activeCategory === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => {
                    setActiveCategory(p.value);
                    setFilters((prev: any) => ({ ...prev, propertyType: p.value }));
                    setShowCount(INITIAL_SHOW);
                  }}
                  className={`shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-56 bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : visibleListings.length === 0 ? (
          <EmptyState title="Nothing matches" description="Try changing your filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleListings.map((l) => (
                <PropertyCard key={l.id} listing={l as any} />
              ))}
            </div>
            {listings.length > showCount && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setShowCount(c => c + LOAD_MORE)} className="min-h-[48px] px-8 py-3 text-sm font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all">
                  Load more properties
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SoldPropertiesGallery />

      {!postsLoading && posts.length > 0 && (
        <div className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-2">From the blog</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">News & insights</h2>
                <p className="text-sm text-gray-500 mt-1.5">Practical reads for buyers, renters, and agents.</p>
              </div>
              <Link href="/news" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                All articles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {posts.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/news/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg active:scale-[0.99] transition-all duration-200 flex flex-col">
                  {p.coverImage && (
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-[0.12em]">
                      {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "News"}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 mt-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed flex-1">{p.excerpt || p.content?.slice(0, 100)}</p>
                    {p.author?.name && (
                      <p className="text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-100">by {p.author.name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {researchReports.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-2">Market research</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Trends in Kano</h2>
              <p className="text-sm text-gray-500 mt-1.5">Data-driven reports on the local property market.</p>
            </div>
            <Link href="/research" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900">
              All reports
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {researchReports.slice(0, 4).map((r, i) => (
              <div key={i} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md active:scale-[0.99] transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 pr-4 leading-snug">{r.title}</h3>
                  <span className="text-xs text-gray-400 shrink-0">{r.date}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(r.metrics || []).map((m) => (
                    <span key={m} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
