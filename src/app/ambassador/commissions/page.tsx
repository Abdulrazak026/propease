"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";

interface Commission { id: string; dealTitle: string; dealType: string; totalAmount: number; ambassadorCut: number; agent?: { name: string } | null; }

export default function AmbassadorCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ commissions: Commission[]; totalEarned: number }>("/api/commissions/my").then(r => {
      if (r.data?.commissions) setCommissions(r.data.commissions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const total = commissions.reduce((s, c) => s + c.ambassadorCut, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/ambassador" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Commissions</h1><p className="text-xs text-gray-500">Your earnings from city deals</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs text-gray-500">Total Earned</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">₦{total.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{commissions.length} deals</p>
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Deal</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Your Cut</th></tr></thead>
            <tbody>
              {commissions.map(c => (
                <tr key={c.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">{c.dealTitle}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{c.dealType.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-xs font-medium">₦{c.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-medium text-emerald-600">₦{c.ambassadorCut.toLocaleString()}</td>
                </tr>
              ))}
              {commissions.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No commissions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {commissions.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <p className="text-sm font-medium text-gray-900">{c.dealTitle}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-400">Type</span><p className="font-medium text-gray-900 capitalize">{c.dealType.replace(/_/g, " ")}</p></div>
              <div><span className="text-gray-400">Amount</span><p className="font-medium text-gray-900">₦{c.totalAmount.toLocaleString()}</p></div>
              <div className="col-span-2"><span className="text-gray-400">Your Cut</span><p className="font-medium text-emerald-600">₦{c.ambassadorCut.toLocaleString()}</p></div>
            </div>
          </div>
        ))}
        {commissions.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No commissions yet</div>}
      </div>
    </div>
  );
}
