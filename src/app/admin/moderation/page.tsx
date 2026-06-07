"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Listing { id: string; title: string; propertyType: string; listingType: string; city: string; price: number; status: string; createdAt: string; postedBy?: { name: string } | null; }

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800", available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-purple-100 text-purple-800", sold: "bg-gray-200 text-gray-600",
  rented: "bg-teal-100 text-teal-800",
};

export default function ModerationPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("review");

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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const counts = { review: listings.filter(l => l.status === "review").length, approved: listings.filter(l => l.status === "approved").length, all: listings.length };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Listing Moderation</h1><p className="text-xs text-gray-500">Approve or reject property submissions</p></div>
      </div>

      <div className="flex gap-2">
        {[["review", `Pending (${counts.review})`], ["approved", `Approved (${counts.approved})`], ["all", `All (${counts.all})`]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${filter===v?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
        ))}
      </div>

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
                    {l.status === "review" ? (
                      <div className="flex gap-1">
                        <button onClick={() => approve(l.id)} className="text-[10px] font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Approve</button>
                        <button onClick={() => reject(l.id)} className="text-[10px] font-medium px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200">Reject</button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400">{l.status === "approved" ? "Approved" : "Pending"}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No listings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
