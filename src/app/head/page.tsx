"use client";
import { listings, tasks, users, commissions, platformStats } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

export default function HeadOverview() {
  const stats = [
    { label: "Total Users", value: platformStats.totalUsers, accent: "bg-blue-100", color: "text-blue-600" },
    { label: "Active Listings", value: platformStats.availableListings, accent: "bg-emerald-100", color: "text-emerald-600" },
    { label: "Open Tasks", value: platformStats.openTasks + platformStats.inProgressTasks, accent: "bg-amber-100", color: "text-amber-600" },
    { label: "Company Revenue", value: formatNaira(platformStats.totalRevenue), accent: "bg-[var(--color-primary)]/10", color: "text-[var(--color-primary)]" },
  ];

  const recentListings = [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">System Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Full platform visibility across all cities</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
                <span className={`text-sm font-bold ${s.color}`}>{typeof s.value === "string" ? "₦" : s.value}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Listings</h2>
          <div className="space-y-1">
            {recentListings.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{l.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.city} • by {l.postedBy.name}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  l.status === "available" ? "bg-emerald-100 text-emerald-700" :
                  l.status === "reserved" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Summary</h2>
          <div className="space-y-2">
            {[
              { label: "Cities", value: "4", detail: "Kano Municipal, Fagge, Tarauni, Nassarawa" },
              { label: "Ambassadors", value: users.filter((u) => u.role === "ambassador").length, detail: `${users.filter((u) => u.role === "agent").length} agents` },
              { label: "Partnerships", value: listings.filter((l) => l.category === "partnership").length, detail: "External companies" },
              { label: "Commissions Paid", value: formatNaira(platformStats.totalCommissionsPaid), detail: `${commissions.length} deals completed` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                </div>
                <span className="text-sm font-bold text-[var(--color-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
