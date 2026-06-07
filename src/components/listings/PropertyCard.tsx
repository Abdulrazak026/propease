"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { resolveImageUrl } from "@/lib/utils";
import { Listing } from "@/lib/types";
import { formatNaira, propertyTypeLabels } from "@/lib/utils";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useCompare } from "@/lib/compare-context";

interface PropertyCardProps {
  listing: Listing;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const hasPhoto = listing.photos.length > 0;
  const [fav, setFav] = useState(false);
  const compare = useCompare();
  const inCompare = compare.has(listing.id);

  useEffect(() => { setFav(isFavorite(listing.id)); }, [listing.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(listing.id));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      compare.remove(listing.id);
    } else {
      compare.add({
        id: listing.id,
        title: listing.title,
        city: listing.city,
        price: listing.price,
        listingType: listing.listingType,
        propertyType: listing.propertyType,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        sqft: listing.sqft,
        photo: listing.photos?.[0]?.url,
      });
    }
  };

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md active:shadow-sm transition-all active:scale-[0.99]"
    >
      <div className="relative h-48 bg-gray-100">
        {hasPhoto ? (
          <img src={resolveImageUrl(listing.photos[0].url) || ""} alt={listing.photos[0].alt} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-3xl">🏠</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge variant={listing.status === "available" ? "success" : listing.status === "reserved" ? "warning" : "default"}>
            {listing.status}
          </Badge>
          {listing.category === "partnership" && <Badge variant="info">Partner</Badge>}
          {listing.postedBy?.isVerified && <VerifiedBadge />}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button onClick={handleFav} className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white hover:shadow-md active:scale-90 transition-all">
            <svg className={`w-4 h-4 ${fav ? "text-red-500 fill-red-500" : "text-gray-600"}`} viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleCompare}
            aria-label="Add to compare"
            className={`w-9 h-9 rounded-full flex items-center justify-center hover:shadow-md active:scale-90 transition-all ${inCompare ? "bg-[var(--color-primary)] text-white" : "bg-white/80 text-gray-600 hover:bg-white"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-9L16.5 3m0 0L12 7.5m4.5-4.5v13.5" /></svg>
          </button>
        </div>

        <div className="absolute bottom-2 left-3 backdrop-blur-sm bg-black/40 rounded-md px-1.5 py-0.5">
          <p className="text-white font-bold text-base">{formatNaira(listing.price)}</p>
          {listing.listingType === "rent" && <p className="text-white/70 text-[11px]">per year</p>}
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.city}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
            {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
            {listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            {listing.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
      </div>
    </Link>
  );
}
