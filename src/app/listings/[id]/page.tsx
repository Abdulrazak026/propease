"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { listings } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RentTierBreakdown from "@/components/listings/RentTierBreakdown";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser } = useRole();
  const listing = listings.find((l) => l.id === id);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showInquireModal, setShowInquireModal] = useState(false);
  const [inquireMsg, setInquireMsg] = useState("");
  const [reserveStep, setReserveStep] = useState<"confirm" | "pay" | "done">("confirm");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                  <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {listing.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Posted {formatDate(listing.createdAt)} by {listing.postedBy.name}</p>
                </div>
                <button onClick={() => setShowShareModal(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-50 border border-gray-200 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share
                </button>
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
                <Button className="w-full" disabled={listing.status !== "available"} onClick={() => { if (!currentUser) { router.push("/login"); return; } setShowReserveModal(true); }}>
                  {listing.status === "available" ? "Reserve This Property" : listing.status === "reserved" ? "Reserved" : "Already Taken"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { if (!currentUser) { router.push("/login"); return; } setShowInquireModal(true); }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Inquire
                </Button>
              </div>

              {bookingSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-sm font-medium text-emerald-800">Reservation Confirmed!</p>
                  <p className="text-xs text-emerald-600 mt-1">Holding deposit of ₦{(listing.listingType === "rent" ? (listing.damageDeposit || Math.round(listing.price * 0.1)) : Math.round((listing.salePrice || listing.price) * 0.05)).toLocaleString()} received. Expires in 48 hours.</p>
                </div>
              )}

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

      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (reserveStep !== "done") setShowReserveModal(false); }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {reserveStep === "confirm" && (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Confirm Reservation</h3>
                <p className="text-xs text-gray-500 mb-4">Review the terms before proceeding.</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Property</span><span className="text-gray-900 font-medium">{listing.title}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Price</span><span className="text-gray-900">{formatNaira(listing.price)}{listing.listingType === "rent" ? "/yr" : ""}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Holding Deposit</span><span className="text-gray-900 font-medium">{formatNaira(listing.listingType === "rent" ? (listing.damageDeposit || Math.round(listing.price * 0.1)) : Math.round((listing.salePrice || listing.price) * 0.05))}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Valid Until</span><span className="text-gray-900">48 hours</span></div>
                </div>
                <p className="text-xs text-gray-400 mb-4">The holding deposit secures the property and is deducted from your first payment. Refundable per cancellation policy.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowReserveModal(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={() => setReserveStep("pay")}>Continue to Pay</Button>
                </div>
              </>
            )}
            {reserveStep === "pay" && (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Payment Method</h3>
                <p className="text-xs text-gray-500 mb-4">Choose how to pay the holding deposit.</p>
                <div className="space-y-2 mb-4">
                  <button onClick={() => setReserveStep("done")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div className="flex-1"><p className="text-sm font-medium text-gray-900">Pay with Card</p><p className="text-xs text-gray-500">Simulated Paystack checkout</p></div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button onClick={() => setReserveStep("done")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <div className="flex-1"><p className="text-sm font-medium text-gray-900">Pay with Wallet</p><p className="text-xs text-gray-500">Balance: {formatNaira(currentUser?.walletBalance || 0)}</p></div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <Button variant="ghost" className="w-full" onClick={() => setReserveStep("confirm")}>← Back</Button>
              </>
            )}
            {reserveStep === "done" && (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Successful!</h3>
                <p className="text-sm text-gray-500 mb-1">Holding deposit paid. The property is reserved for 48 hours.</p>
                <p className="text-xs text-gray-400">Reference: RES-{listing.id.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                <div className="mt-6">
                  <Button onClick={() => { setShowReserveModal(false); setReserveStep("confirm"); setBookingSuccess(true); }}>Done</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setShowShareModal(false); setCopied(false); }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Share this Property</h3>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-200 mb-4">
              <input readOnly value={`https://propease-demo.vercel.app/listings/${listing.id}`} className="flex-1 bg-transparent text-xs font-mono text-gray-600 outline-none" />
              <button onClick={() => { navigator.clipboard.writeText(`https://propease-demo.vercel.app/listings/${listing.id}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-all"
              >{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div className="flex gap-2">
              {[
                { name: "WhatsApp", color: "bg-green-500", url: `https://wa.me/?text=${encodeURIComponent(`Check out this property on PropEase: ${listing.title}`)}` },
                { name: "Twitter", color: "bg-blue-500", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this property on PropEase: ${listing.title}`)}` },
                { name: "Email", color: "bg-gray-600", url: `mailto:?subject=${encodeURIComponent(`Property: ${listing.title}`)}&body=${encodeURIComponent(`Check out this listing on PropEase: https://propease-demo.vercel.app/listings/${listing.id}`)}` },
              ].map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={`${s.color} text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-all text-center flex-1`}>
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {showInquireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowInquireModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Send Inquiry</h3>
            <p className="text-xs text-gray-500 mb-4">Ask about this property. The agent will respond shortly.</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
                <input defaultValue={currentUser?.name || ""} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contact</label>
                <input defaultValue={currentUser?.email || ""} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={3} value={inquireMsg} onChange={(e) => setInquireMsg(e.target.value)} placeholder="e.g. Is this still available? Can I schedule a viewing?" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowInquireModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { setShowInquireModal(false); setInquireMsg(""); }}>Send Inquiry</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
