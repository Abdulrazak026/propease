"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { listings } from "@/lib/mock-data";

export default function OutsourcingPage() {
  const [properties] = useState(listings);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const filtered = properties.filter((p) => filterType === "all" || p.listingType === filterType || p.category === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Outsourcing</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage sourced and external partner properties</p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)} className="shrink-0">
          + Add Property
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "partnership", label: "Partnership" },
          { key: "portfolio", label: "Portfolio" },
          { key: "sale", label: "For Sale" },
          { key: "rent", label: "For Rent" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
              filterType === f.key ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Property</th>
                <th className="px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 font-medium text-gray-600">City</th>
                <th className="px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 font-medium text-gray-600">Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 shrink-0">
                        {p.photos?.[0]?.url ? <img src={p.photos[0].url} alt="" className="w-full h-full object-cover rounded-lg" /> : "🏠"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.listingType === "rent" ? "For Rent" : "For Sale"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{p.propertyType}</td>
                  <td className="px-4 py-3 text-gray-600">{p.city}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₦{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.category === "partnership" ? "warning" : "default"}>{p.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.postedBy?.name || "External Partner"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No properties found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Outsourced Property</h3>
            <div className="space-y-3">
              <input placeholder="Property Title" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option>House</option><option>Flat</option><option>Land</option><option>Commercial</option>
              </select>
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option>For Sale</option><option>For Rent</option>
              </select>
              <input type="number" placeholder="Price (₦)" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <input placeholder="City" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <input placeholder="Partner Company" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <textarea placeholder="Description" rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" onClick={() => setShowModal(false)}>Add Property</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
