"use client";
import { useState, useMemo } from "react";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/listings/PropertyFilters";
import { listings, cities } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "", propertyType: "", listingType: "", rentTier: "",
    category: "", city: "", minPrice: "", maxPrice: "",
  });

  const activeListings = listings.filter((l) => l.status !== "taken");

  const filtered = useMemo(() => {
    return activeListings.filter((l) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !l.address.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false;
      }
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false;
      if (filters.listingType && l.listingType !== filters.listingType) return false;
      if (filters.rentTier && l.rentTier !== filters.rentTier) return false;
      if (filters.category && l.category !== filters.category) return false;
      if (filters.city && l.city !== filters.city) return false;
      if (filters.minPrice && l.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && l.price > parseInt(filters.maxPrice)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="flex-1">
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Find Your Next Property in <span className="text-[var(--color-accent)]">Kano</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            Browse verified listings across Kano Municipal, Fagge, Tarauni, and Nassarawa.
            Rent or buy with confidence through PropEase.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <span>🏘️ {activeListings.length} properties</span>
            <span>📍 {cities.length} cities</span>
            <span>💰 From {formatNaira(Math.min(...activeListings.map(l => l.price)))}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyFilters onFilterChange={setFilters} />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
            </h2>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900">No properties match your filters</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
