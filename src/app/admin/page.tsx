"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface DashboardStats {
  totalUsers: number; totalListings: number; availableListings: number;
  totalTasks: number; openTasks: number; totalRevenue: number; totalCommissionsPaid: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ stats: DashboardStats }>("/api/head/dashboard").then(r => {
      if (r.data?.stats) setStats(r.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 h-20 animate-pulse"><div className="h-4 bg-gray-100 rounded w-20 mb-2" /><div className="h-5 bg-gray-100 rounded w-16" /></div>)}
        </div>
      </div>
    );
  }

  const s = stats || { totalUsers: 0, totalListings: 0, availableListings: 0, totalTasks: 0, openTasks: 0, totalRevenue: 0, totalCommissionsPaid: 0 };

  const cards = [
    { label: "Total Users", value: s.totalUsers, accent: "bg-blue-50 text-blue-600", href: "/admin/users" },
    { label: "Active Listings", value: s.availableListings, sub: `${s.totalListings} total`, accent: "bg-emerald-50 text-emerald-600", href: "/admin/outsourcing" },
    { label: "Open Tasks", value: s.openTasks, sub: `${s.totalTasks} total`, accent: "bg-amber-50 text-amber-600", href: "/admin/crm" },
    { label: "Company Revenue", value: `₦${(s.totalRevenue / 1_000_000).toFixed(1)}M`, sub: `₦${formatNaira(s.totalCommissionsPaid)} paid`, accent: "bg-violet-50 text-violet-600", href: "/admin/commissions" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full platform control and oversight</p>
        </div>
        <a href="/admin/listings/new" className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">+ Create Listing</a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-xl font-bold ${c.accent.split(" ")[1]} mt-1`}>{c.value}</p>
            {c.sub && <p className="text-[10px] text-gray-400 mt-0.5">{c.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Reservations", value: "—", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Withdrawals", value: "—", color: "text-red-600", bg: "bg-red-50" },
          { label: "Inquiries", value: "—", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Custom Orders", value: "—", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
              <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Users", value: s.totalUsers },
            { label: "Total Listings", value: s.totalListings },
            { label: "Available Listings", value: s.availableListings },
            { label: "Total Tasks", value: s.totalTasks },
            { label: "Open Tasks", value: s.openTasks },
            { label: "Revenue", value: `₦${formatNaira(s.totalRevenue)}` },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-bold text-[var(--color-primary)] mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
