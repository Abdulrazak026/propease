"use client";
import { users, listings, tasks, commissions, platformStats, withdrawals } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";

export default function AdminOverview() {
  const totalRevenue = platformStats.totalRevenue;
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");
  const activeUsers = users.filter((u) => u.role !== "admin");

  const cards = [
    { label: "Total Users", value: activeUsers.length, sub: `${users.filter(u => u.role === "agent").length} agents`, accent: "bg-blue-100", color: "text-blue-600" },
    { label: "Active Listings", value: platformStats.availableListings, sub: `${listings.length} total`, accent: "bg-emerald-100", color: "text-emerald-600" },
    { label: "Open Tasks", value: platformStats.openTasks, sub: `${tasks.length} total tasks`, accent: "bg-amber-100", color: "text-amber-600" },
    { label: "Company Revenue", value: formatNaira(totalRevenue), sub: `${commissions.length} deals`, accent: "bg-violet-100", color: "text-violet-600" },
  ];

  const recentActivity = [
    { icon: "👤", text: "New user registered as agent", time: "2 hours ago" },
    { icon: "🏘️", text: "New listing posted in Tarauni", time: "5 hours ago" },
    { icon: "💰", text: "Commission paid — ₦120,000", time: "1 day ago" },
    { icon: "📌", text: "Task assigned — Land search in Tarauni", time: "1 day ago" },
    { icon: "💳", text: "Withdrawal request — ₦80,000", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full platform control and oversight</p>
        </div>
        {pendingWithdrawals.length > 0 && (
          <Link href="/admin/audit" className="relative">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {pendingWithdrawals.length} pending withdrawal{pendingWithdrawals.length > 1 ? "s" : ""}
            </span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
                <span className={`text-sm font-bold ${s.color}`}>{typeof s.value === "string" ? "₦" : s.value}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Cities", value: "4", detail: "Kano Municipal, Fagge, Tarauni, Nassarawa" },
              { label: "Ambassadors", value: users.filter((u) => u.role === "ambassador").length, detail: `${users.filter((u) => u.role === "agent").length} agents` },
              { label: "Partnerships", value: listings.filter((l) => l.category === "partnership").length, detail: "External companies" },
              { label: "Commissions Paid", value: formatNaira(platformStats.totalCommissionsPaid), detail: `${commissions.length} deals` },
              { label: "Reservations", value: "3", detail: "1 confirmed, 2 pending" },
              { label: "Custom Orders", value: "3", detail: "2 routed, 1 pending" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-gray-50/50 border border-gray-100">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-bold text-[var(--color-primary)] mt-0.5">{item.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
