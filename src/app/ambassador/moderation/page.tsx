"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { usePermissions } from "@/lib/use-permissions";

interface Listing { id: string; title: string; propertyType: string; listingType: string; city: string; price: number; status: string; createdAt: string; postedBy?: { name: string } | null; }

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-purple-100 text-purple-800",
  sold: "bg-gray-200 text-gray-600",
  rented: "bg-teal-100 text-teal-800",
  rejected: "bg-red-100 text-red-700",
};

export default function ModerationPage() {
  const perms = usePermissions();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("review");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ listings: Listing[] }>("/api/ambassador/city-listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const load = () => {
    api.get<{ listings: Listing[] }>("/api/ambassador/city-listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
    }).catch(() => {});
  };

  const approve = async (id: string) => {
    setBusy(id);
    const r = await api.post<{ listing: { status: string } }>(`/api/listings/${id}/approve`);
    if (r.status === 200 && r.data?.listing) {
      load();
    }
    setBusy(null);
  };
  const reject = async (id: string) => {
    setBusy(id);
    const r = await api.post(`/api/listings/${id}/reject`);
    if (r.status === 200) {
      load();
    }
    setBusy(null);
  };

  const filtered = filter === "all" ? listings : listings.filter(l => l.status === filter);
  const counts = {
    review: listings.filter(l => l.status === "review").length,
    approved: listings.filter(l => l.status === "approved" || l.status === "available").length,
    all: listings.length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/ambassador" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Listing Review</h1>
          <p className="text-xs text-gray-500">Verify properties posted by agents in your city</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["review", `Awaiting review (${counts.review})`],
          ["approved", `Approved (${counts.approved})`],
          ["all", `All (${counts.all})`],
        ].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${filter===v?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Property</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Posted by</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">City</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[200px] truncate">{l.title}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{l.postedBy?.name || "Unknown"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{l.propertyType} · {l.listingType}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{l.city}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{l.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[l.status] || ""}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {l.status === "review" && perms.canManageContent ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => approve(l.id)} disabled={busy === l.id} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors">
                          {busy === l.id ? "..." : "Approve"}
                        </button>
                        <button onClick={() => reject(l.id)} disabled={busy === l.id} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400">{l.status === "approved" || l.status === "available" ? "Live" : "Pending"}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                  {filter === "review" ? "Nothing to review. All caught up." : "No listings found."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
