"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";

interface Listing { id: string; title: string; propertyType: string; listingType: string; category: string; city: string; address: string; price: number; status: string; }

export default function OutsourcingPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    api.get<{ listings: Listing[] }>("/api/listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filterType === "all" ? listings : listings.filter(p => p.listingType === filterType || p.category === filterType);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Outsourcing</h1><p className="text-xs text-gray-500">All platform listings</p></div>
      </div>

      <div className="flex gap-2">
        {["all","partnership","portfolio","sale","rent"].map(f=><button key={f} onClick={()=>setFilterType(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${filterType===f?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{f}</button>)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Price</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Category</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px] truncate">{p.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{p.propertyType}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.city}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={p.category==="partnership"?"warning":"default"}>{p.category}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={p.status==="available"?"success":"default"}>{p.status}</Badge></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No listings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
