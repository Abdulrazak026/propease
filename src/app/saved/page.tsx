"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import { listings } from "@/lib/mock-data";
import { getFavorites } from "@/lib/favorites";
import { formatDate } from "@/lib/utils";

interface SavedSearch {
 id: string;
 name: string;
 searchParams: Record<string, string>;
 createdAt: string;
}

export default function SavedPage() {
 const [tab, setTab] = useState<"searches" | "favorites">("favorites");
 const [searches, setSearches] = useState<SavedSearch[]>([]);
 const [favIds, setFavIds] = useState<string[]>([]);

 useEffect(() => {
 setSearches(JSON.parse(localStorage.getItem("savedSearches") || "[]"));
 setFavIds(getFavorites());
 }, []);

 const favListings = listings.filter((l) => favIds.includes(l.id));

 const getMatches = (params: Record<string, string>) => {
 return listings.filter((l) => {
 if (params.propertyType && l.propertyType !== params.propertyType) return false;
 if (params.listingType && l.listingType !== params.listingType) return false;
 if (params.city && l.city !== params.city) return false;
 if (params.rentTier && l.rentTier !== params.rentTier) return false;
 if (params.category && l.category !== params.category) return false;
 if (params.minPrice && l.price < parseInt(params.minPrice)) return false;
 if (params.maxPrice && l.price> parseInt(params.maxPrice)) return false;
 return true;
 });
 };

 const handleDeleteSearch = (id: string) => {
 const updated = searches.filter((s) => s.id !== id);
 setSearches(updated);
 localStorage.setItem("savedSearches", JSON.stringify(updated));
 };

 return (
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-900">Saved</h1>
 <p className="text-sm text-gray-500 mt-1">Your saved properties and searches</p>
 </div>

 <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
 <button
 onClick={() => setTab("favorites")}
 className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "favorites" ? "bg-white text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
>
 Favorites {favListings.length> 0 && `(${favListings.length})`}
 </button>
 <button
 onClick={() => setTab("searches")}
 className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "searches" ? "bg-white text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
>
 Saved Searches {searches.length> 0 && `(${searches.length})`}
 </button>
 </div>

 {tab === "favorites" && (
 <>
 {favListings.length === 0 ? (
 <div className="text-center py-16">
 <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
 </svg>
 <h3 className="text-base font-semibold text-gray-900 mb-1">No favorites yet</h3>
 <p className="text-sm text-gray-500 mb-4">Click the heart icon on any property to save it here</p>
 <Link href="/" className="inline-flex px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-light)] transition-all">
 Browse Properties
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {favListings.map((l) => (
 <PropertyCard key={l.id} listing={l} />
 ))}
 </div>
 )}
 </>
 )}

 {tab === "searches" && (
 <>
 {searches.length === 0 ? (
 <div className="text-center py-16">
 <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
 </svg>
 <h3 className="text-base font-semibold text-gray-900 mb-1">No saved searches yet</h3>
 <p className="text-sm text-gray-500 mb-4">Use the filter panel and click &ldquo;Save this search&rdquo;</p>
 <Link href="/" className="inline-flex px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-light)] transition-all">
 Browse Properties
 </Link>
 </div>
 ) : (
 <div className="space-y-6">
 {searches.map((search) => {
 const matches = getMatches(search.searchParams);
 return (
 <div key={search.id} className="bg-white rounded-lg border border-gray-200 p-5">
 <div className="flex items-start justify-between mb-3">
 <div>
 <h3 className="font-semibold text-gray-900 text-sm">{search.name}</h3>
 <p className="text-xs text-gray-500 mt-0.5">
 Saved {formatDate(search.createdAt)} &middot; {matches.length} matching properties
 </p>
 </div>
 <button onClick={() => handleDeleteSearch(search.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
 </div>
 {Object.keys(search.searchParams).length> 0 && (
 <div className="flex flex-wrap gap-1.5 mb-3">
 {Object.entries(search.searchParams).map(([key, val]) => (
 <span key={key} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md">
 {key.replace(/([A-Z])/g, " $1").trim()}: {val}
 </span>
 ))}
 </div>
 )}
 <Link href={`/?${new URLSearchParams(search.searchParams).toString()}`} className="text-xs text-[var(--color-primary)] font-medium hover:underline">
 View all {matches.length} matches &rarr;
 </Link>
 {matches.length> 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
 {matches.slice(0, 2).map((l) => (
 <PropertyCard key={l.id} listing={l} />
 ))}
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </>
 )}
 </div>
 );
}
