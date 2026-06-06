"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/listings/PropertyFilters";
import SaveSearchButton from "@/components/search/SaveSearchButton";
import { EmptyState } from "@/components/ui/Skeleton";
import { listings, cities } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";

const INITIAL_SHOW = 6;
const LOAD_MORE = 6;

const activeListings = listings.filter((l) => l.status !== "taken");

export default function HomePage() {
  const { get: getSetting } = useSettings();
  const heroImage = getSetting("hero_image") || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&h=800&fit=crop";
  const [showFilters, setShowFilters] = useState(false);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [filters, setFilters] = useState<FilterState>({
    search: "", propertyType: "", listingType: "", rentTier: "",
    category: "", city: "", minPrice: "", maxPrice: "", paymentOption: "",
  });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    if (typeParam === "buy") {
      setFilters((prev) => ({ ...prev, listingType: "sale" }));
    } else if (typeParam === "rent") {
      setFilters((prev) => ({ ...prev, listingType: "rent" }));
    }
  }, []);

  const filtered = useMemo(() => {
    return activeListings.filter((l) => {
      const m = filters.minPrice ? l.price >= Number(filters.minPrice) : true;
      const mx = filters.maxPrice ? l.price <= Number(filters.maxPrice) : true;
      const c = filters.city ? l.city === filters.city : true;
      const t = filters.listingType ? l.listingType === filters.listingType : true;
      return m && mx && c && t;
    });
  }, [filters]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setShowCount(INITIAL_SHOW);
  };

  return (
    <>
    <section ref={heroRef} className="relative h-[35vh] md:h-[42vh] bg-gray-900 overflow-hidden">
        <img
            src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center h-14 px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-[var(--color-primary)] font-bold text-[10px]">P</span>
            </div>
            <span className="text-sm font-bold text-white">MBPP</span>
          </div>
          <Link
            href="/login"
            className="lg:hidden absolute right-4 text-xs text-white border border-white/30 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
        <div className="relative h-full px-4 sm:px-6 lg:px-12 xl:px-16 flex flex-col justify-center items-center text-center">
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Find Your Home in <span className="text-[var(--color-accent)]">Kano</span>
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-300 max-w-lg mx-auto">
              Browse verified listings across Kano. Rent or buy with confidence.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /></svg>
                {activeListings.length} properties
              </span>
              <span className="inline-flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {cities.length} cities
              </span>
              <span className="inline-flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                From {formatNaira(Math.min(...activeListings.map((l) => l.price)))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-10 bg-gray-50/95 border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-3">
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full p-3 text-left"
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {showFilters ? "Hide filters" : "Search properties"}
                </span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFilters && (
              <div className="px-4 pb-4">
                <div className="border-t border-gray-200 pt-3">
                  <PropertyFilters onFilterChange={handleFilterChange} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Properties
            <span className="text-sm font-normal text-gray-500 ml-2">({filtered.length} found)</span>
          </h2>
          <SaveSearchButton currentFilters={filters} />
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {visible.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowCount((c) => c + LOAD_MORE)}
                  className="px-8 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  Show More Properties
                </button>
              </div>
            )}
            {!hasMore && filtered.length > INITIAL_SHOW && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowCount(INITIAL_SHOW)}
                  className="px-6 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Show Less
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState title="No properties match your filters" description="Try adjusting your search criteria" />
        )}
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">News & Research</h2>
            <div className="flex gap-3">
              <Link href="/news" className="text-xs text-[var(--color-primary)] font-medium hover:underline">All News</Link>
              <Link href="/research" className="text-xs text-[var(--color-primary)] font-medium hover:underline">Market Research</Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/news" className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <span className="text-2xl shrink-0">📰</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Kano Property Market Sees 15% Growth</p>
                <p className="text-xs text-gray-500 mt-1">Residential values rise across Kano Municipal and Fagge driven by urban migration.</p>
                <p className="text-xs text-[var(--color-primary)] font-medium mt-2">Read more →</p>
              </div>
            </Link>
            <Link href="/research" className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <span className="text-2xl shrink-0">📊</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Rental Affordability Index 2026</p>
                <p className="text-xs text-gray-500 mt-1">Fagge remains the most affordable district for young professionals.</p>
                <p className="text-xs text-[var(--color-primary)] font-medium mt-2">View report →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
