"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import RentTierBreakdown from "@/components/listings/RentTierBreakdown";
import PriceHistory from "@/components/listings/PriceHistory";
import ValuationEstimate from "@/components/listings/ValuationEstimate";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { formatNaira, formatDate, propertyTypeLabels, rentTierLabels, resolveImageUrl } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser } = useRole();
  const { get: getSetting } = useSettings();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [userReserved, setUserReserved] = useState(false);
  const [showReserveSuccess, setShowReserveSuccess] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [showClauses, setShowClauses] = useState(false);
  const [fav, setFav] = useState(false);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showBuySuccess, setShowBuySuccess] = useState(false);
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [buyType, setBuyType] = useState<"full" | "instalment" | null>(null);
  const [buyLoading, setBuyLoading] = useState(false);

  const openPaystack = (amount: number, purpose: string) => {
    setBuyLoading(true);
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set");
      setBuyLoading(false);
      alert("Payment is not configured. Please contact support.");
      return;
    }

    const doPay = () => {
      try {
        const ref = "MBPP-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
        const handler = (window as any).PaystackPop.setup({
          key: paystackKey,
          email: currentUser?.email || "",
          amount: Math.round(amount * 100),
          currency: "NGN",
          ref,
          metadata: { listingId: listing.id, userId: currentUser?.id, purpose },
          callback: async (response: { reference: string }) => {
            setBuyLoading(false);
            try {
              await api.post(`/api/reservations/${listing.id}`, { paymentRef: response.reference, purpose: "purchase" });
            } catch {}
            setShowBuySuccess(true);
            setShowBuyOptions(false);
          },
          onClose: () => { setBuyLoading(false); },
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack error:", err);
        setBuyLoading(false);
        alert("Payment failed to load. Please try again.");
      }
    };

    if (typeof window !== "undefined" && (window as any).PaystackPop) {
      doPay();
    } else {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => doPay();
      script.onerror = () => {
        setBuyLoading(false);
        alert("Payment system failed to load. Check your internet connection.");
      };
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    api.get<any>(`/api/listings/${id}`).then(r => {
      if (r.data) setListing(r.data.listing || r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => { if (listing) setFav(isFavorite(listing.id)); }, [listing]);

  useEffect(() => {
    if (!id) return;
    api.get<any>(`/api/price-history/listing/${id}`).then(r => {
      if ((r.data as any)?.history) setPriceHistory((r.data as any).history);
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!currentUser || !id) return;
    api.get<{ reservations: any[] }>("/api/reservations/my").then(r => {
      if (r.data?.reservations) {
        const found = r.data.reservations.some((res: any) => res.listing?.id === id);
        setUserReserved(found);
      }
    }).catch(() => {});
  }, [currentUser, id]);

  const handleToggleFav = () => {
    const now = toggleFavorite(listing!.id);
    setFav(now);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          Loading property...
        </div>
      </div>
    );
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: listing.title,
          description: listing.description?.slice(0, 300),
          image: listing.photos?.[0]?.url || undefined,
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "NGN",
            availability: listing.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          },
        }) }}
      />
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <Link href="/list-property" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors mb-4 bg-[var(--color-primary)]/5 px-3 py-1.5 rounded-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
              {listing.photos.length > 0 ? (
                <img
                  src={resolveImageUrl(listing.photos[selectedPhoto]?.url) || ""}
                  alt={listing.photos[selectedPhoto]?.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-6xl">🏠</div>
              )}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge variant={listing.status === "available" ? "success" : listing.status === "reserved" ? "warning" : "default"}>{listing.status}</Badge>
                {listing.category === "partnership" && <Badge variant="info">{listing.partnerCompany}</Badge>}
              </div>
              {listing.photos.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md">
                  {selectedPhoto + 1} / {listing.photos.length}
                </div>
              )}
            </div>

            {listing.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {listing.photos.map((photo: any, i: number) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(i)}
                    className={`w-20 h-16 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                      i === selectedPhoto ? "border-[var(--color-primary)]" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                     <img src={resolveImageUrl(photo.url) || ""} alt={photo.alt || listing?.title || "Property photo"} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{listing.title}</h1>
                  <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {listing.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Posted {formatDate(listing.createdAt)} by {listing.postedBy?.name || "Admin"} {listing.postedBy?.isVerified && <VerifiedBadge />}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-700">{propertyTypeLabels[listing.propertyType]}</span>
                {listing.listingType === "rent" && listing.rentTier && (
                  <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-700">{rentTierLabels[listing.rentTier]}</span>
                )}
                {listing.bedrooms && <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-700">{listing.bedrooms} Bedrooms</span>}
                {listing.bathrooms && <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-700">{listing.bathrooms} Bathrooms</span>}
                {listing.size && <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-700">{listing.size}</span>}
              </div>

              <p className="text-sm text-gray-600 mt-5 leading-relaxed">{listing.description}</p>

              {listing.features && listing.features.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((f: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Location</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <MapPlaceholder lat={listing.lat} lng={listing.lng} label={listing.address} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-lg border border-gray-200 p-6 lg:sticky lg:top-20">
              <div className="pb-5 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {listing.listingType === "rent" ? "Yearly Rent" : "Sale Price"}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{formatNaira(listing.price)}</p>
                  <button onClick={handleToggleFav} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className={`w-5 h-5 ${fav ? "text-red-500 fill-red-500" : "text-gray-500"}`} viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                {listing.listingType === "rent" && <p className="text-xs text-gray-400 mt-1">Due upfront on signing</p>}
                {listing.listingType !== "rent" && <p className="text-xs text-gray-400 mt-1">Full price or pay {listing.downPaymentPercent || 10}% down payment</p>}
                {listing.instalmentAvailable && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Badge variant="success">Instalment plan available</Badge>
                    <p className="text-sm text-gray-700 mt-2 font-medium">
                      from {formatNaira(Math.round((listing.price + listing.price * (listing.instalmentCommission || 0) / 100) / (listing.instalmentMonths || 1)))}/month
                      for {listing.instalmentMonths} months
                    </p>
                  </div>
                )}
              </div>

              {listing.listingType === "rent" && listing.assignedAgent && (
                <div className="py-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Managed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                      {listing.assignedAgent.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">{listing.assignedAgent.name} {listing.assignedAgent?.isVerified && <VerifiedBadge />}</p>
                      <p className="text-xs text-gray-400">Agent</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-5 space-y-3">
                {listing.status === "available" && !userReserved && (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (!currentUser) {
                          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                          return;
                        }
                        setShowClauses(true);
                      }}
                    >
                      Reserve
                    </Button>
                  </>
                )}

                {listing.status === "available" && userReserved && (
                  <Button className="w-full" disabled>
                    Reserved
                  </Button>
                )}

                {listing.reservationCount > 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    {listing.reservationCount} {listing.reservationCount === 1 ? "other also reserved" : "others also reserved"}
                  </p>
                )}

                {listing.status !== "available" && (
                  <Button className="w-full" disabled>
                    {listing.status === "reserved" ? "Reserved" : listing.status === "sold" ? "Sold" : "Rented"}
                  </Button>
                )}

                <Link
                  href={currentUser ? `/messages?listing=${listing.id}&agent=${listing.assignedAgent?.id || listing.postedBy?.id || ""}` : `/login?redirect=${encodeURIComponent(`/messages?listing=${listing.id}&agent=${listing.assignedAgent?.id || listing.postedBy?.id || ""}`)}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Message Agent
                </Link>

                {(() => {
                  const waRaw = listing.assignedAgent?.whatsapp || getSetting("support_whatsapp");
                  if (!waRaw) return null;
                  const clean = waRaw.replace(/[^0-9]/g, "");
                  const msg = encodeURIComponent(`Hi! I'm interested in "${listing.title}" (${formatNaira(listing.price)}) on MBPP.\n\nhttps://mbpproperties.com/listings/${listing.id}`);
                  return (
                    <a
                      href={`https://wa.me/${clean}?text=${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Chat on WhatsApp
                    </a>
                  );
                })()}

                {listing.listingType === "sale" && listing.status === "available" && !userReserved && (
                  <Button
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-gray-900 font-semibold"
                    disabled={buyLoading}
                    onClick={() => {
                      if (!currentUser) {
                        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                        return;
                      }
                      if (listing.instalmentAvailable) {
                        setShowBuyOptions(true);
                      } else {
                        openPaystack(listing.price, "property_full_payment");
                      }
                    }}
                  >
                    {buyLoading ? "Processing..." : "Buy Now"}
                  </Button>
                )}

                {listing.listingType === "rent" && (
                  <Link
                    href={`/apply?listing=${listing.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Rent Now
                  </Link>
                )}
              </div>

              {showReserveSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 text-center">
                  <p className="text-sm font-medium text-green-800">Reserved Successfully!</p>
                  <p className="text-xs text-green-600 mt-1">Expires in 24 hours. No payment required.</p>
                </div>
              )}

              {showBuySuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 text-center">
                  <p className="text-sm font-medium text-green-800">Payment Received!</p>
                  <p className="text-xs text-green-600 mt-1">An MBPP agent will contact you shortly to complete the process.</p>
                </div>
              )}

              {/* Clauses agreement popup */}
              {showClauses && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowClauses(false)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">Reservation Terms</h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        By reserving this property, you agree to the following:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--color-primary)] mt-0.5">•</span>
                          <span>This reservation is <strong>free of charge</strong> and expires after <strong>24 hours</strong>.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--color-primary)] mt-0.5">•</span>
                          <span>Reserving does not guarantee exclusive hold. Other people may also reserve the same property.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--color-primary)] mt-0.5">•</span>
                          <span>You may be contacted by an MBPP agent regarding this property.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[var(--color-primary)] mt-0.5">•</span>
                          <span>You can cancel your reservation at any time before confirmation.</span>
                        </li>
                      </ul>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-sm text-gray-700">I agree to the reservation terms above</span>
                      </label>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => { setShowClauses(false); setAgreedToTerms(false); }}>
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={!agreedToTerms || reserveLoading}
                        onClick={async () => {
                          setReserveLoading(true);
                          try {
                            await api.post(`/api/reservations/${listing.id}`);
                            setShowReserveSuccess(true);
                            setUserReserved(true);
                            setShowClauses(false);
                            setAgreedToTerms(false);
                          } catch {
                            // ignore
                          }
                          setReserveLoading(false);
                        }}
                      >
                        {reserveLoading ? "Reserving..." : "Confirm Reservation"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buy Options Modal */}
            {showBuyOptions && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBuyOptions(false)} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Buy This Property</h3>
                    <p className="text-sm text-gray-500 mt-1">{formatNaira(listing.price)}</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {listing.instalmentAvailable ? (
                      <>
                        <button
                          onClick={() => { setBuyType("full"); setShowBuyOptions(false); openPaystack(listing.price, "property_full_payment"); }}
                          disabled={buyLoading}
                          className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all disabled:opacity-50"
                        >
                          <p className="font-semibold text-gray-900">Pay Full Price</p>
                          <p className="text-sm text-gray-500 mt-1">{formatNaira(listing.price)}</p>
                        </button>
                        <button
                          onClick={() => { setBuyType("instalment"); setShowBuyOptions(false); openPaystack(Math.round(listing.price * (listing.downPaymentPercent || 10) / 100), "property_down_payment"); }}
                          disabled={buyLoading}
                          className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all disabled:opacity-50"
                        >
                          <p className="font-semibold text-gray-900">Instalment Plan</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {listing.downPaymentPercent || 10}% down payment ({formatNaira(Math.round(listing.price * (listing.downPaymentPercent || 10) / 100))})
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Then {formatNaira(Math.round((listing.price - listing.price * (listing.downPaymentPercent || 10) / 100) / (listing.instalmentMonths || 1)))}/month for {listing.instalmentMonths} months
                          </p>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setBuyType("full"); setShowBuyOptions(false); openPaystack(listing.price, "property_full_payment"); }}
                        disabled={buyLoading}
                        className="w-full text-left p-4 rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 disabled:opacity-50"
                      >
                        <p className="font-semibold text-gray-900">Pay Full Price</p>
                        <p className="text-sm text-gray-500 mt-1">{formatNaira(listing.price)}</p>
                      </button>
                    )}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full" onClick={() => setShowBuyOptions(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {listing.listingType === "rent" && <RentTierBreakdown listing={listing} />}

            <ValuationEstimate listing={listing} />

            <PriceHistory
              currentPrice={listing.price}
              history={priceHistory.length > 0 ? priceHistory : [
                { date: listing.createdAt, price: listing.price, reason: "Initial listing" },
              ]}
              priceLabel={listing.priceLabel}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
