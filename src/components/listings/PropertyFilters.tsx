"use client";
import { useState } from "react";
import { PropertyType, ListingType, RentTier, ListingCategory } from "@/lib/types";
import { propertyTypeLabels } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

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

  return (
    <div className="space-y-2 px-3 sm:px-4 lg:px-6 py-3">
      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search location, title, or keyword..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {propertyTypes.map((t) => (
          <button key={t} onClick={() => update("propertyType", t)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filters.propertyType === t ? "bg-[var(--color-primary)] text-white" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
            }`}>{t === "" ? "All" : propertyTypeLabels[t]}</button>
        ))}
        <span className="w-px h-5 bg-gray-300 mx-0.5 hidden sm:block" />
        <button onClick={() => update("listingType", filters.listingType === "sale" ? "" : "sale")}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${filters.listingType === "sale" ? "bg-[var(--color-accent)] text-gray-900" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"}`}>Sale</button>
        <button onClick={() => update("listingType", filters.listingType === "rent" ? "" : "rent")}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${filters.listingType === "rent" ? "bg-[var(--color-accent)] text-gray-900" : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"}`}>Rent</button>
        <select value={filters.city} onChange={(e) => update("city", e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
          {cities.map((c) => <option key={c} value={c === "All Cities" ? "" : c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Min ₦" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)}
          className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <span className="text-gray-300 text-xs">–</span>
        <input type="number" placeholder="Max ₦" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)}
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
          <span className="text-[10px] text-gray-400">{activeCount} active</span>
          <button onClick={reset} className="text-[10px] text-gray-500 hover:text-red-500">Clear</button>
        </div>
      )}
    </div>
  );
}
