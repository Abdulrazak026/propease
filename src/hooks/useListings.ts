"use client";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api-client";
import type { ApiListing } from "@/lib/api-types";

interface ListingFilters {
  search: string; propertyType: string; listingType: string;
  rentTier: string; category: string; city: string;
  minPrice: string; maxPrice: string; minBeds: string; maxBeds: string;
  minBaths: string; maxBaths: string; minSqft: string; maxSqft: string;
  paymentOption: string;
}

const defaultFilters: ListingFilters = {
  search: "", propertyType: "", listingType: "", rentTier: "",
  category: "", city: "", minPrice: "", maxPrice: "",
  minBeds: "", maxBeds: "", minBaths: "", maxBaths: "",
  minSqft: "", maxSqft: "", paymentOption: "",
};

export function useListings() {
  const [filters, setFilters] = useState<ListingFilters>(defaultFilters);
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, status } = await api.get<{ listings: ApiListing[] }>("/api/listings");
        if (status === 200 && data) {
          setListings(data.listings || []);
        } else {
          setListings([]);
        }
      } catch {
        setListings([]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      // Public homepage only shows available/reserved listings
      if (!["available", "reserved", "approved"].includes(l.status)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !(l.address || "").toLowerCase().includes(q)) return false;
      }
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false;
      if (filters.listingType && l.listingType !== filters.listingType) return false;
      if (filters.city && l.city !== filters.city) return false;
      if (filters.minPrice && l.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && l.price > parseInt(filters.maxPrice)) return false;
      if (filters.minBeds && (l.bedrooms || 0) < parseInt(filters.minBeds)) return false;
      if (filters.maxBeds && (l.bedrooms || 0) > parseInt(filters.maxBeds)) return false;
      if (filters.minBaths && (l.bathrooms || 0) < parseInt(filters.minBaths)) return false;
      if (filters.maxBaths && (l.bathrooms || 0) > parseInt(filters.maxBaths)) return false;
      if (filters.minSqft && !l.size) return false;
      if (filters.maxSqft && !l.size) return false;
      return true;
    });
  }, [filters, listings]);

  return { listings: filtered, loading, error, filters, setFilters };
}
