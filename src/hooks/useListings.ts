"use client";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api-client";
import type { ApiListing } from "@/lib/api-types";
import { listings as mockListings } from "@/lib/mock-data";

interface ListingFilters {
  search: string;
  propertyType: string;
  listingType: string;
  rentTier: string;
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  paymentOption: string;
}

const defaultFilters: ListingFilters = {
  search: "", propertyType: "", listingType: "", rentTier: "",
  category: "", city: "", minPrice: "", maxPrice: "", paymentOption: "",
};

export function useListings() {
  const [filters, setFilters] = useState<ListingFilters>(defaultFilters);
  const [apiListings, setApiListings] = useState<ApiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, status } = await api.get<{ items: ApiListing[] }>("/api/listings");
        if (status === 200 && data) {
          setApiListings(data.items);
        } else {
          throw new Error("API not available");
        }
      } catch {
        setApiListings([]);
      }
      setLoading(false);
    })();
  }, []);

  const activeListings = useMemo(
    () => mockListings.filter((l) => l.status !== "taken"),
    []
  );

  const filtered = useMemo(() => {
    const source = apiListings.length > 0 ? apiListings : activeListings;
    return source.filter((l) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !("address" in l ? (l as any).address : "").toLowerCase().includes(q)) return false;
      }
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false;
      if (filters.listingType && l.listingType !== filters.listingType) return false;
      if (filters.city && l.city !== filters.city) return false;
      if (filters.minPrice && l.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && l.price > parseInt(filters.maxPrice)) return false;
      return true;
    });
  }, [filters, apiListings, activeListings]);

  return {
    listings: filtered,
    loading,
    error,
    filters,
    setFilters,
    isUsingMock: apiListings.length === 0,
  };
}
