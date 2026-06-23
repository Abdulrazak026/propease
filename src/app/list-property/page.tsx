"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Listing } from "@/lib/types";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters from "@/components/listings/PropertyFilters";
import { useListings } from "@/hooks/useListings";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const MapView = dynamic(() => import("@/components/listings/MapView"), { ssr: false, loading: () => <div className="h-[60vh] bg-gray-100 rounded-2xl flex items-center justify-center text-sm text-gray-400">Loading map…</div> });

type ViewMode = "list" | "map";

export default function ListPropertyPage() {
  const params = useSearchParams();
  const initialView = (params?.get("view") as ViewMode) || "list";
  const [view, setView] = useState<ViewMode>(initialView);
  const { listings, loading, filters, setFilters } = useListings();

  useEffect(() => {
    const v = params?.get("view");
    if (v === "map" || v === "list") setView(v);
    const type = params?.get("type");
    if (type === "buy" || type === "rent") {
      setFilters(prev => ({ ...prev, listingType: type }));
    }
  }, [params]);

  const handleFilterChange = (next: any) => {
    setFilters({
      search: next.search,
      propertyType: next.propertyType,
      listingType: next.listingType,
      rentTier: next.rentTier || "",
      city: next.city,
      state: next.state || "",
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
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-10 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue bg-brand-blue/10 px-3.5 py-2 rounded-lg hover:bg-brand-blue/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <PropertyFilters onFilterChange={handleFilterChange} />
      </div>
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-10 py-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Properties</h1>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? "Loading…" : `${listings.length} ${listings.length === 1 ? "property" : "properties"} listed`}
            </p>
          </div>
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            {(["list", "map"] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                {v === "list" ? "List" : "Map"}
              </button>
            ))}
          </div>
        </div>

        {view === "map" ? (
          <MapView listings={listings as Listing[]} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3.5 animate-pulse">
                <div className="h-48 bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">No properties listed yet</p>
            <p className="text-xs text-gray-500">Check back soon or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map(l => <PropertyCard key={l.id} listing={l as any} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
