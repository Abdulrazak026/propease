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
}

const cities = ["All Cities", "Kano Municipal", "Fagge", "Tarauni", "Nassarawa"];

export default function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "", propertyType: "", listingType: "", rentTier: "",
    category: "", city: "", minPrice: "", maxPrice: "",
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
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Search properties..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["", "house", "flat", "land", "commercial"] as const).map((t) => (
          <button
            key={t}
            onClick={() => update("propertyType", t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filters.propertyType === t
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t === "" ? "All" : propertyTypeLabels[t]}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => update("listingType", filters.listingType === "rent" ? "" : "rent")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            filters.listingType === "rent"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          For Rent
        </button>
        <button
          onClick={() => update("listingType", filters.listingType === "sale" ? "" : "sale")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            filters.listingType === "sale"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          For Sale
        </button>
      </div>

      {showMore && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <select
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {cities.map((c) => (
              <option key={c} value={c === "All Cities" ? "" : c}>{c}</option>
            ))}
          </select>
          <select
            value={filters.rentTier}
            onChange={(e) => update("rentTier", e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Rent Tiers</option>
            <option value="normal">{rentTierLabels.normal}</option>
            <option value="damages">{rentTierLabels.damages}</option>
            <option value="full">{rentTierLabels.full}</option>
          </select>
          <input
            type="number" placeholder="Min ₦"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="number" placeholder="Max ₦"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs text-[var(--color-primary)] font-medium hover:underline"
        >
          {showMore ? "Less filters ▲" : "More filters ▼"}
        </button>
        <button
          onClick={reset}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
