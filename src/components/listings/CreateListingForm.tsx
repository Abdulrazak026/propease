"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api, getAccessToken } from "@/lib/api-client";

const API = process.env.NEXT_PUBLIC_API_URL || "https://mbpproperties.com";

interface CreateListingFormProps {
  backHref: string;
  title: string;
  subtitle: string;
  successRedirectTo: string;
  defaultCity?: string;
}

async function compressImage(file: File, maxW = 1600, quality = 0.7): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", quality);
    };
    img.src = url;
  });
}

export default function CreateListingForm({ backHref, title, subtitle, successRedirectTo, defaultCity }: CreateListingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "house",
    listingType: "rent",
    bedrooms: "",
    bathrooms: "",
    size: "",
    city: defaultCity || "Kano Municipal",
    lat: "11.9950",
    lng: "8.5350",
    rentTier: "normal",
    price: "",
    annualRent: "",
    damageDeposit: "",
    maintenanceCharge: "",
    salePrice: "",
    category: "company",
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const token = getAccessToken();
    for (const file of Array.from(files).slice(0, 10)) {
      try {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.append("file", compressed, file.name);
        const res = await fetch(`${API}/api/upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });
        if (res.ok) {
          const { url } = await res.json();
          setUploadedUrls(prev => [...prev, url]);
        }
      } catch {}
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const body: any = {
      title: form.title,
      description: form.description,
      propertyType: form.propertyType,
      listingType: form.listingType,
      city: form.city,
      address: "Awaiting address",
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      size: form.size || undefined,
      category: form.category,
      features: [],
      lat: form.lat ? parseFloat(form.lat) : undefined,
      lng: form.lng ? parseFloat(form.lng) : undefined,
      photos: uploadedUrls.map(u => ({ url: u })),
      status: "draft",
    };

    if (form.listingType === "rent") {
      body.annualRent = form.annualRent ? parseInt(form.annualRent) : 0;
      body.rentTier = form.rentTier;
      body.damageDeposit = form.damageDeposit ? parseInt(form.damageDeposit) : undefined;
      body.maintenanceCharge = form.maintenanceCharge ? parseInt(form.maintenanceCharge) : undefined;
      body.price = body.annualRent;
    } else {
      body.price = form.price ? parseInt(form.price) : 0;
      body.salePrice = form.salePrice ? parseInt(form.salePrice) : undefined;
    }

    const { status } = await api.post("/api/listings", body);
    setSubmitting(false);
    if (status === 201) {
      setSuccess(true);
      setTimeout(() => router.push(successRedirectTo), 2000);
    } else {
      setError("Failed to create listing. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Listing Created!</h2>
        <p className="text-sm text-gray-500 mt-2">Your property is saved as draft. An admin will review and publish it within 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <a href={backHref} className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {["Details", "Photos & Location", "Pricing"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step >= i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-400"
            }`}>{i + 1}</div>
            <span className={`text-xs hidden sm:block ${step >= i + 1 ? "text-gray-900 font-medium" : "text-gray-400"}`}>{label}</span>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-[var(--color-primary)]" : "bg-gray-100"}`} />}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6 space-y-4">
        {step === 1 && (
          <>
            <h2 className="font-semibold text-gray-900 text-sm">Property Details</h2>
            <Input label="Title" name="title" required placeholder="e.g. 3-Bedroom House in Kano Municipal" value={form.title} onChange={e => updateForm("title", e.target.value)} />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows={4} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none" placeholder="Describe the property..." value={form.description} onChange={e => updateForm("description", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select name="propertyType" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={form.propertyType} onChange={e => updateForm("propertyType", e.target.value)}>
                  <option value="house">House</option><option value="flat">Flat</option><option value="land">Land</option><option value="commercial">Commercial</option><option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Listing Type</label>
                <select name="listingType" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={form.listingType} onChange={e => updateForm("listingType", e.target.value)}>
                  <option value="rent">For Rent</option><option value="sale">For Sale</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Bedrooms" name="bedrooms" type="number" placeholder="3" value={form.bedrooms} onChange={e => updateForm("bedrooms", e.target.value)} />
              <Input label="Bathrooms" name="bathrooms" type="number" placeholder="2" value={form.bathrooms} onChange={e => updateForm("bathrooms", e.target.value)} />
            </div>
            <Input label="Plot Size (e.g. 50x100)" name="size" placeholder="50x100" value={form.size} onChange={e => updateForm("size", e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <select name="city" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={form.city} onChange={e => updateForm("city", e.target.value)}>
                  <option>Kano Municipal</option><option>Fagge</option><option>Tarauni</option><option>Nassarawa</option>
                </select>
              </div>
            </div>
            <Button type="button" className="w-full" onClick={() => setStep(2)}>Next: Photos & Location</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold text-gray-900 text-sm">Photos & Location</h2>
            <input type="file" ref={fileRef} multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition cursor-pointer">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-medium text-gray-700">{uploading ? "Uploading..." : "Upload Photos"}</p>
              <p className="text-xs text-gray-400 mt-1">Click to browse</p>
              <p className="text-xs text-gray-300 mt-2">Max 10 files • JPG, PNG, WebP</p>
            </div>
            {uploadedUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => setUploadedUrls(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                  </div>
                ))}
              </div>
            )}
            {uploadedUrls.length > 0 && <p className="text-xs text-emerald-600 mt-2">{uploadedUrls.length} uploaded</p>}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">📍 Location Coordinates</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Latitude</label><input name="lat" type="number" step="any" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" value={form.lat} onChange={e => updateForm("lat", e.target.value)} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Longitude</label><input name="lng" type="number" step="any" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" value={form.lng} onChange={e => updateForm("lng", e.target.value)} /></div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2" onClick={() => setStep(1)}>← Back</Button>
              <Button className="w-1/2" onClick={() => setStep(3)}>Next: Pricing</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold text-gray-900 text-sm">Pricing</h2>

            {form.listingType === "rent" && (
              <>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Rent Tier</label>
                  <div className="flex gap-2">
                    {["normal", "damages", "full"].map((tier) => (
                      <button key={tier} type="button" onClick={() => updateForm("rentTier", tier)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition ${form.rentTier === tier ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-[var(--color-primary)]"}`}>
                        {tier === "normal" ? "Basic" : tier === "damages" ? "Rent + Damages" : "Full Package"}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Annual Rent (₦) *" name="annualRent" type="number" required placeholder="e.g. 1200000" value={form.annualRent} onChange={e => updateForm("annualRent", e.target.value)} />
                <Input label="Damage Deposit (₦) *" name="damageDeposit" type="number" required placeholder="e.g. 150000" value={form.damageDeposit} onChange={e => updateForm("damageDeposit", e.target.value)} />
                <Input label="Service Charge (₦) *" name="maintenanceCharge" type="number" required placeholder="e.g. 80000" value={form.maintenanceCharge} onChange={e => updateForm("maintenanceCharge", e.target.value)} />
              </>
            )}

            {form.listingType === "sale" && (
              <>
                <Input label="Price (₦) *" name="price" type="number" required placeholder="e.g. 15000000" value={form.price} onChange={e => updateForm("price", e.target.value)} />
                <Input label="Sale Price (₦)" name="salePrice" type="number" placeholder="Same as price if not set" value={form.salePrice} onChange={e => updateForm("salePrice", e.target.value)} />
              </>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" value={form.category} onChange={e => updateForm("category", e.target.value)}>
                <option value="company">Company</option><option value="partnership">Partnership</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2" onClick={() => setStep(2)}>← Back</Button>
              <Button type="submit" className="w-1/2" disabled={submitting}>{submitting ? "Posting..." : "Post Listing"}</Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}