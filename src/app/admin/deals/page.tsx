"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { formatNaira } from "@/lib/utils";

interface Transaction { id: string; reference: string; type: string; amount: number; status: string; createdAt: string; user?: { id: string; name: string; email: string } | null; }
interface Reservation { id: string; clientName: string; holdingDeposit: number; status: string; expiresAt: string; createdAt: string; meetingDate?: string | null; meetingTime?: string | null; paymentRef?: string | null; refundAmount?: number | null; cancelledAt?: string | null; listing?: { id: string; title: string; address: string } | null; user?: { id: string; name: string; email: string } | null; }
interface Withdrawal { id: string; amount: number; bankName: string; accountNumber: string; accountName: string; status: string; createdAt: string; user?: { id: string; name: string; email: string } | null; }
interface Summary { totalPayments: number; totalRefunds: number; activeDeposits: number; pendingWithdrawals: number; pendingWithdrawalAmount: number; }
type Tab = "all" | "payments" | "reservations" | "withdrawals";

function statusColor(s: string) {
  if (s === "completed" || s === "confirmed" || s === "approved") return "bg-emerald-100 text-emerald-700";
  if (s === "pending" || s === "pending_payment") return "bg-amber-100 text-amber-700";
  if (s === "cancelled" || s === "rejected" || s === "failed" || s === "expired") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-500";
}

function ReservationDetail({ r, onClose }: { r: Reservation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-light px-5 py-4 flex items-center justify-between">
          <div><h3 className="text-base font-bold text-white truncate max-w-[260px]">{r.listing?.title || "Property"}</h3><p className="text-xs text-brand-blue/60">{r.listing?.address || ""}</p></div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><i className="bi bi-x-lg text-sm"></i></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColor(r.status)}`}>{r.status}</span>
            <span className="text-xs text-gray-400">ID: {r.id.slice(0, 8)}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Client</span><span className="font-medium text-gray-900">{r.clientName || r.user?.name || "—"}</span></div>
            {r.user?.email && <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{r.user.email}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-gray-500">Deposit</span><span className="font-bold text-gray-900">{formatNaira(r.holdingDeposit)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Created</span><span className="font-medium text-gray-900">{new Date(r.createdAt).toLocaleDateString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Expires</span><span className={`font-medium ${new Date(r.expiresAt) < new Date() ? "text-red-600" : "text-gray-900"}`}>{new Date(r.expiresAt).toLocaleDateString()}</span></div>
            {r.paymentRef && <div className="flex justify-between text-sm"><span className="text-gray-500">Payment Ref</span><span className="text-xs font-mono text-gray-600">{r.paymentRef}</span></div>}
            {r.refundAmount ? <div className="flex justify-between text-sm"><span className="text-gray-500">Refund</span><span className="font-bold text-emerald-600">{formatNaira(r.refundAmount)}</span></div> : null}
          </div>
          {r.status === "confirmed" && r.meetingDate && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <i className="bi bi-calendar-check text-emerald-600 text-lg"></i>
              <p className="text-sm font-bold text-emerald-700">{new Date(r.meetingDate).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} {r.meetingTime ? `at ${r.meetingTime}` : ""}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionDetail({ t, onClose }: { t: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
          <div><h3 className="text-base font-bold text-white capitalize">{t.type.replace(/_/g, " ")}</h3></div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><i className="bi bi-x-lg text-sm"></i></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor(t.status)}`}>{t.status}</span>
            <span className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-gray-500">User</span><span className="font-medium text-gray-900">{t.user?.name || "—"}</span></div>
            {t.user?.email && <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{t.user.email}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900">{formatNaira(t.amount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Reference</span><span className="text-xs font-mono text-gray-600">{t.reference || "—"}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WithdrawalDetail({ w, onClose, onAction }: { w: Withdrawal; onClose: () => void; onAction: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const handleApprove = async () => {
    setSubmitting(true);
    try { const r = await api.post(`/api/withdrawals/withdrawals/${w.id}/approve`, {}); if (!r.error) onAction(); } catch {} finally { setSubmitting(false); }
  };
  const handleReject = async () => {
    setSubmitting(true);
    try { const r = await api.post(`/api/withdrawals/withdrawals/${w.id}/reject`, {}); if (!r.error) onAction(); } catch {} finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-5 py-4 flex items-center justify-between">
          <div><h3 className="text-base font-bold text-white">Withdrawal Request</h3></div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><i className="bi bi-x-lg text-sm"></i></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColor(w.status)}`}>{w.status}</span>
            <span className="text-xs text-gray-400">{new Date(w.createdAt).toLocaleString()}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-gray-500">User</span><span className="font-medium text-gray-900">{w.user?.name || "—"}</span></div>
            {w.user?.email && <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{w.user.email}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900">{formatNaira(w.amount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Bank</span><span className="font-medium text-gray-900">{w.bankName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Account</span><span className="font-medium text-gray-900">{w.accountName} ({w.accountNumber})</span></div>
          </div>
          {w.status === "pending" && (
            <div className="flex gap-2">
              <button onClick={handleReject} disabled={submitting}
                className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50">Reject</button>
              <button onClick={handleApprove} disabled={submitting}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {submitting ? "Processing..." : "Approve"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <i className={`bi ${icon} text-3xl text-gray-300 mb-3 block`}></i>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

export default function DealsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalPayments: 0, totalRefunds: 0, activeDeposits: 0, pendingWithdrawals: 0, pendingWithdrawalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [detailTxn, setDetailTxn] = useState<Transaction | null>(null);
  const [detailRes, setDetailRes] = useState<Reservation | null>(null);
  const [detailWd, setDetailWd] = useState<Withdrawal | null>(null);

  const fetchData = () => {
    api.get<{ transactions: Transaction[]; reservations: Reservation[]; withdrawals: Withdrawal[]; summary: Summary }>("/api/head/financials")
      .then(r => {
        if (r.data) {
          setTransactions(r.data.transactions || []);
          setReservations(r.data.reservations || []);
          setWithdrawals(r.data.withdrawals || []);
          setSummary(r.data.summary || { totalPayments: 0, totalRefunds: 0, activeDeposits: 0, pendingWithdrawals: 0, pendingWithdrawalAmount: 0 });
        }
      }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const mergedAll = [
    ...reservations.map(r => ({ type: "reservation" as const, id: r.id, title: r.listing?.title || "Property", user: r.user?.name || r.clientName, amount: r.holdingDeposit, status: r.status, date: r.createdAt, ref: r })),
    ...transactions.map(t => ({ type: "transaction" as const, id: t.id, title: t.type.replace(/_/g, " "), user: t.user?.name || "—", amount: t.amount, status: t.status, date: t.createdAt, ref: t })),
    ...withdrawals.map(w => ({ type: "withdrawal" as const, id: w.id, title: "Withdrawal", user: w.user?.name || "—", amount: w.amount, status: w.status, date: w.createdAt, ref: w })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {detailTxn && <TransactionDetail t={detailTxn} onClose={() => setDetailTxn(null)} />}
      {detailRes && <ReservationDetail r={detailRes} onClose={() => setDetailRes(null)} />}
      {detailWd && <WithdrawalDetail w={detailWd} onClose={() => setDetailWd(null)} onAction={() => { setDetailWd(null); fetchData(); }} />}

      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><i className="bi bi-arrow-left text-xl"></i></a>
        <div><h1 className="text-xl font-bold text-gray-900">Transactions</h1><p className="text-xs text-gray-500">All property transactions and payments</p></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1"><i className="bi bi-credit-card text-blue-500 text-sm"></i><p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Total Payments</p></div>
          <p className="text-xl font-bold text-gray-900">{formatNaira(summary.totalPayments)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1"><i className="bi bi-piggy-bank text-emerald-500 text-sm"></i><p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Active Deposits</p></div>
          <p className="text-xl font-bold text-gray-900">{formatNaira(summary.activeDeposits)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1"><i className="bi bi-hourglass-split text-amber-500 text-sm"></i><p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Pending W/Drawals</p></div>
          <p className="text-xl font-bold text-gray-900">{formatNaira(summary.pendingWithdrawalAmount)} <span className="text-xs font-medium text-amber-600">({summary.pendingWithdrawals})</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1"><i className="bi bi-arrow-return-left text-red-500 text-sm"></i><p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Total Refunds</p></div>
          <p className="text-xl font-bold text-gray-900">{formatNaira(summary.totalRefunds)}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {(["all", "payments", "reservations", "withdrawals"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t} {t === "payments" ? `(${transactions.length})` : t === "reservations" ? `(${reservations.length})` : t === "withdrawals" ? `(${withdrawals.length})` : `(${mergedAll.length})`}
          </button>
        ))}
      </div>

      {tab === "all" && (
        mergedAll.length === 0 ? <EmptyState icon="bi-inbox" text="No activity yet" /> : (
          <div className="space-y-2">
            {mergedAll.map(item => (
              <div key={`${item.type}-${item.id}`}
                onClick={() => { if (item.type === "transaction") setDetailTxn(item.ref); else if (item.type === "reservation") setDetailRes(item.ref); else setDetailWd(item.ref); }}
                className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-gray-300 active:scale-[0.99] transition-all flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type === "reservation" ? "bg-emerald-100" : item.type === "transaction" ? "bg-blue-100" : "bg-orange-100"
                  }`}>
                    <i className={`bi ${
                      item.type === "reservation" ? "bi-house-check text-emerald-600" : item.type === "transaction" ? "bi-credit-card text-blue-600" : "bi-wallet2 text-orange-600"
                    }`}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-400">{item.user} &middot; {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right ml-3">
                  <p className="text-sm font-bold text-gray-900">{formatNaira(item.amount)}</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${statusColor(item.status)}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "payments" && (
        transactions.length === 0 ? <EmptyState icon="bi-credit-card" text="No payments yet" /> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">User</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Ref</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
                </tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} onClick={() => setDetailTxn(t)} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{t.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{t.user?.email || ""}</p></td>
                      <td className="px-4 py-3 text-xs text-gray-600 capitalize">{t.type.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(t.amount)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-[120px] truncate">{t.reference || "—"}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusColor(t.status)}`}>{t.status}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {tab === "reservations" && (
        reservations.length === 0 ? <EmptyState icon="bi-journal-text" text="No reservations yet" /> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Client</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Deposit</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Refund</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
                </tr></thead>
                <tbody>
                  {reservations.map(r => (
                    <tr key={r.id} onClick={() => setDetailRes(r)} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{r.clientName || r.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{r.user?.email || ""}</p></td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">{r.listing?.title || "—"}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(r.holdingDeposit)}</td>
                      <td className="px-4 py-3 text-xs">{r.refundAmount ? <span className="font-medium text-emerald-600">{formatNaira(r.refundAmount)}</span> : <span className="text-gray-400">—</span>}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${statusColor(r.status)}`}>{r.status}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {tab === "withdrawals" && (
        withdrawals.length === 0 ? <EmptyState icon="bi-wallet2" text="No withdrawals yet" /> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">User</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Bank</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Account</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
                </tr></thead>
                <tbody>
                  {withdrawals.map(w => (
                    <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{w.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{w.user?.email || ""}</p></td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(w.amount)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{w.bankName}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{w.accountName}<br /><span className="text-[10px] text-gray-400">{w.accountNumber}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${statusColor(w.status)}`}>{w.status}</span></td>
                      <td className="px-4 py-3">
                        {w.status === "pending" ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setDetailWd(w)} className="px-2.5 py-1 text-[10px] font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">Review</button>
                          </div>
                        ) : <span className="text-[10px] text-gray-400">{new Date(w.createdAt).toLocaleDateString()}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}