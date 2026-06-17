"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { api, getAccessToken } from "@/lib/api-client";
import { resolveImageUrl } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

const API_URL = "https://mbpproperties.com";
const PROPERTY_TYPES = ["house", "flat", "land", "commercial", "other"];
const FEATURES = ["Borehole", "Parking", "Security", "Pool", "Gym", "Solar", "Furnished", "CCTV"];

export default function AdminEditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { get } = useSettings();

  const rawCities = get("available_cities") || "Kano Municipal, Kano State; Fagge, Kano State; Tarauni, Kano State; Nassarawa, Kano State";
  const CITIES = rawCities.split(";").map(c => c.trim().split(",")[0].trim()).filter(Boolean);

  useEffect(() => {
    api.get<any>(`/api/listings/${id}`).then(r => {
      if (r.data) {
        const l = (r.data as any).listing || r.data;
        setForm({
          title: l.title || "", description: l.description || "", propertyType: l.propertyType || "house",
          listingType: l.listingType || "sale", city: l.city || "Kano Municipal", address: l.address || "",
          price: String(l.price || 0), salePrice: String(l.salePrice || ""), annualRent: String(l.annualRent || ""),
          damageDeposit: String(l.damageDeposit || ""), maintenanceCharge: String(l.maintenanceCharge || ""),
          rentTier: l.rentTier || "rent_only", bedrooms: String(l.bedrooms || ""), bathrooms: String(l.bathrooms || ""),
          sqft: String(l.sqft || ""), features: l.features || [], category: l.category || "portfolio",
          partnerCompany: l.partnerCompany || "", negotiable: l.negotiable || false,
        });
        if (l.photos) setUploadedUrls(l.photos.map((p: any) => p.url));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const u = (f: string, v: any) => setForm((p: any) => ({ ...p, [f]: v }));
  const tf = (f: string) => (e: any) => u(f, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  const toggleFeature = (feat: string) => {
    setForm((p: any) => ({ ...p, features: p.features.includes(feat) ? p.features.filter((f: string) => f !== feat) : [...p.features, feat] }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const token = getAccessToken();
    for (const file of Array.from(files).slice(0, 10 - uploadedUrls.length)) {
      const fd = new FormData(); fd.append("file", file);
      try {
        const res = await fetch(`${API_URL}/api/upload`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd, credentials: "include" });
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
      const r = await api.put(`/api/listings/${id}`, {
        title: form.title, description: form.description, propertyType: form.propertyType,
        listingType: form.listingType, city: form.city, address: form.address, price,
        salePrice: form.listingType === "sale" ? parseInt(form.salePrice) || price : undefined,
        annualRent: form.listingType === "rent" ? parseInt(form.annualRent) || price : undefined,
        damageDeposit: form.damageDeposit ? parseInt(form.damageDeposit) : undefined,
        maintenanceCharge: form.maintenanceCharge ? parseInt(form.maintenanceCharge) : undefined,
        rentTier: form.listingType === "rent" ? form.rentTier : undefined,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
        sqft: form.sqft ? parseInt(form.sqft) : undefined,
        features: form.features, category: form.category,
        partnerCompany: form.category === "partnership" ? form.partnerCompany : undefined,
        negotiable: form.negotiable,
        photos: uploadedUrls.map(url => ({ url })),
      });
      if (r.error) { setError(r.error); } else { setSuccess(true); }
    } catch { setError("Failed to update"); }
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!form) return <div className="text-center py-16 text-gray-500">Listing not found</div>;

  if (success) return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Listing Updated!</h2>
      <div className="flex items-center justify-center gap-3 mt-6">
        <Button variant="outline" onClick={() => router.push("/admin/outsourcing")}>Back to Outsourcing</Button>
        <a href={`/listings/${id}`} target="_blank" rel="noopener noreferrer"><Button>View Listing</Button></a>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin/outsourcing" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div><h1 className="text-xl font-bold text-gray-900">Edit Listing</h1><p className="text-xs text-gray-500">{form.title}</p></div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Title *</label><input required value={form.title} onChange={tf("title")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Description *</label><textarea required value={form.description} onChange={tf("description")} rows={3} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y" /></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Type</label><select value={form.propertyType} onChange={tf("propertyType")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"><option value="house">House</option><option value="flat">Flat</option><option value="land">Land</option><option value="commercial">Commercial</option><option value="other">Other</option></select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Sale/Rent</label><select value={form.listingType} onChange={tf("listingType")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"><option value="sale">For Sale</option><option value="rent">For Rent</option></select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">City *</label><select required value={form.city} onChange={tf("city")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm">{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Address</label><input value={form.address} onChange={tf("address")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Pricing</h3>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Price (NGN) *</label><input type="number" required min="0" value={form.price} onChange={tf("price")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div>
        {form.listingType === "sale" && <div><label className="block text-xs font-medium text-gray-700 mb-1">Sale Price</label><input type="number" value={form.salePrice} onChange={tf("salePrice")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div>}
        {form.listingType === "rent" && <><div className="grid grid-cols-3 gap-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Annual Rent</label><input type="number" value={form.annualRent} onChange={tf("annualRent")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Deposit</label><input type="number" value={form.damageDeposit} onChange={tf("damageDeposit")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Service Charge</label><input type="number" value={form.maintenanceCharge} onChange={tf("maintenanceCharge")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Rent Tier</label><div className="flex gap-2">{(["rent_only","rent_management","rent_full"] as const).map(t => <button key={t} type="button" onClick={() => u("rentTier", t)} className={`px-4 py-2 rounded-lg text-xs font-medium border ${form.rentTier===t?"bg-[var(--color-primary)] text-white":"bg-white text-gray-600"}`}>{t==="rent_only"?"Basic":t==="rent_management"?"+Damages":"Full"}</button>)}</div></div></>}

        <div className="flex items-center gap-2"><input type="checkbox" id="negotiable" checked={form.negotiable} onChange={tf("negotiable")} className="rounded" /><label htmlFor="negotiable" className="text-sm text-gray-700">Price negotiable</label></div>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Details</h3>
        <div className="grid grid-cols-3 gap-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Beds</label><input type="number" value={form.bedrooms} onChange={tf("bedrooms")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Baths</label><input type="number" value={form.bathrooms} onChange={tf("bathrooms")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Sqft</label><input type="number" value={form.sqft} onChange={tf("sqft")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div></div>

        <div><label className="block text-xs font-medium text-gray-700 mb-2">Features</label><div className="flex flex-wrap gap-2">{FEATURES.map(f => <button key={f} type="button" onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${form.features.includes(f)?"bg-[var(--color-primary)] text-white":"bg-white text-gray-600"}`}>{f}</button>)}</div></div>

        <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={tf("category")} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"><option value="portfolio">Portfolio</option><option value="partnership">Partnership</option></select></div>{form.category==="partnership"&&<div><label className="block text-xs font-medium text-gray-700 mb-1">Partner</label><input value={form.partnerCompany} onChange={tf("partnerCompany")} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm" /></div>}</div>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Photos</h3>
        <input type="file" ref={fileRef} multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition cursor-pointer"><p className="text-sm font-medium text-gray-700">{uploading ? "Uploading..." : "Click to Add More"}</p><p className="text-xs text-gray-400 mt-1">Max 10 total</p></div>
        {uploadedUrls.length > 0 && <div className="flex flex-wrap gap-2">{uploadedUrls.map((url, i) => <img key={i} src={resolveImageUrl(url)!} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />)}</div>}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <a href="/admin/outsourcing"><Button variant="outline">Cancel</Button></a>
          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </div>
  );
}
