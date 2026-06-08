"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";

interface Commission { id: string; dealTitle: string; dealType: string; totalAmount: number; ambassadorCut: number; agentCut: number; companyCut: number; paidAt: string; ambassador?: { name: string } | null; agent?: { name: string } | null; }

export default function DealsPage() {
  const [deals, setDeals] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Commission | null>(null);

  useEffect(() => {
    api.get<Commission[]>("/api/commissions").then(r => {
      if (r.data) setDeals(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? deals : deals;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const totalValue = deals.reduce((s, d) => s + d.totalAmount, 0);
  const companyValue = deals.reduce((s, d) => s + d.companyCut, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Deals</h1><p className="text-xs text-gray-500">All property transactions</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Value</p><p className="text-2xl font-bold text-gray-900 mt-1">₦{totalValue.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Company Revenue</p><p className="text-2xl font-bold text-gray-900 mt-1">₦{companyValue.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Deals</p><p className="text-2xl font-bold text-gray-900 mt-1">{deals.length}</p></div>
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Deal</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Agent</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Ambassador</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Company</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th></tr></thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(d)}>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px] truncate">{d.dealTitle}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{d.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.agent?.name || "Unassigned"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.ambassador?.name || "Unassigned"}</td>
                  <td className="px-4 py-3 text-xs font-medium text-emerald-600">₦{d.companyCut.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(d.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((d) => (
          <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer" onClick={() => setSelected(d)}>
            <p className="text-sm font-medium text-gray-900 mb-2">{d.dealTitle}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-400">Amount</span><p className="font-medium">₦{d.totalAmount.toLocaleString()}</p></div>
              <div><span className="text-gray-400">Company</span><p className="font-medium text-emerald-600">₦{d.companyCut.toLocaleString()}</p></div>
              <div><span className="text-gray-400">Agent</span><p className="font-medium">{d.agent?.name || "Unassigned"}</p></div>
              <div><span className="text-gray-400">Ambassador</span><p className="font-medium">{d.ambassador?.name || "Unassigned"}</p></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">{new Date(d.paidAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">{selected.dealTitle}</h3><button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 text-xs">Type</span><p className="font-medium capitalize">{selected.dealType.replace(/_/g, " ")}</p></div>
              <div><span className="text-gray-400 text-xs">Amount</span><p className="font-medium">₦{selected.totalAmount.toLocaleString()}</p></div>
              <div><span className="text-gray-400 text-xs">Agent Cut</span><p className="font-medium text-blue-600">₦{selected.agentCut.toLocaleString()}</p></div>
              <div><span className="text-gray-400 text-xs">Ambassador Cut</span><p className="font-medium text-amber-600">₦{selected.ambassadorCut.toLocaleString()}</p></div>
              <div className="col-span-2"><span className="text-gray-400 text-xs">Company Cut</span><p className="font-medium text-emerald-600">₦{selected.companyCut.toLocaleString()}</p></div>
              <div className="col-span-2"><span className="text-gray-400 text-xs">Date</span><p className="font-medium">{new Date(selected.paidAt).toLocaleDateString()}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
