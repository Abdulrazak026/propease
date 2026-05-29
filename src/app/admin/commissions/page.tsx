"use client";
import { useState } from "react";
import { commissions, listings, platformStats } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function AdminCommissions() {
  const totalComms = commissions.reduce((s, c) => s + c.totalAmount, 0);
  const totalAmbassadorCuts = commissions.reduce((s, c) => s + c.ambassadorCut, 0);
  const totalAgentCuts = commissions.reduce((s, c) => s + c.agentCut, 0);
  const totalCompanyCuts = commissions.reduce((s, c) => s + c.companyCut, 0);

  const [rates, setRates] = useState([
    { type: "Rent (Normal)", total: 5, ambassador: 3, agent: 2 },
    { type: "Rent (Standard)", total: 8, ambassador: 5, agent: 3 },
    { type: "Rent (Full Package)", total: 10, ambassador: 6, agent: 4 },
    { type: "For Sale", total: 6, ambassador: 3.5, agent: 2.5 },
    { type: "Partnership", total: 15, ambassador: 8, agent: 5 },
  ]);

  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Commissions & Rates</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure commission splits and view earnings</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Deal Volume", value: formatNaira(totalComms), accent: "bg-gray-100", color: "text-gray-900" },
          { label: "Company Revenue", value: formatNaira(totalCompanyCuts), accent: "bg-[var(--color-primary)]/10", color: "text-[var(--color-primary)]" },
          { label: "To Ambassadors", value: formatNaira(totalAmbassadorCuts), accent: "bg-amber-100", color: "text-amber-600" },
          { label: "To Agents", value: formatNaira(totalAgentCuts), accent: "bg-emerald-100", color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
                <span className={`text-sm font-bold ${s.color}`}>₦</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Commission Rate Config</h2>
          <Button size="sm" onClick={() => alert("Changes saved (Demo)")}>Save Changes</Button>
        </div>
        <div className="space-y-2">
          {rates.map((r) => (
            <div key={r.type} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-700 font-medium">{r.type}</p>
              {editing === r.type ? (
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-500">Total <input className="w-14 rounded border border-gray-200 px-2 py-1 text-xs" value={r.total} onChange={(e) => {}} /></label>
                  <label className="text-xs text-gray-500">Amb <input className="w-14 rounded border border-gray-200 px-2 py-1 text-xs" value={r.ambassador} onChange={(e) => {}} /></label>
                  <label className="text-xs text-gray-500">Agent <input className="w-14 rounded border border-gray-200 px-2 py-1 text-xs" value={r.agent} onChange={(e) => {}} /></label>
                  <button className="text-xs text-emerald-600 font-medium" onClick={() => setEditing(null)}>Done</button>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Total: <strong className="text-gray-900">{r.total}%</strong></span>
                  <span>Ambassador: {r.ambassador}%</span>
                  <span>Agent: {r.agent}%</span>
                  <button className="text-[var(--color-primary)] hover:underline font-medium" onClick={() => setEditing(r.type)}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-sm font-semibold text-gray-900">Commission History</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ambassador</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 text-sm text-gray-900">{c.dealTitle}</td>
                <td className="px-4 py-3.5 text-xs text-gray-500">{c.dealType}</td>
                <td className="px-4 py-3.5 text-xs text-gray-500">{c.ambassador.name}</td>
                <td className="px-4 py-3.5 text-xs text-gray-500">{c.agent.name}</td>
                <td className="px-4 py-3.5 text-sm text-right text-gray-900">{formatNaira(c.totalAmount)}</td>
                <td className="px-4 py-3.5 text-sm text-right text-[var(--color-primary)] font-semibold">{formatNaira(c.companyCut)}</td>
                <td className="px-4 py-3.5 text-xs text-right text-gray-400">{formatDate(c.paidAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
