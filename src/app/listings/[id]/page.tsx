"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listings } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RentTierBreakdown from "@/components/listings/RentTierBreakdown";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { formatNaira, formatDate, propertyTypeLabels, statusColors } from "@/lib/utils";

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900">Property not found</h2>
          <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const currentPhoto = listing.photos[0];
  const imgColors = ["bg-blue-100", "bg-amber-100", "bg-emerald-100", "bg-rose-100", "bg-violet-100", "bg-cyan-100"];
  const bgIdx = parseInt(listing.id.replace("l", "")) % imgColors.length;

  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition flex items-center gap-1 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className={`relative h-64 md:h-80 ${imgColors[bgIdx]} rounded-2xl overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {listing.propertyType === "house" ? "🏠" :
                     listing.propertyType === "land" ? "🌍" :
                     listing.propertyType === "flat" ? "🏢" :
                     listing.propertyType === "commercial" ? "🏪" : "📍"}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{listing.photos.length} photo{listing.photos.length > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-1.5">
                <Badge variant={listing.status === "available" ? "success" : listing.status === "reserved" ? "warning" : "default"}>
                  {listing.status}
                </Badge>
                {listing.category === "partnership" && <Badge variant="info">{listing.partnerCompany}</Badge>}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {listing.photos.map((photo) => (
                <div key={photo.id} className={`w-20 h-16 shrink-0 ${imgColors[(bgIdx + parseInt(photo.id.slice(-1))) % imgColors.length]} rounded-lg flex items-center justify-center border-2 border-transparent hover:border-[var(--color-primary)] cursor-pointer transition`}>
                  <span className="text-xs text-gray-400">📷</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">📍 {listing.address}</p>
              <p className="text-xs text-gray-400 mt-0.5">Posted {formatDate(listing.createdAt)} by {listing.postedBy.name}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-700">{propertyTypeLabels[listing.propertyType]}</span>
                {listing.listingType === "rent" && listing.rentTier && (
                  <span className="text-xs bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-700">
                    {listing.rentTier === "normal" ? "Normal Rent" : listing.rentTier === "damages" ? "Rent + Damages" : "Full Package"}
                  </span>
                )}
                {listing.bedrooms && <span className="text-xs bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-700">{listing.bedrooms} Bedrooms</span>}
                {listing.bathrooms && <span className="text-xs bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-700">{listing.bathrooms} Bathrooms</span>}
                {listing.sqft && <span className="text-xs bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-700">{listing.sqft.toLocaleString()} sqft</span>}
              </div>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed">{listing.description}</p>

              {listing.features && listing.features.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.features.map((f, i) => (
                      <span key={i} className="text-xs bg-[var(--color-primary)]/5 text-[var(--color-primary)] px-2.5 py-1 rounded-lg">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Location</h3>
              <MapPlaceholder lat={listing.lat} lng={listing.lng} label={listing.address} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-20">
              <div className="text-center pb-4 border-b border-gray-100">
                <p className="text-xs text-gray-500">
                  {listing.listingType === "rent" ? "Yearly Rent" : "Sale Price"}
                </p>
                <p className="text-3xl font-bold text-[var(--color-primary)] mt-1">
                  {formatNaira(listing.price)}
                </p>
                {listing.listingType === "rent" && (
                  <p className="text-xs text-gray-400 mt-0.5">Upfront on signing</p>
                )}
              </div>

              {listing.listingType === "rent" && listing.assignedAgent && (
                <div className="py-3 border-b border-gray-100 text-center">
                  <p className="text-xs text-gray-500">Managed by</p>
                  <p className="text-sm font-medium text-gray-900">{listing.assignedAgent.name}</p>
                  <p className="text-xs text-gray-400">Agent</p>
                </div>
              )}

              <div className="py-4 space-y-2">
                <Button className="w-full" disabled={listing.status !== "available"}>
                  {listing.status === "available" ? "Reserve This Property" : listing.status === "reserved" ? "Reserved" : "Already Taken"}
                </Button>
                <Button variant="outline" className="w-full">
                  Inquire
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Pay via wallet or card at checkout
              </p>
            </div>

            {listing.listingType === "rent" && <RentTierBreakdown listing={listing} />}

            {listing.category === "partnership" && listing.partnerCompany && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-amber-800">🤝 Partnership</p>
                <p className="text-xs text-amber-700 mt-1">
                  Listed on behalf of <strong>{listing.partnerCompany}</strong>. Commission applies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
