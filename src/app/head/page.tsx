"use client";
import { listings, tasks, users, commissions, platformStats } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

export default function HeadOverview() {
  const stats = [
    { label: "Total Users", value: platformStats.totalUsers, color: "text-blue-600", icon: "👥" },
    { label: "Active Listings", value: platformStats.availableListings, color: "text-emerald-600", icon: "🏘️" },
    { label: "Open Tasks", value: platformStats.openTasks, color: "text-amber-600", icon: "📋" },
    { label: "Revenue", value: formatNaira(platformStats.totalRevenue), color: "text-[var(--color-primary)]", icon: "💰" },
  ];

  const recentListings = [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">System Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Full platform visibility — all cities, all users, all transactions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <span className="text-lg">{s.icon}</span>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Listings</h2>
          <div className="space-y-2">
            {recentListings.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{l.title}</p>
                  <p className="text-xs text-gray-400">{l.city} • {l.postedBy.name} • {l.status}</p>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatNaira(l.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Cities", value: 4, detail: "Kano Municipal, Fagge, Tarauni, Nassarawa" },
              { label: "Ambassadors", value: users.filter((u) => u.role === "ambassador").length, detail: `${users.filter((u) => u.role === "agent").length} agents under them` },
              { label: "Partnerships", value: listings.filter((l) => l.category === "partnership").length, detail: "External company listings" },
              { label: "Commissions Paid", value: formatNaira(platformStats.totalCommissionsPaid), detail: `${commissions.length} deals` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.detail}</p>
                </div>
                <span className="text-lg font-bold text-[var(--color-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
