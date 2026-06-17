"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import BarChart from "@/components/charts/BarChart";
import { formatNaira } from "@/lib/utils";

interface DashboardData {
  totalUsers: number;
  availableListings: number;
  totalListings: number;
  openTasks: number;
  totalRevenue: number;
  totalCommissions: number;
  recentActivity: any[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: DashboardData }>("/api/head/dashboard"),
      api.get<{ listings: any[] }>("/api/listings?limit=100"),
    ]).then(([dashRes, listRes]) => {
      if (dashRes.data) setData(dashRes.data);
      if (listRes.data?.listings) setListings(listRes.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  // Prepare chart data from listings
  const listingsByType = [
    { label: "House", value: listings.filter(l => l.propertyType === "house").length, color: "#10b981" },
    { label: "Flat", value: listings.filter(l => l.propertyType === "flat").length, color: "#3b82f6" },
    { label: "Land", value: listings.filter(l => l.propertyType === "land").length, color: "#f59e0b" },
    { label: "Commercial", value: listings.filter(l => l.propertyType === "commercial").length, color: "#8b5cf6" },
  ];

  const listingsByStatus = [
    { label: "Available", value: listings.filter(l => l.status === "available").length, color: "#10b981" },
    { label: "Reserved", value: listings.filter(l => l.status === "reserved").length, color: "#f59e0b" },
    { label: "Sold", value: listings.filter(l => l.status === "sold").length, color: "#ef4444" },
    { label: "Draft", value: listings.filter(l => l.status === "draft").length, color: "#9ca3af" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div><h1 className="text-xl font-bold text-gray-900">Analytics</h1><p className="text-xs text-gray-500">Website performance overview</p></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: data?.totalUsers || 0 },
          { label: "Active Listings", value: data?.availableListings || 0 },
          { label: "Open Tasks", value: data?.openTasks || 0 },
          { label: "Revenue", value: `₦${(data?.totalRevenue || 0).toLocaleString()}` },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
            <p className="text-xs text-gray-500 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Listings by Type</h3>
          <BarChart data={listingsByType} height={200} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Listings by Status</h3>
          <BarChart data={listingsByStatus} height={200} />
        </div>
      </div>

      {/* Recent Activity */}
      {data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {data.recentActivity.slice(0, 5).map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm shrink-0">
                  {a.action?.includes("LISTING") ? "🏠" : a.action?.includes("USER") ? "👤" : "📋"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 truncate">{a.action?.replace(/_/g, " ") || "Activity"}</p>
                  <p className="text-xs text-gray-400">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
