"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { resolveImageUrl } from "@/lib/utils";
import { Listing } from "@/lib/types";
import { formatNaira, propertyTypeLabels } from "@/lib/utils";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

interface PropertyCardProps {
  listing: Listing;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const hasPhoto = listing.photos.length > 0;
  const [fav, setFav] = useState(false);

  useEffect(() => { setFav(isFavorite(listing.id)); }, [listing.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(listing.id));
  };

  const forRent = listing.listingType === "rent";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg active:shadow-sm transition-all duration-200 active:scale-[0.99]"
    >
      <div className="relative h-60 sm:h-64 bg-gray-100 overflow-hidden">
        {hasPhoto ? (
          <img src={resolveImageUrl(listing.photos[0].url) || ""} alt={listing.photos[0].alt || listing.title || "Property listing"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-3xl">🏠</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-600 text-white">
            {listing.status === "available" ? (forRent ? "Available for Rent" : "Available for Sale") : listing.status === "reserved" ? "Reserved" : listing.status === "sold" ? "Sold" : listing.status}
          </span>
          {listing.category === "partnership" && <Badge variant="info">Partner</Badge>}
          {listing.postedBy?.isVerified && <VerifiedBadge />}
          {listing.instalmentAvailable && <Badge variant="success">Instalment plan available</Badge>}
        </div>

        <div className="absolute bottom-2 left-2 sm:left-3 backdrop-blur-sm bg-black/55 rounded-md px-2 py-1 max-w-[calc(100%-1rem)]">
          <p className="text-white font-bold text-sm sm:text-base whitespace-nowrap">{formatNaira(listing.price)}</p>
          {forRent && <p className="text-white/70 text-[10px] sm:text-[11px] -mt-0.5">per year</p>}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 normal-case">
          {listing.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mt-2 flex items-center gap-1 line-clamp-1">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.address || listing.city}
        </p>
        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base">
            {listing.bedrooms && (
              <span className="flex items-center gap-1">
                <i className="bi bi-bed text-brand-blue text-sm"></i>
                <span className="font-bold text-gray-800">{listing.bedrooms}</span>
              </span>
            )}
            {listing.bedrooms && listing.bathrooms && <span className="text-gray-300">•</span>}
            {listing.bathrooms && (
              <span className="flex items-center gap-1">
                <i className="bi bi-bathtub text-brand-blue text-sm"></i>
                <span className="font-bold text-gray-800">{listing.bathrooms}</span>
              </span>
            )}
            {listing.bathrooms && listing.size && <span className="text-gray-300">•</span>}
            {listing.size && (
              <span className="flex items-center gap-1">
                <i className="bi bi-arrows-angle-expand text-brand-blue text-sm"></i>
                <span className="font-bold text-gray-800">{listing.size}</span>
              </span>
            )}
          </div>
          <button
            onClick={handleFav}
            aria-label="Save to favorites"
            className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all"
          >
            <svg className={`w-5 h-5 ${fav ? "text-red-500 fill-red-500" : "text-gray-300 hover:text-red-400"}`} viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
