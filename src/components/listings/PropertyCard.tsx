"use client";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Listing } from "@/lib/types";
import { formatNaira, propertyTypeLabels } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
}

const COLORS = [
  "from-blue-400/20 to-blue-600/30",
  "from-amber-400/20 to-amber-600/30",
  "from-emerald-400/20 to-emerald-600/30",
  "from-rose-400/20 to-rose-600/30",
  "from-violet-400/20 to-violet-600/30",
  "from-cyan-400/20 to-cyan-600/30",
];

const ICONS: Record<string, string> = {
  house: "🏠", land: "🌍", flat: "🏢", commercial: "🏪",
};

export default function PropertyCard({ listing }: PropertyCardProps) {
  const idx = parseInt(listing.id.replace("l", "")) % COLORS.length;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-sm card-hover"
    >
      <div className="image-zoom relative h-52 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[idx]} flex items-center justify-center zoom-content`}>
          <div className="text-center">
            <div className="text-5xl mb-1">{ICONS[listing.propertyType] || "📍"}</div>
            <p className="text-xs text-gray-500 font-medium">{propertyTypeLabels[listing.propertyType]}</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant={listing.status === "available" ? "success" : listing.status === "reserved" ? "warning" : "default"}>
            {listing.status}
          </Badge>
          {listing.category === "partnership" && (
            <Badge variant="info">Partner</Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-lg drop-shadow-sm">{formatNaira(listing.price)}</p>
          {listing.listingType === "rent" && (
            <p className="text-white/80 text-xs">per year</p>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[var(--color-primary)] transition line-clamp-1">
            {listing.title}
          </h3>
          <span className="shrink-0 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
            {listing.listingType === "rent" ? "Rent" : "Sale"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {listing.city}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
            {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
            {listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
