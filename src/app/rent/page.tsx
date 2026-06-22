"use client";
import { useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import { useListings } from "@/hooks/useListings";

export default function RentPage() {
  const { listings, loading } = useListings();
  const rentals = listings.filter(l => l.listingType === "rent" && (l.status === "available" || l.status === "approved"));

  return (
    <div className="flex flex-col">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-10 sm:pb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            Rental Properties
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed max-w-2xl">
            Find quality rental homes, flats, and apartments in Kano &amp; other northern states. Verified properties with transparent pricing.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-8 sm:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-56 bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No rentals available right now</h3>
            <p className="text-sm text-gray-500 mb-6">Check back soon or contact us for upcoming rental properties.</p>
            <Link
              href="/custom-order"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Request a property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((l) => (
              <PropertyCard key={l.id} listing={l as any} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
