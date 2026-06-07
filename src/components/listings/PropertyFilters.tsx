"use client";
import { useState } from "react";
import { PropertyType, ListingType, RentTier, ListingCategory } from "@/lib/types";
import { propertyTypeLabels } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import BottomSheet from "@/components/ui/BottomSheet";

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string; propertyType: PropertyType | ""; listingType: ListingType | "";
  rentTier: RentTier | ""; category: ListingCategory | ""; city: string;
  minPrice: string; maxPrice: string; minBeds: string; maxBeds: string;
  minBaths: string; maxBaths: string; minSqft: string; maxSqft: string;
  paymentOption: string;
}

const propertyTypes = ["", "house", "flat", "land", "commercial"] as const;

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const { get } = useSettings();
  const rawCities = get("available_cities") || "Kano Municipal, Kano State; Fagge, Kano State; Tarauni, Kano State; Nassarawa, Kano State";
  const cities = ["All Cities", ...rawCities.split(";").map(c => c.trim().split(",")[0].trim()).filter(Boolean)];

  const [filters, setFilters] = useState<FilterState>({
    search: "", propertyType: "", listingType: "", rentTier: "",
    category: "", city: "", minPrice: "", maxPrice: "",
    minBeds: "", maxBeds: "", minBaths: "", maxBaths: "",
    minSqft: "", maxSqft: "", paymentOption: "",
  });
  const [showMore, setShowMore] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const reset = () => {
    const empty: FilterState = {
      search: "", propertyType: "", listingType: "", rentTier: "",
      category: "", city: "", minPrice: "", maxPrice: "",
      minBeds: "", maxBeds: "", minBaths: "", maxBaths: "",
      minSqft: "", maxSqft: "", paymentOption: "",
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => k !== "search" && v !== "").length;

  const filterBody = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {propertyTypes.map((t) => (
          <button key={t} onClick={() => update("propertyType", t)}
            className={`min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              filters.propertyType === t ? "bg-[var(--color-primary)] text-white shadow-sm" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
            }`}>{t === "" ? "All" : propertyTypeLabels[t]}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => update("listingType", filters.listingType === "sale" ? "" : "sale")}
          className={`min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${filters.listingType === "sale" ? "bg-[var(--color-accent)] text-gray-900 shadow-sm" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"}`}>Sale</button>
        <button onClick={() => update("listingType", filters.listingType === "rent" ? "" : "rent")}
          className={`min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${filters.listingType === "rent" ? "bg-[var(--color-accent)] text-gray-900 shadow-sm" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"}`}>Rent</button>
        <select value={filters.city} onChange={(e) => update("city", e.target.value)}
          className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
          {cities.map((c) => <option key={c} value={c === "All Cities" ? "" : c}>{c}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input type="number" placeholder="Min price" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)}
          className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <span className="text-gray-300 text-sm">–</span>
        <input type="number" placeholder="Max price" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)}
          className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
      </div>

      <button onClick={() => setShowMore(!showMore)}
        className="text-sm text-[var(--color-primary)] font-medium hover:underline">{showMore ? "Less filters" : "More filters"}</button>

      {showMore && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <select value={filters.rentTier} onChange={(e) => update("rentTier", e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
            <option value="">Rent Tier</option><option value="rent_only">Basic</option><option value="rent_management">+Damages</option><option value="rent_full">Full</option>
          </select>
          <select value={filters.paymentOption} onChange={(e) => update("paymentOption", e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
            <option value="">Payment</option><option value="reservation">Reservation</option><option value="instalment">Instalment</option><option value="full">Full</option>
          </select>
          <input type="number" placeholder="Min beds" value={filters.minBeds} onChange={(e) => update("minBeds", e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          <input type="number" placeholder="Min baths" value={filters.minBaths} onChange={(e) => update("minBaths", e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          <input type="number" placeholder="Min sqft" value={filters.minSqft} onChange={(e) => update("minSqft", e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        </div>
      )}

      {activeCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">{activeCount} active filters</span>
          <button onClick={reset} className="text-xs text-red-500 font-medium hover:text-red-600">Clear all</button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: inline filters */}
      <div className="hidden lg:block px-3 sm:px-4 lg:px-6 py-3">
        <div className="max-w-4xl mx-auto space-y-2">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search location, title, or keyword..." value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => update("listingType", filters.listingType === "sale" ? "" : "sale")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filters.listingType === "sale" ? "bg-[var(--color-accent)] text-gray-900" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"}`}>Sale</button>
          <button onClick={() => update("listingType", filters.listingType === "rent" ? "" : "rent")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filters.listingType === "rent" ? "bg-[var(--color-accent)] text-gray-900" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"}`}>Rent</button>
          <select value={filters.city} onChange={(e) => update("city", e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
            {cities.map((c) => <option key={c} value={c === "All Cities" ? "" : c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Min $" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)}
            className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          <span className="text-gray-300 text-xs">–</span>
          <input type="number" placeholder="Max $" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)}
            className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          <button onClick={() => setShowMore(!showMore)}
            className="text-xs text-[var(--color-primary)] font-medium hover:underline ml-auto">{showMore ? "Less" : "More"}</button>
        </div>
        {showMore && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5 border-t border-gray-100">
            <select value={filters.rentTier} onChange={(e) => update("rentTier", e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
              <option value="">Rent Tier</option><option value="rent_only">Basic</option><option value="rent_management">+Damages</option><option value="rent_full">Full</option>
            </select>
            <select value={filters.paymentOption} onChange={(e) => update("paymentOption", e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
              <option value="">Payment</option><option value="reservation">Reservation</option><option value="instalment">Instalment</option><option value="full">Full</option>
            </select>
            <input type="number" placeholder="Min beds" value={filters.minBeds} onChange={(e) => update("minBeds", e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input type="number" placeholder="Min baths" value={filters.minBaths} onChange={(e) => update("minBaths", e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input type="number" placeholder="Min sqft" value={filters.minSqft} onChange={(e) => update("minSqft", e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          </div>
        )}
        {activeCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{activeCount} active</span>
            <button onClick={reset} className="text-xs text-gray-500 hover:text-red-500">Clear</button>
          </div>
        )}
        </div>
      </div>

      {/* Mobile: filter button + drawer */}
      <div className="lg:hidden px-2 py-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search..." value={filters.search}
              onChange={(e) => update("search", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          </div>
          <button onClick={() => setDrawerOpen(true)}
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-400 active:scale-95 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filter
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeCount}</span>
            )}
          </button>
        </div>
      </div>

      <BottomSheet open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search location, title..." value={filters.search}
              onChange={(e) => update("search", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          </div>
          {filterBody}
        </div>
      </BottomSheet>
    </>
  );
}
