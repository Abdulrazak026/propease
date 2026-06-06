"use client";
import { useState } from "react";
import { PropertyType, ListingType, RentTier, ListingCategory } from "@/lib/types";
import { propertyTypeLabels, rentTierLabels } from "@/lib/utils";

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  propertyType: PropertyType | "";
  listingType: ListingType | "";
  rentTier: RentTier | "";
  category: ListingCategory | "";
  city: string;
  minPrice: string;
  maxPrice: string;
  paymentOption: string;
}

const cities = ["All Cities", "Kano Municipal", "Fagge", "Tarauni", "Nassarawa"];
const propertyTypes = ["", "house", "flat", "land", "commercial"] as const;

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "", propertyType: "", listingType: "", rentTier: "",
    category: "", city: "", minPrice: "", maxPrice: "", paymentOption: "",
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
      category: "", city: "", minPrice: "", maxPrice: "", paymentOption: "",
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => k !== "search" && v !== "").length;

  return (
    <div className="space-y-3 px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, location, or description..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {propertyTypes.map((t) => (
          <button
            key={t}
            onClick={() => update("propertyType", t)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
              filters.propertyType === t
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {t === "" ? "All" : propertyTypeLabels[t]}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-300 mx-1 hidden sm:block" />
        <button
          onClick={() => update("listingType", filters.listingType === "rent" ? "" : "rent")}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
            filters.listingType === "rent"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
          }`}
        >
          Rent
        </button>
        <button
          onClick={() => update("listingType", filters.listingType === "sale" ? "" : "sale")}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
            filters.listingType === "sale"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-white border border-gray-300 text-gray-600 hover:border-gray-400"
          }`}
        >
          Sale
        </button>
      </div>

      {showMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          <select
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[11px] sm:text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          >
            {cities.map((c) => (
              <option key={c} value={c === "All Cities" ? "" : c}>{c}</option>
            ))}
          </select>
          <select
            value={filters.rentTier}
            onChange={(e) => update("rentTier", e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[11px] sm:text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          >
            <option value="">Rent Tier</option>
            <option value="rent_only">Basic</option>
            <option value="rent_management">+Damages</option>
            <option value="rent_full">Full</option>
          </select>
          <select
            value={filters.paymentOption}
            onChange={(e) => update("paymentOption", e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[11px] sm:text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          >
            <option value="">Payment</option>
            <option value="reservation">Reservation</option>
            <option value="instalment">Instalment</option>
            <option value="full">Full</option>
          </select>
          <input
            type="number" placeholder="Min \u20A6"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[11px] sm:text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
          <input
            type="number" placeholder="Max \u20A6"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[11px] sm:text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-[11px] sm:text-xs text-[var(--color-primary)] font-medium hover:text-[var(--color-primary-light)] transition-colors"
        >
          {showMore ? "Less filters" : "More filters"}
          <svg className={`inline-block w-3 h-3 ml-1 transition-transform ${showMore ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {activeCount > 0 && (
          <button onClick={reset} className="text-[11px] sm:text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Clear all ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}
