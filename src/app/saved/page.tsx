"use client";
import { useState } from "react";
import Link from "next/link";
import { listings } from "@/lib/mock-data";
import { getFavorites } from "@/lib/favorites";
import PropertyCard from "@/components/listings/PropertyCard";

export default function SavedPage() {
  const [faveIds] = useState(getFavorites());
  const savedListings = listings.filter((l) => faveIds.includes(l.id));

  return (
    <div className="flex-1 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            {savedListings.length > 0
              ? `${savedListings.length} property${savedListings.length > 1 ? "ies" : ""} saved`
              : "You haven't saved any properties yet"}
          </p>
        </div>

        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {savedListings.map((listing) => (
              <div key={listing.id} className="animate-fade-in-up">
                <PropertyCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No saved properties</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">Click the heart icon on any property to save it for later.</p>
            <Link href="/" className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all">Browse Properties</Link>
          </div>
        )}
      </div>
    </div>
  );
}
