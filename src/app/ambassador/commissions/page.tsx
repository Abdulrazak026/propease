"use client";
import { useRole } from "@/context/RoleContext";
import { commissions } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";

export default function AmbassadorCommissions() {
  const { currentUser } = useRole();
  const myCommissions = commissions.filter((c) => c.ambassador.id === currentUser?.id);
  const totalEarned = myCommissions.reduce((s, c) => s + c.ambassadorCut, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Commission Ledger</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your earnings from deals closed in your city</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-xs text-gray-500">Total Commission Earned</p>
        <p className="text-3xl font-bold text-[var(--color-primary)] mt-1">{formatNaira(totalEarned)}</p>
        <p className="text-xs text-gray-400 mt-0.5">{myCommissions.length} deal{myCommissions.length !== 1 ? "s" : ""}</p>
      </div>

      {myCommissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-base font-semibold text-gray-900">No commissions yet</h3>
          <p className="text-sm text-gray-400 mt-1">Commissions appear here when deals close in your city</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Deal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Agent</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Total</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Your Cut</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {myCommissions.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm text-gray-900">{c.dealTitle}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.agent.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{formatNaira(c.totalAmount)}</td>
                  <td className="px-4 py-3 text-sm text-right text-emerald-600 font-medium">{formatNaira(c.ambassadorCut)}</td>
                  <td className="px-4 py-3 text-xs text-right text-gray-400">{formatDate(c.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
