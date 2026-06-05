"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";

const deals = [
  { id: "d1", property: "4-Bed Duplex — Kano Municipal", type: "rent", amount: 1_800_000, client: "Sani Ibrahim", agent: "Fatima Usman", status: "closed", date: "2026-06-01" },
  { id: "d2", property: "Warehouse — Fagge", type: "rent", amount: 2_400_000, client: "Kabiru Ltd", agent: "Zainab Adamu", status: "closed", date: "2026-05-28" },
  { id: "d3", property: "5-Bed Villa — Nassarawa", type: "rent", amount: 5_000_000, client: "Dr. Amina", agent: "Ahmad Suleiman", status: "in_progress", date: "2026-06-03" },
  { id: "d4", property: "Shop — Kano Municipal", type: "sale", amount: 15_000_000, client: "Aliyu & Sons", agent: "Halima Garba", status: "closed", date: "2026-05-15" },
  { id: "d5", property: "Land Plot — Tarauni", type: "sale", amount: 7_000_000, client: "Musa Abubakar", agent: "Fatima Usman", status: "cancelled", date: "2026-04-20" },
];

const statusStyles: Record<string, string> = { closed: "bg-emerald-100 text-emerald-800", in_progress: "bg-blue-100 text-blue-800", cancelled: "bg-red-100 text-red-800" };

export default function DealsPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<(typeof deals)[0] | null>(null);
  const items = filter === "all" ? deals : deals.filter((d) => d.status === filter);

  const closedValue = deals.filter((d) => d.status === "closed").reduce((s, d) => s + d.amount, 0);
  const totalDeals = deals.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Deals</h1>
          <p className="text-xs text-gray-500">All property transactions and deals</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Closed Value</p><p className="text-2xl font-bold text-gray-900 mt-1">₦{closedValue.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Total Deals</p><p className="text-2xl font-bold text-gray-900 mt-1">{totalDeals}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Active</p><p className="text-2xl font-bold text-gray-900 mt-1">{deals.filter((d) => d.status === "in_progress").length}</p></div>
      </div>

      <div className="flex gap-2">
        {["all", "closed", "in_progress", "cancelled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${filter === s ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200"}`}>{s.replace("_", " ")}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600 text-xs">Property</th><th className="px-4 py-3 font-medium text-gray-600 text-xs">Type</th><th className="px-4 py-3 font-medium text-gray-600 text-xs">Client</th><th className="px-4 py-3 font-medium text-gray-600 text-xs">Agent</th><th className="px-4 py-3 font-medium text-gray-600 text-xs">Amount</th><th className="px-4 py-3 font-medium text-gray-600 text-xs">Status</th><th className="px-4 py-3 font-medium text-gray-600 text-xs">Date</th></tr></thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(d)}>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px] truncate">{d.property}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{d.type}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.client}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.agent}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{d.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[d.status]}`}>{d.status.replace("_", " ")}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">{selected.property}</h3><button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 text-xs">Client</span><p className="font-medium">{selected.client}</p></div>
              <div><span className="text-gray-400 text-xs">Agent</span><p className="font-medium">{selected.agent}</p></div>
              <div><span className="text-gray-400 text-xs">Type</span><p className="font-medium capitalize">{selected.type}</p></div>
              <div><span className="text-gray-400 text-xs">Amount</span><p className="font-medium text-emerald-600">₦{selected.amount.toLocaleString()}</p></div>
              <div><span className="text-gray-400 text-xs">Status</span><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${selected.status==="closed"?"bg-emerald-100 text-emerald-800":"bg-blue-100 text-blue-800"}`}>{selected.status.replace("_"," ")}</span></div>
              <div><span className="text-gray-400 text-xs">Date</span><p className="font-medium">{selected.date}</p></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100"><h4 className="text-xs font-semibold text-gray-700 mb-2">Commission Breakdown</h4><div className="text-xs text-gray-400">Agent: 3% • Ambassador: 2% • Company: remainder</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
