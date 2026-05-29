"use client";
import { auditLogs, withdrawals } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AdminAudit() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Audit & Approvals</h1>
        <p className="text-sm text-gray-500 mt-0.5">Withdrawal requests and platform activity log</p>
      </div>

      {withdrawals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Pending Withdrawals</h2>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{w.userName}</p>
                    <p className="text-xs text-gray-500">{w.bankName} • {w.accountNumber} • {formatDate(w.requestedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-primary)]">{formatNaira(w.amount)}</span>
                  <Badge variant="warning">Pending</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => alert(`Withdrawal of ${formatNaira(w.amount)} approved (Demo)`)}>Approve</Button>
                    <Button size="sm" variant="ghost" onClick={() => alert(`Withdrawal rejected (Demo)`)}>Reject</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-sm font-semibold text-gray-900">Activity Log</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">By</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5">
                  <Badge variant={log.action.includes("Created") || log.action.includes("Approved") ? "success" : log.action.includes("Changed") || log.action.includes("Assigned") ? "info" : "default"}>
                    {log.action}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-900">{log.user.name}</td>
                <td className="px-4 py-3.5 text-sm text-gray-700">{log.target}</td>
                <td className="px-4 py-3.5 text-xs text-gray-500">{log.details}</td>
                <td className="px-4 py-3.5 text-xs text-right text-gray-400">{formatDate(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
