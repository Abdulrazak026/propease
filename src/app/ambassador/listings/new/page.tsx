"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function PostListingPage() {
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Listing posted! (Demo) It will appear on the public listings page.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Post New Listing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Add a property to your city&apos;s listings</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        {step === 1 && (
          <>
            <h2 className="font-semibold text-gray-900 text-sm">Property Details</h2>
            <Input label="Title" required placeholder="e.g. 3-Bedroom House in Kano Municipal" />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none" placeholder="Describe the property..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option>House</option><option>Flat</option><option>Land</option><option>Commercial</option><option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Listing Type</label>
                <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option>For Rent</option><option>For Sale</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Bedrooms" type="number" placeholder="3" />
              <Input label="Bathrooms" type="number" placeholder="2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Area (sqft)" type="number" placeholder="1500" />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option>Kano Municipal</option><option>Fagge</option><option>Tarauni</option><option>Nassarawa</option>
                </select>
              </div>
            </div>
            <Button type="button" className="w-full" onClick={() => setStep(2)}>Next — Photos & Location</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold text-gray-900 text-sm">Photos & Location</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[var(--color-primary)] transition cursor-pointer">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-medium text-gray-700">Upload Photos</p>
              <p className="text-xs text-gray-400 mt-1">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-300 mt-2">Max 10 files • JPG, PNG, WebP</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">📍 Capture Location</p>
                  <p className="text-xs text-gray-500">Click to drop a pin using Google Maps</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => alert("Google Maps picker would open here (demo)")}>
                  Open Map
                </Button>
              </div>
              <div className="mt-3 bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                <p className="text-xs text-gray-500">📍 Pin dropped at 11.9950, 8.5350 (demo)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2" onClick={() => setStep(1)}>← Back</Button>
              <Button className="w-1/2" onClick={() => setStep(3)}>Next — Pricing</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold text-gray-900 text-sm">Pricing</h2>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Rent Tier</label>
              <div className="flex gap-2">
                {["normal", "damages", "full"].map((tier) => (
                  <button key={tier} type="button" className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-[var(--color-primary)] transition">
                    {tier === "normal" ? "Normal" : tier === "damages" ? "Rent + Damages" : "Full Package"}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Annual Rent (₦)" type="number" required placeholder="e.g. 1200000" />
            <Input label="Damage Deposit (₦)" type="number" placeholder="e.g. 150000" />
            <Input label="Maintenance Charge (₦)" type="number" placeholder="e.g. 80000" />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <option>Own Portfolio</option><option>Partnership</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2" onClick={() => setStep(2)}>← Back</Button>
              <Button type="submit" className="w-1/2">Post Listing</Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
