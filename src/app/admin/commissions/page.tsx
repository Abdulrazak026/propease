"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";

interface Commission { id: string; dealTitle: string; dealType: string; totalAmount: number; ambassadorCut: number; agentCut: number; companyCut: number; paidAt: string; ambassador?: { name: string } | null; agent?: { name: string } | null; }

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = () => {
    api.get<Commission[]>("/api/commissions").then(r => {
      if (r.data) setCommissions(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCommissions(); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const companyTotal = commissions.reduce((s, c) => s + c.companyCut, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Commissions</h1><p className="text-xs text-gray-500">Track earnings across all deals</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Earned</p><p className="text-2xl font-bold text-gray-900 mt-1">₦{companyTotal.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">All Deals</p><p className="text-2xl font-bold text-gray-900 mt-1">{commissions.length}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Volume</p><p className="text-2xl font-bold text-gray-900 mt-1">₦{commissions.reduce((s,c)=>s+c.totalAmount,0).toLocaleString()}</p></div>
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Deal</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Ambassador</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Agent</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Company</th></tr></thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[160px] truncate">{c.dealTitle}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{c.dealType.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{c.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs"><span className="text-gray-500 text-[10px]">{c.ambassador?.name||"N/A"}</span><span className="block text-emerald-600 font-medium text-[10px]">₦{c.ambassadorCut.toLocaleString()}</span></td>
                  <td className="px-4 py-3 text-xs"><span className="text-gray-500 text-[10px]">{c.agent?.name||"N/A"}</span><span className="block text-blue-600 font-medium text-[10px]">₦{c.agentCut.toLocaleString()}</span></td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{c.companyCut.toLocaleString()}</td>
                </tr>
              ))}
              {commissions.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No commissions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {commissions.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">{c.dealTitle}</p>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{c.dealType.replace(/_/g, " ")}</span>
            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              <div><span className="text-gray-400">Total</span><p className="font-medium">₦{c.totalAmount.toLocaleString()}</p></div>
              <div><span className="text-gray-400">Company</span><p className="font-medium text-emerald-600">₦{c.companyCut.toLocaleString()}</p></div>
              <div><span className="text-gray-400">Ambassador</span><p className="font-medium">{c.ambassador?.name||"N/A"} <span className="text-emerald-600">₦{c.ambassadorCut.toLocaleString()}</span></p></div>
              <div><span className="text-gray-400">Agent</span><p className="font-medium">{c.agent?.name||"N/A"} <span className="text-blue-600">₦{c.agentCut.toLocaleString()}</span></p></div>
            </div>
          </div>
        ))}
        {commissions.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No commissions yet.</div>}
      </div>
    </div>
  );
}
