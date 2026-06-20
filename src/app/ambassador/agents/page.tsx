"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { formatNaira } from "@/lib/utils";

interface Agent {
  id: string; name: string; email: string; city: string | null;
  walletBalance: number; canCloseDeals: boolean; createdAt: string;
  _count: { assignedListings: number; assignedTasks: number };
}

export default function AmbassadorAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ agents: Agent[] }>("/api/ambassador/agents").then(r => {
      if (r.data?.agents) setAgents(r.data.agents);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/ambassador" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Agents</h1>
          <p className="text-xs text-gray-500">Agents working under your area</p>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">No agents assigned to you yet.</p>
          <p className="text-xs text-gray-400 mt-1">Contact admin to assign agents to your city.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {agents.map(a => (
            <Link key={a.id} href={`/agents/${a.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                  {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{a.name}</p>
                  <p className="text-xs text-gray-500 truncate">{a.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-emerald-600">₦{formatNaira(a.walletBalance)}</p>
                  <p className="text-[10px] text-gray-400">Balance</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{a._count.assignedListings}</p>
                  <p className="text-[10px] text-gray-400">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{a._count.assignedTasks}</p>
                  <p className="text-[10px] text-gray-400">Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{a.city || "—"}</p>
                  <p className="text-[10px] text-gray-400">City</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
