"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";

const mockCommissions = [
  { id: "c1", deal: "4-Bed Duplex — Kano Municipal", type: "rent_full", amount: 1_800_000, ambassadorCut: 108_000, agentCut: 72_000, companyCut: 1_620_000, ambassador: "Aisha Bello", agent: "Fatima Usman", date: "2026-06-01", status: "paid" },
  { id: "c2", deal: "Warehouse — Fagge", type: "rent_damages", amount: 2_400_000, ambassadorCut: 192_000, agentCut: 120_000, companyCut: 2_088_000, ambassador: "Musa Ibrahim", agent: "Zainab Adamu", date: "2026-05-28", status: "paid" },
  { id: "c3", deal: "5-Bed Villa — Nassarawa", type: "rent_full", amount: 5_000_000, ambassadorCut: 300_000, agentCut: 200_000, companyCut: 4_500_000, ambassador: "Musa Ibrahim", agent: "Ahmad Suleiman", date: "2026-06-03", status: "pending" },
  { id: "c4", deal: "Shop — Kano Municipal", type: "sale", amount: 15_000_000, ambassadorCut: 525_000, agentCut: 375_000, companyCut: 14_100_000, ambassador: "Aisha Bello", agent: "Halima Garba", date: "2026-05-15", status: "paid" },
];

const typeLabels: Record<string, string> = { rent_normal: "Normal Rent", rent_damages: "Rent with Damages", rent_full: "Full Rent", sale: "Sale", partnership: "Partnership" };

export default function CommissionsPage() {
  const [filter, setFilter] = useState("all");
  const items = filter === "all" ? mockCommissions : mockCommissions.filter((c) => c.status === filter);

  const totalPaid = mockCommissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.companyCut, 0);
  const totalPending = mockCommissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.companyCut, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Commissions</h1>
          <p className="text-xs text-gray-500">Track earnings across all deals</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Total Earned</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₦{totalPaid.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1"><span>▲</span> from {mockCommissions.filter((c) => c.status === "paid").length} paid deals</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Pending</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₦{totalPending.toLocaleString()}</p>
          <p className="text-[10px] text-amber-600 mt-1">{mockCommissions.filter((c) => c.status === "pending").length} pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">All Deals</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockCommissions.length}</p>
          <p className="text-[10px] text-gray-400 mt-1">Total deals recorded</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "paid", "pending"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${filter === s ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Deal</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Type</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Ambassador</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Agent</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Company</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-xs max-w-[180px] truncate">{c.deal}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{typeLabels[c.type] || c.type}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{c.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="text-gray-600 text-[10px]">{c.ambassador}</span>
                    <span className="block text-emerald-600 font-medium text-[10px]">₦{c.ambassadorCut.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="text-gray-600 text-[10px]">{c.agent}</span>
                    <span className="block text-blue-600 font-medium text-[10px]">₦{c.agentCut.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{c.companyCut.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={c.status === "paid" ? "success" : "warning"}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
