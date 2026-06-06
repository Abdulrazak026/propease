"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { formatNaira } from "@/lib/utils";

interface Listing { id: string; title: string; propertyType: string; listingType: string; category: string; city: string; address: string; price: number; status: string; photos?: { url: string }[]; }

export default function OutsourcingPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [updating, setUpdating] = useState("");

  const fetchListings = () => {
    api.get<{ listings: Listing[] }>("/api/listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchListings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try { await api.patch(`/api/listings/${id}/status`, { status }); fetchListings(); } catch {}
    setUpdating("");
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Delete this listing permanently?")) return;
    try { await api.delete(`/api/listings/${id}`); fetchListings(); } catch {}
  };

  const filtered = filterType === "all" ? listings : listings.filter(p => p.listingType === filterType || p.category === filterType || p.status === filterType);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Outsourcing</h1><p className="text-xs text-gray-500">All platform listings</p></div>
      </div>

      <Link href="/admin/listings/new" className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-[var(--color-primary)]/30 hover:shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Create New Listing</p>
            <p className="text-xs text-gray-500 mt-0.5">Add a house, flat, land, or commercial property with full details, photos, and pricing</p>
          </div>
        </div>
      </Link>

      <div className="flex gap-2 flex-wrap">
        {["all","available","sold","rented","draft","review","partnership","portfolio","sale","rent"].map(f=><button key={f} onClick={()=>setFilterType(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${filterType===f?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{f}</button>)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Price</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600 w-[200px]">Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.photos?.[0]?.url ? (
                        <img src={p.photos[0].url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-300 text-xs">N/A</div>
                      )}
                      <div className="min-w-0">
                        <Link href={`/listings/${p.id}`} className="text-xs font-medium text-gray-900 hover:text-[var(--color-primary)] transition-colors truncate block max-w-[200px]">{p.title}</Link>
                        <p className="text-[10px] text-gray-400 capitalize">{p.listingType} · {p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{p.propertyType}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.city}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(p.price)}</td>
                  <td className="px-4 py-3">
                    <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} disabled={updating === p.id} className="text-[10px] rounded-lg border border-gray-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="approved">Approved</option>
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <a href={`/listings/${p.id}`} className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">View</a>
                      <a href={`/admin/listings/new`} className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</a>
                      <button onClick={() => deleteListing(p.id)} className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </td>
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
