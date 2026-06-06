"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { formatNaira } from "@/lib/utils";
import { api } from "@/lib/api-client";

interface FormData {
 listingId: string;
 tenantName: string;
 tenantEmail: string;
 tenantPhone: string;
 landlordName: string;
 startDate: string;
 endDate: string;
 rentDueDay: number;
 annualRent: number;
 damageDeposit: number;
 serviceCharge: number;
 noticePeriodDays: number;
}

const emptyForm: FormData = {
 listingId: "", tenantName: "", tenantEmail: "", tenantPhone: "",
 landlordName: "", startDate: "", endDate: "",
 rentDueDay: 1, annualRent: 0, damageDeposit: 0, serviceCharge: 0, noticePeriodDays: 30,
};

export default function NewAgreementPage() {
 const router = useRouter();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [created, setCreated] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreementId, setAgreementId] = useState("");

  useEffect(() => {
    api.get<{ listings: any[] }>("/api/listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
    }).catch(() => {});
  }, []);

 const update = (field: keyof FormData, value: string | number) => {
 setForm((prev) => ({ ...prev, [field]: value }));
 };

 const selectedListing = listings.find((l) => l.id === form.listingId);

 const handleListingSelect = (id: string) => {
 const listing = listings.find((l) => l.id === id);
 if (listing) {
 setForm((prev) => ({
 ...prev,
 listingId: id,
 landlordName: listing.postedBy.name,
 annualRent: listing.price,
 damageDeposit: listing.damageDeposit || Math.round(listing.price * 0.1),
 serviceCharge: listing.maintenanceCharge || 0,
 }));
 }
 };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const r = await api.post<any>("/api/agreements", {
        tenantName: form.tenantName,
        tenantEmail: form.tenantEmail,
        tenantPhone: form.tenantPhone,
        landlordName: form.landlordName,
        listingId: form.listingId || undefined,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        rentDueDay: form.rentDueDay,
        annualRent: form.annualRent,
        damageDeposit: form.damageDeposit,
        serviceCharge: form.serviceCharge,
        noticePeriodDays: form.noticePeriodDays,
        propertyTitle: selectedListing?.title,
        propertyAddress: selectedListing?.address,
        propertyCity: selectedListing?.city,
      });
      if (r.error) { setError(r.error); setSubmitting(false); return; }
      setAgreementId(r.data?.agreement?.id || "");
      setCreated(true);
    } catch { setError("Failed to create agreement"); }
    setSubmitting(false);
  };

 if (created) {
  const signingUrl = agreementId ? `https://mbpproperties.com/agreements/${agreementId}?role=landlord` : "";
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(signingUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
 return (
 <div className="flex-1 max-w-2xl mx-auto px-4 py-8">
 <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
 <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <h2 className="text-lg font-bold text-gray-900 mb-1">Agreement Created!</h2>
 <p className="text-sm text-gray-500 mb-2">The landlord needs to sign first, then the tenant.</p>
 <p className="text-xs text-gray-400 mb-6">Share the link so they can sign digitally.</p>
 {signingUrl && (
   <div className="mb-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono break-all">{signingUrl}</div>
 )}
 <div className="flex items-center justify-center gap-3 flex-wrap">
   {signingUrl && (
     <>
         <Button size="sm" variant="outline" onClick={copyLink}>{copied ? "Copied!" : "Copy Link"}</Button>
       <a href={`https://wa.me/?text=${encodeURIComponent(`Please sign the tenancy agreement: ${signingUrl}`)}`} target="_blank" rel="noopener noreferrer">
         <Button size="sm" variant="outline">Share via WhatsApp</Button>
       </a>
     </>
   )}
   <Link href="/agent/agreements">
     <Button variant="outline">View All Agreements</Button>
   </Link>
   <Button onClick={() => setCreated(false)}>Create Another</Button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="max-w-3xl mx-auto">
 <div className="mb-6">
 <Link href="/agent/agreements" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition mb-3">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
 Back to agreements
 </Link>
 <h1 className="text-xl font-bold text-gray-900">New Tenancy Agreement</h1>
 <p className="text-sm text-gray-500 mt-0.5">Generate a legally compliant rent agreement for Kano State</p>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
 {/* Select Property */}
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-2">Select Property (optional — pre-fills details)</label>
 <select
 value={form.listingId}
 onChange={(e) => handleListingSelect(e.target.value)}
 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
>
 <option value="">— Select a listing —</option>
 {listings.filter((l) => l.listingType === "rent").map((l) => (
 <option key={l.id} value={l.id}>{l.title} — {formatNaira(l.price)}/yr</option>
 ))}
 </select>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {/* Tenant */}
 <div className="col-span-2">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Tenant Information</h3>
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Tenant Full Name *</label>
 <input value={form.tenantName} onChange={(e) => update("tenantName", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Full name" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Tenant Email *</label>
 <input type="email" value={form.tenantEmail} onChange={(e) => update("tenantEmail", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Email" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Tenant Phone</label>
 <input value={form.tenantPhone} onChange={(e) => update("tenantPhone", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Phone number" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Landlord/Agent Name *</label>
 <input value={form.landlordName} onChange={(e) => update("landlordName", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Landlord or agent name" />
 </div>

 {/* Dates */}
 <div className="col-span-2 mt-2">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Agreement Term</h3>
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
 <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">End Date *</label>
 <input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Rent Due Day of Month</label>
 <input type="number" min={1} max={31} value={form.rentDueDay} onChange={(e) => update("rentDueDay", parseInt(e.target.value) || 1)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Notice Period (days)</label>
 <input type="number" min={7} max={90} value={form.noticePeriodDays} onChange={(e) => update("noticePeriodDays", parseInt(e.target.value) || 30)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" />
 </div>

 {/* Financial */}
 <div className="col-span-2 mt-2">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Financial Details</h3>
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Annual Rent (₦) *</label>
 <input type="number" min={0} value={form.annualRent} onChange={(e) => update("annualRent", parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. 1200000" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Damage Deposit (₦)</label>
 <input type="number" min={0} value={form.damageDeposit} onChange={(e) => update("damageDeposit", parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. 150000" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Service/Maintenance Charge (₦)</label>
 <input type="number" min={0} value={form.serviceCharge} onChange={(e) => update("serviceCharge", parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. 75000" />
 </div>
 </div>

 {/* Preview */}
 {form.tenantName && form.landlordName && form.startDate && form.annualRent> 0 && (
 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-2">Summary</p>
 <div className="text-xs text-gray-600 space-y-1">
 <p><span className="font-medium text-gray-700">Tenant:</span> {form.tenantName}</p>
 <p><span className="font-medium text-gray-700">Landlord:</span> {form.landlordName}</p>
 <p><span className="font-medium text-gray-700">Term:</span> {form.startDate} → {form.endDate || "Open"}</p>
 <p><span className="font-medium text-gray-700">Rent:</span> {formatNaira(form.annualRent)}/yr</p>
 </div>
 </div>
 )}

  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
    {error && <span className="text-xs text-red-600 mr-auto">{error}</span>}
    <Link href="/agent/agreements">
      <Button variant="outline">Cancel</Button>
    </Link>
    <Button
      disabled={!form.tenantName || !form.tenantEmail || !form.landlordName || !form.startDate || form.annualRent <= 0 || submitting}
      onClick={handleSubmit}
    >
      {submitting ? "Creating..." : "Create Agreement \u2192 Send for Signing"}
    </Button>
  </div>
 </div>
 </div>
 );
}
