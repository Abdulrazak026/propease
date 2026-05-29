"use client";
import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Listing } from "@/lib/types";
import { formatNaira, statusColors, propertyTypeLabels } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const bgColors = [
    "bg-blue-100", "bg-amber-100", "bg-emerald-100",
    "bg-rose-100", "bg-violet-100", "bg-cyan-100",
  ];
  const imgIndex = parseInt(listing.id.replace("l", "")) % bgColors.length;
  const bgColor = bgColors[imgIndex];
  const photoCount = listing.photos.length;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      <div className={`relative h-48 ${bgColor} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-1">
              {listing.propertyType === "house" ? "🏠" :
               listing.propertyType === "land" ? "🌍" :
               listing.propertyType === "flat" ? "🏢" :
               listing.propertyType === "commercial" ? "🏪" : "📍"}
            </div>
            <p className="text-xs text-gray-500 font-medium">{listing.propertyType}</p>
            <p className="text-[10px] text-gray-400 mt-1">{photoCount} photo{photoCount > 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant={listing.status === "available" ? "success" : listing.status === "reserved" ? "warning" : "default"}>
            {listing.status}
          </Badge>
          {listing.category === "partnership" && (
            <Badge variant="info">Partner</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md font-medium text-gray-700 shadow-sm">
            {propertyTypeLabels[listing.propertyType]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[var(--color-primary)] transition line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          📍 {listing.address}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="font-bold text-[var(--color-primary)] text-sm">
            {formatNaira(listing.price)}
            {listing.listingType === "rent" && <span className="font-normal text-xs text-gray-400">/yr</span>}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
            {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
