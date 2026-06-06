"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/head/dashboard").then((r: any) => {
      if (r.data) setStats(r.data.stats);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex-1 px-6 py-6"><div className="text-gray-400 text-sm">Loading...</div></div>;
  }
  if (!stats) {
    return <div className="flex-1 px-6 py-6"><div className="text-red-500 text-sm">Failed to load</div></div>;
  }

  const fmt = (n: number) => new Intl.NumberFormat().format(n);
  return (
    <div className="flex-1">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Analytics</h1>
        <p className="text-xs text-gray-500 mb-6">Key metrics overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, color: "bg-blue-50 text-blue-700" },
            { label: "Total Listings", value: stats.totalListings, color: "bg-green-50 text-green-700" },
            { label: "Available", value: stats.availableListings, color: "bg-emerald-50 text-emerald-700" },
            { label: "Total Tasks", value: stats.totalTasks, color: "bg-purple-50 text-purple-700" },
            { label: "Open Tasks", value: stats.openTasks, color: "bg-orange-50 text-orange-700" },
            { label: "Revenue (NGN)", value: "N" + fmt(stats.totalRevenue), color: "bg-amber-50 text-amber-700" },
            { label: "Commissions Paid", value: "N" + fmt(stats.totalCommissionsPaid), color: "bg-pink-50 text-pink-700" },
          ].map(c => (
            <div key={c.label} className={"rounded-xl p-5 " + c.color}>
              <p className="text-xs font-medium opacity-70">{c.label}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
