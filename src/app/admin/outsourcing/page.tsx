"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { formatNaira, resolveImageUrl } from "@/lib/utils";
import { usePermissions } from "@/lib/use-permissions";

interface Listing { id: string; title: string; description?: string; propertyType: string; listingType: string; category: string; city: string; address: string; price: number; status: string; bedrooms?: number; bathrooms?: number; sqft?: number; features?: string[]; photos?: { url: string }[]; negotiable?: boolean; createdAt?: string; }

export default function OutsourcingPage() {
  const perms = usePermissions();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [updating, setUpdating] = useState("");
  const [preview, setPreview] = useState<Listing | null>(null);

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

  const approve = async (id: string) => {
    setUpdating(id);
    try { await api.post(`/api/listings/${id}/approve`); fetchListings(); } catch {}
    setUpdating("");
  };

  const reject = async (id: string) => {
    setUpdating(id);
    try { await api.post(`/api/listings/${id}/reject`); fetchListings(); } catch {}
    setUpdating("");
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Delete this listing permanently?")) return;
    try { await api.delete(`/api/listings/${id}`); fetchListings(); } catch {}
  };

  const filtered = filterType === "all" ? listings : listings.filter(p => p.listingType === filterType || p.category === filterType || p.status === filterType);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-10 w-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Outsourcing</h1><p className="text-sm text-gray-500">All platform listings</p></div>
      </div>

      {perms.canCreateListings && <a href="/admin/listings/new" className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-[var(--color-primary)]/30 hover:shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">Create New Listing</p>
            <p className="text-sm text-gray-500 mt-0.5">Add a house, flat, land, or commercial property with full details, photos, and pricing</p>
          </div>
        </div>
      </a>}

      <div className="flex gap-2 flex-wrap">
        {["all","available","sold","rented","draft","review","sale","rent","partnership"].map(f=><button key={f} onClick={()=>setFilterType(f)} className={`px-4 py-2 text-sm font-medium rounded-lg border capitalize transition-all ${filterType===f?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{f}</button>)}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-sm font-medium text-gray-600">Property</th><th className="px-4 py-3 text-sm font-medium text-gray-600">Type</th><th className="px-4 py-3 text-sm font-medium text-gray-600">City</th><th className="px-4 py-3 text-sm font-medium text-gray-600">Price</th><th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th><th className="px-4 py-3 text-sm font-medium text-gray-600 w-[220px]">Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {resolveImageUrl(p.photos?.[0]?.url) ? (
                        <img src={resolveImageUrl(p.photos?.[0]?.url)!} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-300 text-sm">N/A</div>
                      )}
                      <div className="min-w-0">
                        <button onClick={() => setPreview(p)} className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)] transition-colors truncate block max-w-[200px] text-left">{p.title}</button>
                        <p className="text-xs text-gray-400 capitalize mt-0.5">{p.listingType} · {p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{p.propertyType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.city}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatNaira(p.price)}</td>
                  <td className="px-4 py-3">
                    <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} disabled={updating === p.id} className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
                      <option value="draft">Draft</option><option value="review">Review</option><option value="approved">Approved</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option><option value="rented">Rented</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setPreview(p)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium">View</button>
                      {p.status === "review" && perms.canManageContent && (
                        <>
                          <button onClick={() => approve(p.id)} disabled={updating === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-medium disabled:opacity-50">{updating === p.id ? "..." : "Approve"}</button>
                          <button onClick={() => reject(p.id)} disabled={updating === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-medium disabled:opacity-50">{updating === p.id ? "..." : "Reject"}</button>
                        </>
                      )}
                      {perms.canCreateListings && <a href={`/admin/listings/${p.id}/edit`} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium">Edit</a>}
                      {perms.canCreateListings && <button onClick={() => deleteListing(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium">Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">No listings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex items-center gap-3">
              {resolveImageUrl(p.photos?.[0]?.url) ? (
                <img src={resolveImageUrl(p.photos?.[0]?.url)!} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-300 text-xs">N/A</div>
              )}
              <div className="min-w-0 flex-1">
                <button onClick={() => setPreview(p)} className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)] transition-colors truncate block max-w-full text-left">{p.title}</button>
                <p className="text-xs text-gray-400 capitalize">{p.propertyType} · {p.listingType}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-400">City</span><p className="font-medium text-gray-900">{p.city}</p></div>
              <div><span className="text-gray-400">Price</span><p className="font-medium text-gray-900">{formatNaira(p.price)}</p></div>
              <div><span className="text-gray-400">Status</span>
                <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} disabled={updating === p.id} className="mt-0.5 text-xs rounded-lg border border-gray-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
                  <option value="draft">Draft</option><option value="review">Review</option><option value="approved">Approved</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option><option value="rented">Rented</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setPreview(p)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium">View</button>
              {p.status === "review" && perms.canManageContent && (
                <>
                  <button onClick={() => approve(p.id)} disabled={updating === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-medium disabled:opacity-50">Approve</button>
                  <button onClick={() => reject(p.id)} disabled={updating === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-medium disabled:opacity-50">Reject</button>
                </>
              )}
              {perms.canCreateListings && <a href={`/admin/listings/${p.id}/edit`} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium">Edit</a>}
              {perms.canCreateListings && <button onClick={() => deleteListing(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium">Delete</button>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No listings found</div>}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-10" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{preview.title}</h2>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {preview.photos?.length ? (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {preview.photos.map((p, i) => (
                    <img key={i} src={resolveImageUrl(p.url)!} alt="" className="w-48 h-36 rounded-lg object-cover shrink-0 border border-gray-200" />
                  ))}
                </div>
              ) : <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">No photos</div>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-400 block text-xs">Type</span><span className="font-medium capitalize">{preview.propertyType}</span></div>
                <div><span className="text-gray-400 block text-xs">Listing</span><span className="font-medium capitalize">{preview.listingType}</span></div>
                <div><span className="text-gray-400 block text-xs">Price</span><span className="font-medium text-[var(--color-primary)]">{formatNaira(preview.price)}</span></div>
                <div><span className="text-gray-400 block text-xs">Status</span><span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${preview.status==="available"?"bg-emerald-100 text-emerald-700":preview.status==="sold"?"bg-gray-100 text-gray-600":"bg-blue-100 text-blue-700"}`}>{preview.status}</span></div>
                <div><span className="text-gray-400 block text-xs">City</span><span className="font-medium">{preview.city}</span></div>
                <div><span className="text-gray-400 block text-xs">Address</span><span className="font-medium">{preview.address || "N/A"}</span></div>
                {preview.bedrooms ? <div><span className="text-gray-400 block text-xs">Bedrooms</span><span className="font-medium">{preview.bedrooms}</span></div> : null}
                {preview.bathrooms ? <div><span className="text-gray-400 block text-xs">Bathrooms</span><span className="font-medium">{preview.bathrooms}</span></div> : null}
                {preview.sqft ? <div><span className="text-gray-400 block text-xs">Area</span><span className="font-medium">{preview.sqft} sqft</span></div> : null}
                <div><span className="text-gray-400 block text-xs">Category</span><span className="font-medium capitalize">{preview.category}</span></div>
                <div><span className="text-gray-400 block text-xs">Negotiable</span><span className="font-medium">{preview.negotiable ? "Yes" : "No"}</span></div>
              </div>
              {preview.features?.length ? <div><span className="text-gray-400 block text-xs mb-2">Features</span><div className="flex flex-wrap gap-1.5">{preview.features.map(f => <span key={f} className="text-xs bg-gray-100 px-2 py-1 rounded-md">{f}</span>)}</div></div> : null}
              {preview.description && <div><span className="text-gray-400 block text-xs mb-1">Description</span><p className="text-sm text-gray-700 leading-relaxed">{preview.description}</p></div>}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <a href={`/listings/${preview.id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-700">Open in new tab</a>
              <a href={`/admin/listings/${preview.id}/edit`} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90">Edit Listing</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
