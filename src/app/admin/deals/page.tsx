"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { formatNaira } from "@/lib/utils";

interface Commission { id: string; dealTitle: string; dealType: string; totalAmount: number; ambassadorCut: number; agentCut: number; companyCut: number; paidAt: string; ambassador?: { name: string } | null; agent?: { name: string } | null; }
interface Transaction { id: string; reference: string; type: string; amount: number; status: string; createdAt: string; user?: { name: string; email: string } | null; }

export default function DealsPage() {
  const [deals, setDeals] = useState<Commission[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Commission | Transaction | null>(null);
  const [tab, setTab] = useState<"commissions" | "payments">("commissions");

  useEffect(() => {
    Promise.all([
      api.get<Commission[]>("/api/commissions"),
      api.get<{ transactions: Transaction[] }>("/api/head/transactions"),
    ]).then(([cRes, tRes]) => {
      if (cRes.data) setDeals(Array.isArray(cRes.data) ? cRes.data : []);
      if (tRes.data?.transactions) setTransactions(tRes.data.transactions);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const totalValue = deals.reduce((s, d) => s + d.totalAmount, 0);
  const companyValue = deals.reduce((s, d) => s + d.companyCut, 0);
  const totalPayments = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Transactions</h1><p className="text-xs text-gray-500">All property transactions and payments</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Commissions</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatNaira(totalValue)}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Company Revenue</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatNaira(companyValue)}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Payments</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatNaira(totalPayments)}</p></div>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button onClick={() => setTab("commissions")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === "commissions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
          Commissions ({deals.length})
        </button>
        <button onClick={() => setTab("payments")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === "payments" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
          Payments ({transactions.length})
        </button>
      </div>

      {tab === "commissions" && (
        <>
          {deals.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No commissions yet</div>
          ) : (
            <>
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Deal</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Agent</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Ambassador</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Company</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th></tr></thead>
                    <tbody>
                      {deals.map((d) => (
                        <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(d)}>
                          <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px] truncate">{d.dealTitle}</td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(d.totalAmount)}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{d.agent?.name || "—"}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{d.ambassador?.name || "—"}</td>
                          <td className="px-4 py-3 text-xs font-medium text-emerald-600">{formatNaira(d.companyCut)}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(d.paidAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="md:hidden space-y-3">
                {deals.map((d) => (
                  <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer" onClick={() => setSelected(d)}>
                    <p className="text-sm font-medium text-gray-900 mb-2">{d.dealTitle}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-400">Amount</span><p className="font-medium">{formatNaira(d.totalAmount)}</p></div>
                      <div><span className="text-gray-400">Company</span><p className="font-medium text-emerald-600">{formatNaira(d.companyCut)}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {tab === "payments" && (
        <>
          {transactions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No payments yet</div>
          ) : (
            <>
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">User</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Reference</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th></tr></thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{t.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{t.user?.email || ""}</p></td>
                          <td className="px-4 py-3 text-xs text-gray-600 capitalize">{t.type.replace(/_/g, " ")}</td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(t.amount)}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 font-mono">{t.reference || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${t.status === "completed" ? "bg-emerald-100 text-emerald-700" : t.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{t.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="md:hidden space-y-3">
                {transactions.map((t) => (
                  <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{t.user?.name || "—"}</p>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${t.status === "completed" ? "bg-emerald-100 text-emerald-700" : t.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{t.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">{t.type.replace(/_/g, " ")}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900">{formatNaira(t.amount)}</span>
                      <span className="text-[10px] text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
