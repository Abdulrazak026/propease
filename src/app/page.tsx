"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/listings/PropertyFilters";
import { useListings } from "@/hooks/useListings";
import { EmptyState } from "@/components/ui/Skeleton";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";

interface City { id: string; name: string; }

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

  const handleFilterChange = (next: FilterState) => {
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
      <section ref={heroRef} className="relative h-[35vh] md:h-[42vh] bg-gray-900 overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 z-10">
          <div>{siteLogo ? <img src={siteLogo} alt={siteName} className="h-8 w-auto" /> : null}</div>
          <Link href="/login" className="text-sm text-white/80 hover:text-white font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">Sign In</Link>
        </div>
        <div className="relative flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">{siteName}</h1>
          <p className="text-base md:text-lg mt-3 max-w-md text-white/80 drop-shadow">{siteTagline}</p>
          <div className="flex gap-4 mt-6 text-sm">
            <span className="text-white/60">500+ Properties</span>
            <span className="text-white/60">50+ Agents</span>
            <span className="text-white/60">4 Cities</span>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <PropertyFilters onFilterChange={handleFilterChange} />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {visibleListings.map((l) => (
                <PropertyCard key={l.id} listing={l as any} />
              ))}
            </div>
            {listings.length > showCount && (
              <div className="flex justify-center mt-8">
                <button onClick={() => setShowCount(c => c + LOAD_MORE)} className="px-6 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Load More</button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
