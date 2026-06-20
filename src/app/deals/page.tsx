"use client";
import { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { api } from "@/lib/api-client";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";

interface Reservation {
  id: string; clientName: string; holdingDeposit: number; status: string;
  expiresAt: string; createdAt: string; meetingDate?: string | null; meetingTime?: string | null;
  paymentRef?: string | null;
  refundAmount?: number | null; refundedAt?: string | null; cancelledAt?: string | null;
  listing?: { id: string; title: string; address: string; price: number } | null;
}

interface Transaction {
  id: string; reference: string; type: string; amount: number;
  method: string; status: string; createdAt: string;
}

type Tab = "reservations" | "transactions";

function statusBadge(s: string) {
  if (s === "confirmed") return "bg-emerald-100 text-emerald-700";
  if (s === "pending" || s === "pending_payment") return "bg-amber-100 text-amber-700";
  if (s === "cancelled") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-500";
}
function statusLabel(s: string) {
  if (s === "pending_payment") return "Awaiting Confirmation";
  if (s === "confirmed") return "Confirmed";
  return s;
}

function DetailModal({ r, onClose, onCancel, onReschedule }: { r: Reservation; onClose: () => void; onCancel: (r: Reservation) => void; onReschedule: (r: Reservation) => void }) {
  const isActive = r.status === "pending" || r.status === "pending_payment" || r.status === "confirmed";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white truncate max-w-[260px]">{r.listing?.title || "Property"}</h3>
            <p className="text-xs text-emerald-100">{r.listing?.address || "Kano"}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><i className="bi bi-x-lg text-sm"></i></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge(r.status)}`}>{statusLabel(r.status)}</span>
            <span className="text-xs text-gray-400">ID: {r.id.slice(0, 8)}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Deposit Paid</span><span className="font-bold text-gray-900">{formatNaira(r.holdingDeposit)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Created</span><span className="font-medium text-gray-900">{new Date(r.createdAt).toLocaleDateString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Expires</span><span className={`font-medium ${new Date(r.expiresAt) < new Date() ? "text-red-600" : "text-gray-900"}`}>{new Date(r.expiresAt).toLocaleDateString()}</span></div>
            {r.paymentRef && <div className="flex justify-between text-sm"><span className="text-gray-500">Payment Ref</span><span className="text-xs font-mono text-gray-600">{r.paymentRef}</span></div>}
          </div>

          {r.status === "confirmed" && r.meetingDate && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <i className="bi bi-calendar-check text-lg"></i>
                <div>
                  <p className="text-xs font-semibold">Meeting Scheduled</p>
                  <p className="text-sm font-bold">{new Date(r.meetingDate).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} {r.meetingTime ? `at ${r.meetingTime}` : ""}</p>
                </div>
              </div>
            </div>
          )}

          {r.refundAmount ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
              <i className="bi bi-cash-stack text-amber-600 text-lg"></i>
              <div>
                <p className="text-xs font-semibold text-amber-700">Refund Issued</p>
                <p className="text-sm font-bold text-amber-800">{formatNaira(r.refundAmount)}</p>
                {r.cancelledAt && <p className="text-[10px] text-amber-600">Cancelled {new Date(r.cancelledAt).toLocaleDateString()}</p>}
              </div>
            </div>
          ) : null}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
            <i className="bi bi-info-circle text-blue-600 text-lg"></i>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Your holding deposit secures the property. Refunds follow the property&apos;s cancellation policy.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <Link href={`/listings/${r.listing?.id}`} className="flex-1 py-2.5 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              <i className="bi bi-box-arrow-up-right mr-1.5"></i>View Property
            </Link>
            {isActive && (
              <button onClick={() => { onClose(); setTimeout(() => onCancel(r), 100); }} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                <i className="bi bi-x-circle mr-1.5"></i>Cancel
              </button>
            )}
            {r.status === "confirmed" && (
              <button onClick={() => { onClose(); setTimeout(() => onReschedule(r), 100); }} className="flex-1 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-xl hover:opacity-90 transition-colors">
                <i className="bi bi-calendar-event mr-1.5"></i>Reschedule
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CancellationModal({ reservation, onClose, onSuccess }: { reservation: Reservation; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<"confirm" | "processing" | "done">("confirm");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ refundAmount: number; fee: number } | null>(null);

  const handleCancel = async () => {
    setStep("processing");
    setError("");
    try {
      const res = await api.post<{ refundAmount: number; fee: number }>(`/api/reservations/${reservation.id}/cancel`, {});
      if (res.error) { setError(res.error); setStep("confirm"); return; }
      if (res.data) setResult(res.data);
      setStep("done");
      setTimeout(() => { onSuccess(); onClose(); }, 3000);
    } catch {
      setError("Failed to cancel. Try again.");
      setStep("confirm");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        {step === "confirm" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-x-circle text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Cancel Reservation?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">{reservation.listing?.title}</p>
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 text-center mb-4">
              Refund calculated per the property&apos;s cancellation policy and time remaining.
            </p>
            {error && <p className="text-xs text-red-500 text-center mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Keep It</button>
              <button onClick={handleCancel} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Yes, Cancel</button>
            </div>
          </>
        )}
        {step === "processing" && (
          <div className="text-center py-8">
            <div className="h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Processing cancellation...</p>
          </div>
        )}
        {step === "done" && (
          <>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-check-circle text-emerald-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Cancelled</h3>
            <p className="text-sm text-gray-500 text-center">Refund: <strong className="text-emerald-600">{formatNaira(result?.refundAmount || 0)}</strong></p>
          </>
        )}
      </div>
    </div>
  );
}

function RescheduleModal({ reservation, onClose, onSuccess }: { reservation: Reservation; onClose: () => void; onSuccess: () => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!date || !time) { setError("Select a date and time"); return; }
    setStep("processing");
    setError("");
    try {
      const res = await api.post(`/api/reservations/${reservation.id}/reschedule`, { meetingDate: date, meetingTime: time });
      if (res.error) { setError(res.error); setStep("form"); return; }
      setStep("done");
      setTimeout(() => { onSuccess(); onClose(); }, 3000);
    } catch {
      setError("Failed to reschedule. Try again.");
      setStep("form");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        {step === "form" && (
          <>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-calendar-event text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Reschedule Meeting</h3>
            <label className="block text-xs font-medium text-gray-700 mb-1">New Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 mb-3" />
            <label className="block text-xs font-medium text-gray-700 mb-1">New Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 mb-3" />
            {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 transition-opacity">Reschedule</button>
            </div>
          </>
        )}
        {step === "processing" && (
          <div className="text-center py-8">
            <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Rescheduling...</p>
          </div>
        )}
        {step === "done" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-check-circle text-emerald-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Rescheduled!</h3>
            <p className="text-sm text-emerald-600 font-medium text-center">{new Date(date).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} at {time}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DealsPage() {
  const { currentUser, isAuthenticated, loading: authLoading } = useRole();
  const [tab, setTab] = useState<Tab>("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState<Reservation | null>(null);
  const [rescheduling, setRescheduling] = useState<Reservation | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLoading(false); return; }

    const fetchData = () => {
      Promise.all([
        api.get<{ reservations: Reservation[] }>("/api/reservations/my"),
        api.get<{ transactions: Transaction[] }>("/api/wallet/transactions"),
      ]).then(([rRes, rTx]) => {
        if (rRes.data?.reservations) setReservations(rRes.data.reservations);
        if (rTx.data?.transactions) setTransactions(rTx.data.transactions);
      }).catch(() => {}).finally(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-lock text-amber-600 text-3xl"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sign in to view your deals</h1>
          <p className="text-sm text-gray-500 mt-2">Track your reservations, purchases and transactions.</p>
          <Link href="/login" className="inline-block mt-4 px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Sign In</Link>
        </div>
      </div>
    );
  }

  const activeReservations = filterByDate(reservations).filter(r => r.status === "active" || r.status === "pending" || r.status === "confirmed" || r.status === "pending_payment");
  const pastReservations = filterByDate(reservations).filter(r => r.status === "expired" || r.status === "cancelled");
  const filteredTransactions = filterByDate(transactions);

  function filterByDate<T extends { createdAt: string }>(items: T[]): T[] {
    if (!fromDate && !toDate) return items;
    return items.filter(i => {
      const d = new Date(i.createdAt);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate + "T23:59:59")) return false;
      return true;
    });
  }
  const hasDateFilter = fromDate || toDate;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {detail && <DetailModal r={detail} onClose={() => setDetail(null)} onCancel={(r) => { setDetail(null); setTimeout(() => setCancelling(r), 200); }} onReschedule={(r) => { setDetail(null); setTimeout(() => setRescheduling(r), 200); }} />}
      {cancelling && <CancellationModal reservation={cancelling} onClose={() => setCancelling(null)} onSuccess={() => { setCancelling(null); setDetail(null); }} />}
      {rescheduling && <RescheduleModal reservation={rescheduling} onClose={() => setRescheduling(null)} onSuccess={() => { setRescheduling(null); setDetail(null); }} />}

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-[var(--color-primary)]">
              <i className="bi bi-arrow-left text-xl"></i>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Transactions</h1>
              <p className="text-xs text-gray-500">Reservations &amp; transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setTab("reservations")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === "reservations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Reservations ({activeReservations.length})
            </button>
            <button onClick={() => setTab("transactions")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === "transactions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Transactions ({filteredTransactions.length})
            </button>
            <button onClick={() => setShowDateFilter(!showDateFilter)}
              className={`shrink-0 px-2 py-1 rounded-md transition-colors ${hasDateFilter ? "bg-[var(--color-primary)] text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <i className="bi bi-funnel"></i>
            </button>
          </div>
          {showDateFilter && (
            <div className="flex items-center gap-2 mt-3">
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
              <span className="text-xs text-gray-400">to</span>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
              {hasDateFilter && <button onClick={() => { setFromDate(""); setToDate(""); }} className="text-xs text-red-500 hover:text-red-700 px-2">Clear</button>}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {tab === "reservations" && (
          <>
            {activeReservations.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Active Reservations</h2>
                <div className="space-y-3">
                  {activeReservations.map(r => (
                    <div key={r.id} onClick={() => setDetail(r)}
                      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer active:scale-[0.99] transition-transform hover:border-gray-300">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{r.listing?.title || "Property"}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{r.listing?.address || "Kano"}</p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${statusBadge(r.status)}`}>
                          {r.status === "pending_payment" ? "Awaiting Confirm" : r.status === "confirmed" ? "Confirmed" : r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <div><span className="text-gray-400">Deposit</span><p className="font-semibold text-gray-900">{formatNaira(r.holdingDeposit)}</p></div>
                        <div><span className="text-gray-400">Expires</span><p className="font-semibold text-gray-900">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}</p></div>
                        <div><span className="text-gray-400">Created</span><p className="font-semibold text-gray-900">{new Date(r.createdAt).toLocaleDateString()}</p></div>
                      </div>
                      {r.status === "confirmed" && r.meetingDate && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
                          <i className="bi bi-calendar-check text-emerald-600"></i>
                          <span className="text-xs font-medium text-emerald-700">
                            Meeting: {new Date(r.meetingDate).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })} {r.meetingTime ? `at ${r.meetingTime}` : ""}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <span className="text-[11px] text-gray-400"><i className="bi bi-hand-index-thumb mr-1"></i>Tap for details</span>
                        <div className="ml-auto flex gap-1.5">
                          {r.status === "confirmed" && (
                            <button onClick={e => { e.stopPropagation(); setRescheduling(r); }}
                              className="px-3 py-1.5 text-[11px] font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors">
                              <i className="bi bi-calendar-event mr-1"></i>Reschedule
                            </button>
                          )}
                          {(r.status === "pending" || r.status === "pending_payment" || r.status === "confirmed") && (
                            <button onClick={e => { e.stopPropagation(); setCancelling(r); }}
                              className="px-3 py-1.5 text-[11px] font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                              <i className="bi bi-x-circle mr-1"></i>Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pastReservations.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Past Reservations</h2>
                <div className="space-y-2">
                  {pastReservations.map(r => (
                    <div key={r.id} onClick={() => setDetail(r)}
                      className="bg-white rounded-xl border border-gray-100 p-3 cursor-pointer active:scale-[0.99] transition-transform hover:border-gray-300 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate">{r.listing?.title || "Property"}</p>
                        <p className="text-[11px] text-gray-400">
                          {formatNaira(r.holdingDeposit)} &middot; {new Date(r.createdAt).toLocaleDateString()}
                          {r.refundAmount ? <span className="text-emerald-600 ml-1 font-medium">Refund: {formatNaira(r.refundAmount)}</span> : ""}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${statusBadge(r.status)}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {reservations.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="bi bi-journal-text text-gray-400 text-2xl"></i>
                </div>
                <p className="text-sm font-medium text-gray-800">No reservations yet</p>
                <p className="text-xs text-gray-400 mt-1">Browse properties and reserve one to get started.</p>
                <Link href="/" className="inline-block mt-3 text-sm text-[var(--color-primary)] font-medium hover:underline">Browse Properties</Link>
              </div>
            )}
          </>
        )}

        {tab === "transactions" && (
          <>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2">
                {filteredTransactions.map(tx => (
                  <div key={tx.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 capitalize">{tx.type.replace(/_/g, " ")}</p>
                      <p className="text-[11px] text-gray-400">{tx.reference || tx.id.slice(0, 8)} &middot; {new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-sm font-semibold ${tx.type === "withdrawal" ? "text-red-600" : "text-emerald-600"}`}>
                        {tx.type === "withdrawal" ? "-" : "+"}{formatNaira(tx.amount)}
                      </p>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        tx.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        tx.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="bi bi-currency-dollar text-gray-400 text-2xl"></i>
                </div>
                <p className="text-sm font-medium text-gray-800">No transactions yet</p>
                <p className="text-xs text-gray-400 mt-1">Transactions will appear here once you make payments or receive payouts.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}