"use client";
import { useState, useMemo } from "react";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/listings/PropertyFilters";
import { listings, cities } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

export default function HomePage() {
  const [showFilters, setShowFilters] = useState(false);
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
      <section className="relative bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-primary-light)] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified properties across Kano
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Find Your Next Home in <span className="text-[var(--color-accent)]">Kano</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-xl mx-auto">
              Browse verified listings across Kano Municipal, Fagge, Tarauni, and Nassarawa. Rent or buy with confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /></svg>
                {activeListings.length} properties
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {cities.length} cities
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                From {formatNaira(Math.min(...activeListings.map(l => l.price)))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-lg">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full p-4 text-left"
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
            <div className="px-5 pb-5 animate-fade-in">
              <div className="border-t border-gray-100 pt-4">
                <PropertyFilters onFilterChange={setFilters} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Properties
            <span className="text-sm font-normal text-gray-500 ml-2">({filtered.length} found)</span>
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((listing) => (
              <div key={listing.id} className="animate-fade-in-up" style={{ animationDelay: `${parseInt(listing.id.replace("l", "")) * 50}ms` }}>
                <PropertyCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No properties match your filters</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </section>

      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">How It Works</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Find Your Home in Three Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🔍", title: "Browse", text: "Search verified listings across Kano Municipal, Fagge, Tarauni, and Nassarawa. Filter by type, price, or location." },
              { step: "02", icon: "📞", title: "Connect", text: "Reach out through our inquiry system. An agent will contact you within hours to arrange a viewing." },
              { step: "03", icon: "🤝", title: "Close", text: "Inspected the property and ready to move? Pay your deposit through our secure wallet system." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200/60 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="text-xs font-bold text-[var(--color-primary)] mb-1">{item.step}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Testimonials</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">What People Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Dr. Amina Yusuf", role: "Homeowner, Kano Municipal", text: "PropEase made selling my duplex effortless. The agent was professional and the transaction was completed in days, not months.", rating: 5 },
            { name: "Alh. Kabir Danjuma", role: "Business Owner, Fagge", text: "I found the perfect commercial space in Fagge through PropEase. The listing was accurate and the process was transparent.", rating: 5 },
            { name: "Barr. Safiya Ibrahim", role: "Tenant, Tarauni", text: "After dealing with unreliable agents for months, PropEase was a breath of fresh air. Found my apartment in one week.", rating: 5 },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
