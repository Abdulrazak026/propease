"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { api, apiFetch } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { resolveImageUrl } from "@/lib/utils";

interface Listing { id: string; title: string; propertyType: string; listingType: string; city: string; price: number; status: string; createdAt: string; postedBy?: { name: string } | null; }
interface MediaFile { id: string; key: string; url: string; filename: string; mimeType: string; size: number; createdAt: string; }

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800", available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-purple-100 text-purple-800", sold: "bg-gray-200 text-gray-600",
  rented: "bg-teal-100 text-teal-800",
};

function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFiles = () => {
    api.get<{ files: MediaFile[] }>("/api/media").then(r => {
      setFiles(r.data?.files || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      await apiFetch("/api/upload", { method: "POST", body: fd });
      fetchFiles();
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await api.delete(`/api/media/${id}`);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-32"><div className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{files.length} file{files.length !== 1 ? "s" : ""} uploaded</p>
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading..." : "+ Upload Image"}</Button>
        </div>
      </div>
      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No images uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map(f => (
            <div key={f.id} className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img src={resolveImageUrl(f.url) || f.url} alt={f.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <span className="text-[10px] text-white truncate max-w-[80%]">{f.filename}</span>
                <button onClick={() => handleDelete(f.id)} className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModerationPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<"listings" | "media">("listings");

  useEffect(() => {
    api.get<{ listings: Listing[] }>("/api/head/all-listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    await api.post(`/api/listings/${id}/approve`);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "approved" } : l));
  };
  const reject = async (id: string) => {
    await api.post(`/api/listings/${id}/reject`);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "draft" } : l));
  };

  const filtered = filter === "all" ? listings : listings.filter(l => l.status === filter);

  const counts = { review: listings.filter(l => l.status === "review").length, approved: listings.filter(l => l.status === "approved").length, all: listings.length };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Moderation</h1><p className="text-xs text-gray-500">Review listings and manage media</p></div>
      </div>

      <div className="flex gap-2">
        {([["listings", "Listings"], ["media", "Media"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab===k?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
        ))}
      </div>

      {tab === "listings" && (<>
        <div className="flex gap-2">
          {[["review", `Pending (${counts.review})`], ["approved", `Approved (${counts.approved})`], ["all", `All (${counts.all})`]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${filter===v?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Listed By</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Price</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px] truncate">{l.title}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{l.postedBy?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 capitalize">{l.propertyType} · {l.listingType}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{l.city}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{l.price.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[l.status]||""}`}>{l.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 items-center">
                          <a href={`/listings/${l.id}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">View Post</a>
                          {l.status === "review" && (
                            <>
                              <button onClick={() => approve(l.id)} className="text-[10px] font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Approve</button>
                              <button onClick={() => reject(l.id)} className="text-[10px] font-medium px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200">Reject</button>
                            </>
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
        )}
      </>)}

      {tab === "media" && <MediaLibrary />}
    </div>
  );
}
