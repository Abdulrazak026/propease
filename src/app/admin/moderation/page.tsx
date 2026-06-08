"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { usePermissions } from "@/lib/use-permissions";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/utils";

interface Listing {
  id: string; title: string; description?: string; propertyType: string; listingType: string;
  city: string; price: number; status: string; createdAt: string; bedrooms?: number;
  bathrooms?: number; sqft?: number; address?: string;
  photos?: { id: string; url: string; alt: string }[];
  postedBy?: { id: string; name: string } | null;
}

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800", available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-purple-100 text-purple-800", sold: "bg-gray-200 text-gray-600",
  rented: "bg-teal-100 text-teal-800", rejected: "bg-red-100 text-red-700",
};

export default function ModerationPage() {
  const perms = usePermissions();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState<Listing | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get<{ listings: Listing[] }>("/api/head/all-listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    setBusy(id);
    await api.post(`/api/listings/${id}/approve`);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "approved" } : l));
    setBusy(null);
  };
  const reject = async (id: string) => {
    setBusy(id);
    await api.post(`/api/listings/${id}/reject`);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "draft" } : l));
    setBusy(null);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this listing permanently?")) return;
    setBusy(id);
    await api.delete(`/api/listings/${id}`);
    setListings(prev => prev.filter(l => l.id !== id));
    setBusy(null);
    if (preview?.id === id) setPreview(null);
  };

  const filtered = filter === "all" ? listings : listings.filter(l => l.status === filter);
  const counts = {
    review: listings.filter(l => l.status === "review").length,
    approved: listings.filter(l => l.status === "approved" || l.status === "available").length,
    draft: listings.filter(l => l.status === "draft").length,
    all: listings.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Listing Moderation</h1><p className="text-xs text-gray-500">Review, approve, or reject property submissions</p></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["all", `All (${counts.all})`],
          ["review", `Pending (${counts.review})`],
          ["approved", `Approved (${counts.approved})`],
          ["draft", `Draft/Rejected (${counts.draft})`],
        ].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v!)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${filter === v ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Listed By</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">City</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Price</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px] truncate">{l.title}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{l.postedBy?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 capitalize">{l.propertyType} · {l.listingType}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{l.city}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{l.price.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[l.status] || ""}`}>{l.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 items-center flex-wrap">
                          <button onClick={() => setPreview(l)} className="text-[10px] font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">View</button>
                          <Link href={`/admin/listings/${l.id}/edit`} className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Edit</Link>
                          {l.status === "review" && perms.canManageContent && (
                            <>
                              <button onClick={() => approve(l.id)} disabled={busy === l.id} className="text-[10px] font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50">{busy === l.id ? "..." : "Approve"}</button>
                              <button onClick={() => reject(l.id)} disabled={busy === l.id} className="text-[10px] font-medium px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50">{busy === l.id ? "..." : "Reject"}</button>
                            </>
                          )}
                          {perms.canManageContent && (
                            <button onClick={() => remove(l.id)} disabled={busy === l.id} className="text-[10px] font-medium px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50">Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No listings found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(l => (
              <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 flex-1 pr-2">{l.title}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusStyles[l.status] || ""}`}>{l.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div><span className="text-gray-400">Type</span><p className="font-medium capitalize">{l.propertyType} · {l.listingType}</p></div>
                  <div><span className="text-gray-400">City</span><p className="font-medium">{l.city}</p></div>
                  <div><span className="text-gray-400">Price</span><p className="font-medium">₦{l.price.toLocaleString()}</p></div>
                  <div><span className="text-gray-400">Listed By</span><p className="font-medium">{l.postedBy?.name || "Unknown"}</p></div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setPreview(l)} className="text-[10px] font-medium px-2.5 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">View</button>
                  <Link href={`/admin/listings/${l.id}/edit`} className="text-[10px] font-medium px-2.5 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Edit</Link>
                  {l.status === "review" && perms.canManageContent && (
                    <>
                      <button onClick={() => approve(l.id)} disabled={busy === l.id} className="text-[10px] font-medium px-2.5 py-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50">Approve</button>
                      <button onClick={() => reject(l.id)} disabled={busy === l.id} className="text-[10px] font-medium px-2.5 py-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50">Reject</button>
                    </>
                  )}
                  {perms.canManageContent && (
                    <button onClick={() => remove(l.id)} disabled={busy === l.id} className="text-[10px] font-medium px-2.5 py-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50">Delete</button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No listings found.</div>}
          </div>
        </>
      )}

      {/* Listing Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{preview.title}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photos */}
              {preview.photos && preview.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {preview.photos.map((p, i) => (
                    <img key={p.id || i} src={resolveImageUrl(p.url) || ""} alt={p.alt || ""} className="h-32 w-48 object-cover rounded-lg border border-gray-200 shrink-0" />
                  ))}
                </div>
              )}
              {/* Status + Type */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[preview.status] || ""}`}>{preview.status}</span>
                <span className="text-xs text-gray-500 capitalize">{preview.propertyType} · {preview.listingType}</span>
              </div>
              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><span className="text-xs text-gray-400">Price</span><p className="font-semibold text-gray-900">₦{preview.price.toLocaleString()}</p></div>
                <div><span className="text-xs text-gray-400">City</span><p className="font-medium">{preview.city}</p></div>
                {preview.address && <div><span className="text-xs text-gray-400">Address</span><p className="font-medium">{preview.address}</p></div>}
                {preview.bedrooms && <div><span className="text-xs text-gray-400">Bedrooms</span><p className="font-medium">{preview.bedrooms}</p></div>}
                {preview.bathrooms && <div><span className="text-xs text-gray-400">Bathrooms</span><p className="font-medium">{preview.bathrooms}</p></div>}
                {preview.sqft && <div><span className="text-xs text-gray-400">Area</span><p className="font-medium">{preview.sqft} sqft</p></div>}
                <div><span className="text-xs text-gray-400">Listed By</span><p className="font-medium">{preview.postedBy?.name || "Unknown"}</p></div>
                <div><span className="text-xs text-gray-400">Created</span><p className="font-medium">{new Date(preview.createdAt).toLocaleDateString()}</p></div>
              </div>
              {/* Description */}
              {preview.description && (
                <div><span className="text-xs text-gray-400 block mb-1">Description</span><p className="text-sm text-gray-700 whitespace-pre-wrap">{preview.description}</p></div>
              )}
              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Link href={`/listings/${preview.id}`} target="_blank" className="text-xs font-medium px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200">Open Public Page ↗</Link>
                <Link href={`/admin/listings/${preview.id}/edit`} className="text-xs font-medium px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Edit</Link>
                {preview.status === "review" && perms.canManageContent && (
                  <>
                    <button onClick={() => { approve(preview.id); setPreview(null); }} className="text-xs font-medium px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Approve</button>
                    <button onClick={() => { reject(preview.id); setPreview(null); }} className="text-xs font-medium px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
