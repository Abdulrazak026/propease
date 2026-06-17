"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";

interface DashboardData {
  totalUsers: number;
  availableListings: number;
  totalListings: number;
  openTasks: number;
  totalRevenue: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardData>("/api/head/dashboard").then(r => {
      if (r.data) setData(r.data);
    }).catch(() => {}).then(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-xs text-gray-500">Website performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: data?.totalUsers || 0 },
          { label: "Active Listings", value: data?.availableListings || 0 },
          { label: "Open Tasks", value: data?.openTasks || 0 },
          { label: "Revenue", value: `${(data?.totalRevenue || 0).toLocaleString()}` },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Total Listings</p>
            <p className="text-lg font-bold text-gray-900">{data?.totalListings || 0}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Available</p>
            <p className="text-lg font-bold text-gray-900">{data?.availableListings || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
