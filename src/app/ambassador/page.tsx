"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { usePermissions } from "@/lib/use-permissions";
import { useRole } from "@/context/RoleContext";
import { formatNaira } from "@/lib/utils";

interface Stats { totalListings: number; availableListings: number; agentCount: number; openTasks: number; }
interface Listing { id: string; title: string; price: number; status: string; listingType: string; }
interface Agent { id: string; name: string; walletBalance: number; }

interface DashboardData {
  stats: Stats;
  earnings: { totalEarned: number; thisMonth: number; lastMonth: number };
  recentCommissions: { amount: number; dealTitle: string; date: string }[];
  agentPerformance: { id: string; name: string; listings: number; earnings: number }[];
  inquiryStats: { new: number; read: number; responded: number };
}

export default function AmbassadorPage() {
  const { currentUser } = useRole();
  const perms = usePermissions();
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DashboardData>("/api/ambassador/dashboard"),
      api.get<{ listings: Listing[] }>("/api/ambassador/city-listings"),
      api.get<{ agents: Agent[] }>("/api/ambassador/agents"),
    ]).then(([dash, list, ag]) => {
      if (dash.data) setDashData(dash.data);
      if (list.data?.listings) setListings(list.data.listings);
      if (ag.data?.agents) setAgents(ag.data.agents);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200/60 rounded-lg w-48 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 h-28 animate-pulse" />)}
      </div>
    </div>
  );

  const s = dashData?.stats || { totalListings: 0, availableListings: 0, agentCount: 0, openTasks: 0 };
  const earnings = dashData?.earnings || { totalEarned: 0, thisMonth: 0, lastMonth: 0 };
  const agentPerf = dashData?.agentPerformance || [];
  const firstName = currentUser?.name?.split(" ")[0] || "Ambassador";

  const statCards = [
    { label: "Active Listings", value: s.availableListings, sub: `${s.totalListings} total`, icon: "🏠", gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
    { label: "Agents", value: s.agentCount, icon: "👥", gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { label: "Open Tasks", value: s.openTasks, icon: "✅", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
    { label: "Earnings", value: `₦${formatNaira(earnings.totalEarned)}`, icon: "💰", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome, {firstName}</h1>
          <p className="text-sm text-gray-500 mt-1">City performance overview</p>
        </div>
        {perms.canCreateListings && <Link href="/ambassador/listings/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Post Listing
        </Link>}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className="group bg-white rounded-2xl border border-gray-200/60 p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-16 h-16 ${c.bg} rounded-full -mr-4 -mt-4 opacity-60`} />
            <div className="relative">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-base shadow-lg mb-3`}>{c.icon}</div>
              <p className="text-xs font-medium text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{c.value}</p>
              {c.sub && <p className="text-[10px] text-gray-400 mt-0.5">{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agent Leaderboard */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Agent Leaderboard</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {agentPerf.length === 0 && agents.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-xs">No agents yet</div>
            ) : (agentPerf.length > 0 ? agentPerf : agents.map(a => ({ id: a.id, name: a.name, listings: 0, earnings: 0 }))).map((a, i) => (
              <Link key={a.id} href={`/agents/${a.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-600"}`}>{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">{a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                  <p className="text-[10px] text-gray-400">{a.listings} listings</p>
                </div>
                {a.earnings > 0 && <span className="text-xs font-medium text-emerald-600">₦{formatNaira(a.earnings)}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Listings</h2>
            <span className="text-[10px] text-gray-400">{listings.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {listings.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-xs">No listings yet</div>
            ) : listings.slice(0, 6).map(l => (
              <div key={l.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{l.title}</p>
                  <p className="text-[10px] text-gray-400">{l.listingType === "rent" ? "For Rent" : "For Sale"}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${l.status === "available" ? "bg-emerald-50 text-emerald-700" : l.status === "review" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{l.status}</span>
                  <span className="text-xs font-medium text-gray-900">₦{l.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
