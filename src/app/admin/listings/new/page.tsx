"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { api, getAccessToken } from "@/lib/api-client";
import { useSettings } from "@/context/SettingsContext";

const API = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";

const PROPERTY_TYPES = ["house", "flat", "land", "commercial", "other"] as const;
const LISTING_TYPES = ["sale", "rent"] as const;
const RENT_TIERS = ["rent_only", "rent_management", "rent_full"] as const;
const FEATURES = ["Borehole", "Parking", "Security", "Pool", "Gym", "Solar", "Furnished", "CCTV"];

export default function AdminNewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", propertyType: "house", listingType: "sale",
    city: "Kano Municipal", address: "", price: "", salePrice: "",
    annualRent: "", damageDeposit: "", maintenanceCharge: "",
    rentTier: "rent_only", bedrooms: "", bathrooms: "", sqft: "",
    features: [] as string[], category: "portfolio" as "portfolio" | "partnership",
    partnerCompany: "", negotiable: false,
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { get } = useSettings();

  const rawCities = get("available_cities") || "Kano Municipal, Kano State; Fagge, Kano State; Tarauni, Kano State; Nassarawa, Kano State";
  const CITIES = rawCities.split(";").map(c => c.trim().split(",")[0].trim()).filter(Boolean);

  const u = (f: string, v: any) => setForm(p => ({ ...p, [f]: v }));
  const tf = (f: string) => (e: any) => u(f, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  const toggleFeature = (feature: string) => {
    setForm(p => ({
      ...p,
      features: p.features.includes(feature) ? p.features.filter(f => f !== feature) : [...p.features, feature],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const token = getAccessToken();
    for (const file of Array.from(files).slice(0, 10)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch(`${API}/api/upload`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
        if (res.ok) { const { url } = await res.json(); setUploadedUrls(prev => [...prev, url]); }
      } catch {}
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const price = parseInt(form.price) || 0;
      const r = await api.post("/api/listings", {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        listingType: form.listingType,
        city: form.city,
        address: form.address,
        price,
        salePrice: form.listingType === "sale" ? parseInt(form.salePrice) || price : undefined,
        annualRent: form.listingType === "rent" ? parseInt(form.annualRent) || price : undefined,
        damageDeposit: form.damageDeposit ? parseInt(form.damageDeposit) : undefined,
        maintenanceCharge: form.maintenanceCharge ? parseInt(form.maintenanceCharge) : undefined,
        rentTier: form.listingType === "rent" ? form.rentTier : undefined,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
        sqft: form.sqft ? parseInt(form.sqft) : undefined,
        features: form.features,
        category: form.category,
        partnerCompany: form.category === "partnership" ? form.partnerCompany : undefined,
        negotiable: form.negotiable,
        photos: uploadedUrls,
        status: "draft",
      });
      if (r.error) { setError(r.error); setSubmitting(false); return; }
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to create listing");
    }
    setSubmitting(false);
  };

  if (success) return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Listing Created!</h2>
      <p className="text-sm text-gray-500 mt-2">Your listing is now in draft mode. Submit for review to publish.</p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <Button variant="outline" onClick={() => router.push("/admin/moderation")}>View in Moderation</Button>
        <Button onClick={() => { setSuccess(false); setForm(p => ({ ...p, title: "", description: "", price: "", salePrice: "", annualRent: "", address: "", bedrooms: "", bathrooms: "", sqft: "", partnerCompany: "" })); setUploadedUrls([]); }}>Create Another</Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div><h1 className="text-xl font-bold text-gray-900">New Listing</h1><p className="text-xs text-gray-500">Create a property listing with all details</p></div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Basic Info */}
        <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input required value={form.title} onChange={tf("title")} placeholder="e.g. 3-Bedroom Bungalow in Kano Municipal" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
          <textarea required value={form.description} onChange={tf("description")} rows={3} placeholder="Describe the property, location, features..." className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Property Type</label>
            <select value={form.propertyType} onChange={tf("propertyType")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Listing Type</label>
            <select value={form.listingType} onChange={tf("listingType")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
              {LISTING_TYPES.map(t => <option key={t} value={t}>{t === "sale" ? "For Sale" : "For Rent"}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
            <select required value={form.city} onChange={tf("city")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
          <input value={form.address} onChange={tf("address")} placeholder="e.g. No. 15 Zaria Road" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        </div>

        {/* Pricing */}
        <h3 className="text-sm font-semibold text-gray-900 pt-2">Pricing</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Price (NGN) *</label>
          <input type="number" required min="0" value={form.price} onChange={tf("price")} placeholder="e.g. 15000000" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
        </div>

        {form.listingType === "sale" && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sale Price (NGN)</label>
            <input type="number" value={form.salePrice} onChange={tf("salePrice")} placeholder="Same as price if not set" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
        )}

        {form.listingType === "rent" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Annual Rent (NGN)</label>
                <input type="number" value={form.annualRent} onChange={tf("annualRent")} placeholder="e.g. 1200000" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Damage Deposit</label>
                <input type="number" value={form.damageDeposit} onChange={tf("damageDeposit")} placeholder="e.g. 150000" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Service Charge</label>
                <input type="number" value={form.maintenanceCharge} onChange={tf("maintenanceCharge")} placeholder="e.g. 50000" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rent Tier</label>
              <div className="flex gap-2">
                {RENT_TIERS.map(tier => (
                  <button key={tier} type="button" onClick={() => u("rentTier", tier)} className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${form.rentTier === tier ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                    {tier === "rent_only" ? "Basic" : tier === "rent_management" ? "With Damages" : "Full Package"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={tf("negotiable")} className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
          <label htmlFor="negotiable" className="text-sm text-gray-700">Price is negotiable</label>
        </div>

        {/* Details */}
        <h3 className="text-sm font-semibold text-gray-900 pt-2">Property Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms} onChange={tf("bedrooms")} placeholder="e.g. 3" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms} onChange={tf("bathrooms")} placeholder="e.g. 2" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Area (sqft)</label>
            <input type="number" min="0" value={form.sqft} onChange={tf("sqft")} placeholder="e.g. 1500" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Features</label>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map(f => (
              <button key={f} type="button" onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.features.includes(f) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={tf("category")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
              <option value="portfolio">Own Portfolio</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
          {form.category === "partnership" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Partner Company</label>
              <input value={form.partnerCompany} onChange={tf("partnerCompany")} placeholder="Company name" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
            </div>
          )}
        </div>

        {/* Photos */}
        <h3 className="text-sm font-semibold text-gray-900 pt-2">Photos</h3>
        <input type="file" ref={fileRef} multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition cursor-pointer">
          <p className="text-sm font-medium text-gray-700">{uploading ? "Uploading..." : "Click to Upload Photos"}</p>
          <p className="text-xs text-gray-400 mt-1">Max 10 files, JPG/PNG/WebP</p>
          {uploadedUrls.length > 0 && <p className="text-xs text-emerald-600 mt-2">{uploadedUrls.length} uploaded</p>}
        </div>
        {uploadedUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadedUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <a href="/admin"><Button variant="outline">Cancel</Button></a>
          <Button type="submit" disabled={submitting || !form.title || !form.description || !parseInt(form.price)}>{submitting ? "Creating..." : "Create Listing"}</Button>
        </div>
      </form>
    </div>
  );
}
