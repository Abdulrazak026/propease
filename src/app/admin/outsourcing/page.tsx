"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { listings } from "@/lib/mock-data";

export default function OutsourcingPage() {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [viewListing, setViewListing] = useState<(typeof listings)[0] | null>(null);
  const filtered = listings.filter((p) => filterType === "all" || p.listingType === filterType || p.category === filterType);

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
              <div><h1 className="text-xl font-bold text-gray-900">Outsourcing</h1><p className="text-xs text-gray-500">Manage sourced and external partner properties</p></div>
            </div>
            <Button size="sm" onClick={() => setShowForm(true)}>+ Add Property</Button>
          </div>
          <div className="flex gap-2">{["all","partnership","portfolio","sale","rent"].map(f=><button key={f} onClick={()=>setFilterType(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${filterType===f?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{f==="all"?"All":f}</button>)}</div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Price</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Category</th></tr></thead>
                <tbody>
                  {filtered.map(p=><tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={()=>setViewListing(p)}><td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[200px] truncate">{p.title}</td><td className="px-4 py-3 text-xs text-gray-600 capitalize">{p.propertyType}</td><td className="px-4 py-3 text-xs text-gray-600">{p.city}</td><td className="px-4 py-3 text-xs font-medium text-gray-900">₦{p.price.toLocaleString()}</td><td className="px-4 py-3"><Badge variant={p.category==="partnership"?"warning":"default"}>{p.category}</Badge></td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <FullOutsourceForm onBack={() => setShowForm(false)} />
      )}

      {viewListing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={()=>setViewListing(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{viewListing.title}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400 text-xs">Type</span><p className="font-medium capitalize">{viewListing.propertyType}</p></div>
              <div><span className="text-gray-400 text-xs">City</span><p className="font-medium">{viewListing.city}</p></div>
              <div><span className="text-gray-400 text-xs">Price</span><p className="font-medium">₦{viewListing.price.toLocaleString()}</p></div>
              <div><span className="text-gray-400 text-xs">Category</span><Badge>{viewListing.category}</Badge></div>
              <div className="col-span-2"><span className="text-gray-400 text-xs">Address</span><p className="font-medium">{viewListing.address}</p></div>
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={()=>setViewListing(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FullOutsourceForm({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></button>
        <div><h1 className="text-xl font-bold text-gray-900">Add Outsourced Property</h1><p className="text-xs text-gray-500">Full property listing with media and location</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Property Details</h3>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-700">Title</label><input placeholder="e.g. 3-Bedroom Flat — Kano Municipal" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-700">Type</label><select className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"><option>House</option><option>Flat</option><option>Land</option><option>Commercial</option></select></div>
              <div><label className="text-xs font-medium text-gray-700">Listing</label><select className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"><option>For Rent</option><option>For Sale</option></select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-700">Bedrooms</label><input type="number" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-700">Bathrooms</label><input type="number" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-700">Sq Ft</label><input type="number" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-700">Price (₦)</label><input type="number" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-700">City</label><input className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-700">Address</label><input className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-700">Partner Company</label><input placeholder="e.g. Aliyu & Sons Ltd" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-700">Description</label><textarea rows={4} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Media Upload</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
              <p className="text-sm font-medium text-gray-700">Drop images/videos here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 50MB each</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Geolocation</h3>
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-3">
              <div className="text-center">
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                <p className="text-xs text-gray-400">Tap to pin location or enter coordinates</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-700">Latitude</label><input placeholder="12.0000" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-700">Longitude</label><input placeholder="8.5245" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button className="flex-1">Publish Property</Button>
        <Button variant="outline" className="flex-1">Save as Draft</Button>
        <Button variant="ghost" onClick={onBack}>Cancel</Button>
      </div>
    </div>
  );
}
