"use client";
import { useRole } from "@/context/RoleContext";
import { commissions } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";

export default function AmbassadorCommissions() {
  const { currentUser } = useRole();
  const myCommissions = commissions.filter((c) => c.ambassador.id === currentUser?.id);
  const totalEarned = myCommissions.reduce((s, c) => s + c.ambassadorCut, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Commission Ledger</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your earnings from deals closed in your city</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Commission Earned</p>
        <p className="text-3xl font-bold text-[var(--color-primary)] mt-1">{formatNaira(totalEarned)}</p>
        <p className="text-xs text-gray-400 mt-1">{myCommissions.length} deal{myCommissions.length !== 1 ? "s" : ""}</p>
      </div>

      {myCommissions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/60">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">No commissions yet</h3>
          <p className="text-sm text-gray-400 mt-1">Commissions appear here when deals close in your city</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Cut</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {myCommissions.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm text-gray-900">{c.dealTitle}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{c.agent.name}</td>
                  <td className="px-4 py-3.5 text-sm text-right text-gray-900">{formatNaira(c.totalAmount)}</td>
                  <td className="px-4 py-3.5 text-sm text-right text-emerald-600 font-semibold">{formatNaira(c.ambassadorCut)}</td>
                  <td className="px-4 py-3.5 text-xs text-right text-gray-400">{formatDate(c.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
