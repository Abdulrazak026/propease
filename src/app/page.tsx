"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters from "@/components/listings/PropertyFilters";
import { useListings } from "@/hooks/useListings";
import { EmptyState } from "@/components/ui/Skeleton";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";

interface City { id: string; name: string; }
interface BlogPost { id: string; slug: string; title: string; excerpt?: string | null; content?: string | null; coverImage: string | null; publishedAt: string | null; author?: { name: string } | null; }
interface ResearchReport { title: string; date: string; summary: string; metrics: string[]; }

const INITIAL_SHOW = 6;
const LOAD_MORE = 6;

export default function HomePage() {
  const { get: getSetting } = useSettings();
  const heroImage = getSetting("hero_image") || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&h=800&fit=crop";
  const siteName = getSetting("site_name", "MBPP");
  const siteTagline = getSetting("site_tagline", "Find Your Dream Property in Kano");
  const siteLogo = getSetting("site_logo");
  const heroRef = useRef<HTMLElement>(null);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [cities, setCities] = useState<City[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  let researchReports: ResearchReport[] = [];
  try { const raw = getSetting("research_reports"); if (raw) researchReports = JSON.parse(raw); } catch {}

  useEffect(() => {
    fetch("https://propease-production.up.railway.app/api/blog").then(r => r.json()).then(d => {
      setPosts((d.posts || []).filter((p: BlogPost) => p.publishedAt));
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

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[40vh] md:h-[48vh] bg-gray-900 overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 z-10">
          <div>{siteLogo ? <img src={siteLogo} alt={siteName} className="h-8 w-auto" /> : null}</div>
          <Link href="/login" className="text-sm text-white/80 hover:text-white font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">Sign In</Link>
        </div>
        <div className="relative flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">{siteName}</h1>
          <p className="text-base md:text-lg mt-3 max-w-md text-white/80 drop-shadow">{siteTagline}</p>
          <div className="flex gap-4 mt-4 md:mt-6 text-sm">
            <span className="text-white/60">500+ Properties</span>
            <span className="text-white/60">50+ Agents</span>
            <span className="text-white/60">4 Cities</span>
          </div>

        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm" data-filter-search>
        <PropertyFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Listings */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-44 bg-gray-100 rounded-lg mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : visibleListings.length === 0 ? (
          <EmptyState title="No listings found" description="Try adjusting your filters or check back later." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{listings.length} property{listings.length !== 1 ? "ies" : "y"} found</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {visibleListings.map((l) => (
                <PropertyCard key={l.id} listing={l as any} />
              ))}
            </div>
            {listings.length > showCount && (
              <div className="flex justify-center mt-8">
                <button onClick={() => setShowCount(c => c + LOAD_MORE)} className="min-h-[44px] px-8 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all shadow-sm">Show More Properties</button>
              </div>
            )}
            {/* News slider */}
            {!postsLoading && posts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">News & Insights</h2>
                  <Link href="/news" className="text-xs text-[var(--color-primary)] font-medium hover:underline">View all</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                  {posts.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/news/${p.slug}`} className="min-w-[260px] max-w-[260px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all snap-start shrink-0 group">
                      {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-36 object-cover" />}
                      <div className="p-4">
                        <span className="text-[10px] font-medium text-[var(--color-primary)] uppercase tracking-wider">News</span>
                        <h3 className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{p.title}</h3>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{p.excerpt || p.content?.slice(0, 100)}</p>
                        <p className="text-[11px] text-gray-400 mt-2">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Research section */}
            {researchReports.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Market Research</h2>
                  <Link href="/research" className="text-xs text-[var(--color-primary)] font-medium hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {researchReports.slice(0, 4).map((r, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 active:scale-[0.99] transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">{r.title}</h3>
                        <span className="text-[11px] text-gray-400 shrink-0 ml-3">{r.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-3">{r.summary}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(r.metrics || []).map((m) => (
                          <span key={m} className="px-2 py-0.5 bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-[10px] font-medium rounded-full">{m}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
