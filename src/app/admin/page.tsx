"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useRole } from "@/context/RoleContext";

interface DashboardStats {
  totalUsers: number; totalListings: number; availableListings: number;
  totalTasks: number; openTasks: number; totalRevenue: number; totalCommissionsPaid: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: { type: string; title: string; time: string; icon: string }[];
  pendingItems: { unapprovedUsers: number; draftListings: number; pendingWithdrawals: number; newInquiries: number };
  inquiryStats: { new: number; read: number; responded: number };
  withdrawalStats: { pendingAmount: number; pendingCount: number };
}

export default function AdminOverview() {
  const { currentUser } = useRole();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardData>("/api/head/dashboard").then(r => {
      if (r.data) setData(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200/60 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 h-28 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 h-64 animate-pulse" />
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  const s = data?.stats || { totalUsers: 0, totalListings: 0, availableListings: 0, totalTasks: 0, openTasks: 0, totalRevenue: 0, totalCommissionsPaid: 0 };
  const pending = data?.pendingItems || { unapprovedUsers: 0, draftListings: 0, pendingWithdrawals: 0, newInquiries: 0 };
  const activity = data?.recentActivity || [];
  const inqStats = data?.inquiryStats || { new: 0, read: 0, responded: 0 };
  const wStats = data?.withdrawalStats || { pendingAmount: 0, pendingCount: 0 };

  const firstName = currentUser?.name?.split(" ")[0] || "Admin";

  const statCards = [
    { label: "Total Users", value: s.totalUsers, icon: "👥", gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", href: "/admin/users", pending: pending.unapprovedUsers > 0 ? `${pending.unapprovedUsers} pending` : null },
    { label: "Active Listings", value: s.availableListings, icon: "🏠", gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", href: "/admin/outsourcing", pending: pending.draftListings > 0 ? `${pending.draftListings} draft` : null },
    { label: "Open Tasks", value: s.openTasks, icon: "✅", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", href: "/admin/tasks", pending: null },
    { label: "Revenue", value: `₦${(s.totalRevenue / 1_000_000).toFixed(1)}M`, icon: "💰", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", href: "/admin/commissions", pending: `₦${formatNaira(s.totalCommissionsPaid)} paid` },
  ];

  const pendingActions = [
    { label: "Unapproved Users", count: pending.unapprovedUsers, icon: "👤", href: "/admin/users", color: "text-blue-600 bg-blue-50" },
    { label: "New Inquiries", count: pending.newInquiries, icon: "📩", href: "/admin/crm", color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Withdrawals", count: wStats.pendingCount, icon: "💸", href: "/admin/commissions", color: "text-amber-600 bg-amber-50" },
    { label: "Draft Listings", count: pending.draftListings, icon: "📝", href: "/admin/outsourcing", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening across your platform</p>
        </div>
        <Link href="/admin/outsourcing" className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Manage Listings
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <Link key={c.label} href={c.href} className="group relative bg-white rounded-2xl border border-gray-200/60 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/60 transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 ${c.bg} rounded-full -mr-6 -mt-6 opacity-60 group-hover:opacity-100 transition-opacity`} />
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-lg shadow-lg mb-3`}>
                {c.icon}
              </div>
              <p className="text-xs font-medium text-gray-500 mb-1">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{c.value}</p>
              {c.pending && <p className="text-[10px] text-gray-400 mt-1">{c.pending}</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-[10px] text-gray-400">Last 24h</span>
          </div>
          <div className="divide-y divide-gray-50">
            {activity.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-xs">No recent activity</div>
            ) : activity.slice(0, 6).map((a, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                <span className="text-base shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{a.title}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{formatTimeAgo(a.time)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Pending Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            {pendingActions.map((pa) => (
              <Link key={pa.label} href={pa.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className={`w-10 h-10 rounded-xl ${pa.color} flex items-center justify-center text-base`}>
                  {pa.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{pa.label}</p>
                </div>
                <span className={`text-lg font-bold ${pa.count > 0 ? "text-gray-900" : "text-gray-300"}`}>
                  {pa.count}
                </span>
              </Link>
            ))}
          </div>

          {/* Inquiry breakdown */}
          <div className="mx-4 mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Inquiry Pipeline</p>
            <div className="flex gap-2">
              {[
                { label: "New", value: inqStats.new, color: "bg-blue-500" },
                { label: "Read", value: inqStats.read, color: "bg-amber-500" },
                { label: "Responded", value: inqStats.responded, color: "bg-emerald-500" },
              ].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <div className={`w-full h-1.5 rounded-full ${s.color} mb-1.5`} style={{ opacity: Math.max(0.2, s.value / Math.max(1, inqStats.new + inqStats.read + inqStats.responded)) }} />
                  <p className="text-xs font-bold text-gray-900">{s.value}</p>
                  <p className="text-[9px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Users", value: s.totalUsers, icon: "👥" },
            { label: "Listings", value: s.totalListings, icon: "🏠" },
            { label: "Available", value: s.availableListings, icon: "✅" },
            { label: "Tasks", value: s.totalTasks, icon: "📋" },
            { label: "Open Tasks", value: s.openTasks, icon: "⏳" },
            { label: "Revenue", value: `₦${formatNaira(s.totalRevenue)}`, icon: "💰" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/40 text-center">
              <p className="text-lg mb-1">{item.icon}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}
