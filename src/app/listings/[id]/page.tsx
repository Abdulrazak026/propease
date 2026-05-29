"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { listings } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RentTierBreakdown from "@/components/listings/RentTierBreakdown";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === id);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  if (!listing) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Property not found</h2>
          <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">← Back to listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="relative h-72 md:h-96 bg-gray-100 rounded-2xl overflow-hidden">
              {listing.photos.length > 0 ? (
                <img
                  src={listing.photos[selectedPhoto]?.url}
                  alt={listing.photos[selectedPhoto]?.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl">🏠</span></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex gap-1.5">
                <Badge variant={listing.status === "available" ? "success" : listing.status === "reserved" ? "warning" : "default"}>{listing.status}</Badge>
                {listing.category === "partnership" && <Badge variant="info">{listing.partnerCompany}</Badge>}
              </div>
              {listing.photos.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg">
                  {selectedPhoto + 1} / {listing.photos.length}
                </div>
              )}
            </div>

            {listing.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {listing.photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(i)}
                    className={`w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedPhoto ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                  <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {listing.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Posted {formatDate(listing.createdAt)} by {listing.postedBy.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">{propertyTypeLabels[listing.propertyType]}</span>
                {listing.listingType === "rent" && listing.rentTier && (
                  <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">
                    {listing.rentTier === "normal" ? "Normal Rent" : listing.rentTier === "damages" ? "Rent + Damages" : "Full Package"}
                  </span>
                )}
                {listing.bedrooms && <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">{listing.bedrooms} Bedrooms</span>}
                {listing.bathrooms && <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">{listing.bathrooms} Bathrooms</span>}
                {listing.sqft && <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">{listing.sqft.toLocaleString()} sqft</span>}
              </div>

              <p className="text-sm text-gray-600 mt-5 leading-relaxed">{listing.description}</p>

              {listing.features && listing.features.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((f, i) => (
                      <span key={i} className="text-xs bg-[var(--color-primary)]/5 text-[var(--color-primary)] px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/10">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Location</h3>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <MapPlaceholder lat={listing.lat} lng={listing.lng} label={listing.address} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm lg:sticky lg:top-24">
              <div className="pb-5 border-b border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {listing.listingType === "rent" ? "Yearly Rent" : "Sale Price"}
                </p>
                <p className="text-3xl font-bold text-[var(--color-primary)] mt-1">{formatNaira(listing.price)}</p>
                {listing.listingType === "rent" && <p className="text-xs text-gray-400 mt-1">Due upfront on signing</p>}
              </div>

              {listing.listingType === "rent" && listing.assignedAgent && (
                <div className="py-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Managed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-sm font-bold">
                      {listing.assignedAgent.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{listing.assignedAgent.name}</p>
                      <p className="text-xs text-gray-400">Agent</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="py-5 space-y-3">
                <Button className="w-full" disabled={listing.status !== "available"}>
                  {listing.status === "available" ? "Reserve This Property" : listing.status === "reserved" ? "Reserved" : "Already Taken"}
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Inquire
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Pay via wallet or card at checkout
              </p>
            </div>

            {listing.listingType === "rent" && <RentTierBreakdown listing={listing} />}

            {listing.category === "partnership" && listing.partnerCompany && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Partnership Listing
                </h4>
                <p className="text-xs text-amber-700 mt-2">Listed on behalf of <strong>{listing.partnerCompany}</strong>. Commission applies.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
