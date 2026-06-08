"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { usePermissions } from "@/lib/use-permissions";

interface MyListing { id: string; title: string; propertyType: string; listingType: string; city: string; price: number; status: string; createdAt: string; }

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-purple-100 text-purple-800",
  sold: "bg-gray-200 text-gray-600",
  rented: "bg-teal-100 text-teal-800",
};

export default function AgentMyListingsPage() {
  const perms = usePermissions();
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    api.get<{ listings: MyListing[] }>("/api/listings/agent/my-listings")
      .then(r => setListings(r.data?.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? listings : listings.filter(l => l.status === filter);
  const filters = [
    { v: "all", l: "All" },
    { v: "review", l: "In review" },
    { v: "approved", l: "Live" },
    { v: "sold", l: "Sold" },
    { v: "rented", l: "Rented" },
  ];

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500">Every property you've posted</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/agent" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back</Link>
          {perms.canCreateListings && <Link href="/agent/listings/new" className="text-xs font-semibold px-3.5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90">+ New Listing</Link>}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${filter === f.v ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">No listings</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Post your first property. It goes to review before going live.</p>
          <Link href="/agent/listings/new" className="inline-flex items-center justify-center mt-4 min-h-[40px] px-5 py-2 text-xs font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800">Post a property</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => (
            <Link key={l.id} href={`/listings/${l.id}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{l.propertyType} · {l.listingType} · {l.city}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">₦{l.price.toLocaleString()}</p>
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${statusStyles[l.status] || "bg-gray-100 text-gray-700"}`}>
                    {l.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
