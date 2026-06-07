"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";

interface Stats { totalListings: number; availableListings: number; agentCount: number; openTasks: number; }
interface Listing { id: string; title: string; price: number; status: string; listingType: string; }
interface Agent { id: string; name: string; walletBalance: number; }

export default function AmbassadorPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ stats: Stats }>("/api/ambassador/dashboard"),
      api.get<{ listings: Listing[] }>("/api/ambassador/city-listings"),
      api.get<{ agents: Agent[] }>("/api/ambassador/agents"),
    ]).then(([dash, list, ag]) => {
      if (dash.data?.stats) setStats(dash.data.stats);
      if (list.data?.listings) setListings(list.data.listings);
      if (ag.data?.agents) setAgents(ag.data.agents);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const s = stats || { totalListings: 0, availableListings: 0, agentCount: 0, openTasks: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">City Overview</h1>
          <p className="text-xs text-gray-500">Your city performance dashboard</p>
        </div>
        <Link href="/ambassador/listings/new" className="text-xs font-medium px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg">+ Post Listing</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Listings", value: s.availableListings, sub: `${s.totalListings} total` },
          { label: "Agents", value: s.agentCount },
          { label: "Open Tasks", value: s.openTasks },
          { label: "Revenue", value: "₦0" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{c.value}</p>
            {c.sub && <p className="text-[10px] text-gray-400">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Agents</h3>
          <div className="space-y-2">
            {agents.map(a => (
              <Link key={a.id} href={`/agents/${a.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">{a.name.split(" ").map(n=>n[0]).join("")}</div><span className="text-sm font-medium text-gray-900">{a.name}</span></div>
                <span className="text-xs font-medium text-emerald-600">₦{a.walletBalance.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Listings</h3>
          <div className="space-y-2">
            {listings.slice(0, 5).map(l => (
              <div key={l.id} className="flex items-center justify-between p-2">
                <div><p className="text-xs font-medium text-gray-900 truncate max-w-[200px]">{l.title}</p><p className="text-[10px] text-gray-400">{l.listingType === "rent" ? "For Rent" : "For Sale"} • {l.status}</p></div>
                <span className="text-xs font-medium">₦{l.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
