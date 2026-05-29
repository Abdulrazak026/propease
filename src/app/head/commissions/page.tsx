"use client";
import { commissions } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";

export default function HeadCommissions() {
  const totalComms = commissions.reduce((s, c) => s + c.totalAmount, 0);
  const totalAmbassadorCuts = commissions.reduce((s, c) => s + c.ambassadorCut, 0);
  const totalAgentCuts = commissions.reduce((s, c) => s + c.agentCut, 0);
  const totalCompanyCuts = commissions.reduce((s, c) => s + c.companyCut, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Commission Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">All commission splits across the platform</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Deals", value: formatNaira(totalComms), accent: "bg-gray-100", color: "text-gray-900" },
          { label: "Company Retained", value: formatNaira(totalCompanyCuts), accent: "bg-[var(--color-primary)]/10", color: "text-[var(--color-primary)]" },
          { label: "Ambassadors", value: formatNaira(totalAmbassadorCuts), accent: "bg-amber-100", color: "text-amber-600" },
          { label: "Agents", value: formatNaira(totalAgentCuts), accent: "bg-emerald-100", color: "text-emerald-600" },
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
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission Settings</h2>
        <p className="text-xs text-gray-500 mb-4">
          Percentage rates per deal type. These determine how commissions are split.
        </p>
        <div className="space-y-2">
          {[
            { type: "Rent (Normal)", rate: "5%", ambassador: "3%", agent: "2%" },
            { type: "Rent (Standard)", rate: "8%", ambassador: "5%", agent: "3%" },
            { type: "Rent (Full Package)", rate: "10%", ambassador: "6%", agent: "4%" },
            { type: "For Sale", rate: "6%", ambassador: "3.5%", agent: "2.5%" },
            { type: "Partnership", rate: "15%", ambassador: "8%", agent: "5%" },
          ].map((item) => (
            <div key={item.type} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-700">{item.type}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Total: <strong className="text-gray-900">{item.rate}</strong></span>
                <span>Ambassador: {item.ambassador}</span>
                <span>Agent: {item.agent}</span>
                <button className="text-[var(--color-primary)] hover:underline font-medium">Edit</button>
              </div>
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
