"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import { formatNaira } from "@/lib/utils";

interface Reservation {
  id: string; clientName: string; holdingDeposit: number; status: string;
  expiresAt: string; createdAt: string; meetingDate?: string | null; meetingTime?: string | null;
  paymentRef?: string | null;
  refundAmount?: number | null; refundedAt?: string | null; cancelledAt?: string | null;
  cancelledByUserId?: string | null; cancellationReason?: string | null;
  listing?: { id: string; title: string; address: string; price: number } | null;
  user?: { id: string; name: string; email: string } | null;
}

interface LogEntry {
  id: string; action: string; oldStatus: string | null; newStatus: string;
  reason: string | null; createdAt: string;
  user?: { id: string; name: string; email: string } | null;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [confirmModal, setConfirmModal] = useState<Reservation | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rejectModal, setRejectModal] = useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailRes, setDetailRes] = useState<Reservation | null>(null);
  const [adminCancelModal, setAdminCancelModal] = useState<Reservation | null>(null);
  const [adminCancelReason, setAdminCancelReason] = useState("");
  const [adminCancelRefund, setAdminCancelRefund] = useState(true);
  const [logModal, setLogModal] = useState<Reservation | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchReservations = () => {
    api.get<{ reservations: Reservation[] }>("/api/reservations/all").then(r => {
      if (r.data?.reservations) setReservations(r.data.reservations);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const filtered = reservations.filter(r => {
    if (!fromDate && !toDate) return true;
    const d = new Date(r.createdAt);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  const hasDateFilter = fromDate || toDate;

  const handleConfirm = async () => {
    if (!confirmModal || !meetingDate || !meetingTime) return;
    setSubmitting(true);
    try {
      const res = await api.patch(`/api/reservations/${confirmModal.id}/confirm`, { meetingDate, meetingTime });
      if (res.status !== 200) {
        alert(res.error || "Failed to confirm reservation");
        setSubmitting(false);
        return;
      }
      fetchReservations();
      setConfirmModal(null);
      setMeetingDate("");
      setMeetingTime("");
    } catch (e) { alert("Failed to confirm reservation: " + String(e)); }
    setSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setSubmitting(true);
    try {
      const res = await api.patch(`/api/reservations/${rejectModal.id}/reject`, { reason: rejectReason });
      if (res.status !== 200) {
        alert(res.error || "Failed to reject reservation");
        setSubmitting(false);
        return;
      }
      fetchReservations();
      setRejectModal(null);
      setRejectReason("");
    } catch (e) { alert("Failed to reject reservation: " + String(e)); }
    setSubmitting(false);
  };

  const handleAdminCancel = async () => {
    if (!adminCancelModal) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/api/reservations/${adminCancelModal.id}/admin-cancel`, {
        reason: adminCancelReason,
        processRefund: adminCancelRefund,
      });
      if (res.error) { alert(res.error); setSubmitting(false); return; }
      fetchReservations();
      setAdminCancelModal(null);
      setAdminCancelReason("");
      setAdminCancelRefund(true);
    } catch (e) { alert("Failed to cancel: " + String(e)); }
    setSubmitting(false);
  };

  const fetchLogs = async (reservation: Reservation) => {
    setLogModal(reservation);
    setLogsLoading(true);
    try {
      const res = await api.get<{ logs: LogEntry[] }>(`/api/reservations/${reservation.id}/logs`);
      if (res.data?.logs) setLogs(res.data.logs);
    } catch {}
    setLogsLoading(false);
  };

  const handleReschedule = async (r: Reservation) => {
    const date = prompt("New meeting date (YYYY-MM-DD):", r.meetingDate?.split("T")[0] || "");
    if (!date) return;
    const time = prompt("New meeting time (HH:MM):", r.meetingTime || "");
    if (!time) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/api/reservations/${r.id}/reschedule`, { meetingDate: date, meetingTime: time });
      if (res.error) { alert(res.error); setSubmitting(false); return; }
      fetchReservations();
    } catch (e) { alert("Failed to reschedule: " + String(e)); }
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Reservations</h1><p className="text-xs text-gray-500">Property holding deposits</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <label className="text-xs text-gray-500 font-medium">Filter by date:</label>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" placeholder="From" />
        <span className="text-xs text-gray-400">to</span>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" placeholder="To" />
        {hasDateFilter && (
          <button onClick={() => { setFromDate(""); setToDate(""); }} className="text-xs text-red-500 hover:text-red-700 px-2">Clear</button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} reservation{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
          {hasDateFilter ? "No reservations in selected date range" : "No reservations yet"}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Deposit</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Refund</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Expires</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} onClick={() => setDetailRes(r)} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                    <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{r.clientName || r.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{r.user?.email || ""}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{r.listing?.title || "—"}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(r.holdingDeposit)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.status === "confirmed" ? "success" : r.status === "pending" ? "warning" : r.status === "cancelled" ? "danger" : r.status === "expired" ? "default" : "default"}>
                        {r.status === "pending" ? "Awaiting Confirmation" : r.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.refundAmount ? <span className="text-emerald-600 font-medium">{formatNaira(r.refundAmount)}</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {r.status === "pending" && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setConfirmModal(r)} className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">Confirm</button>
                          <button onClick={() => setRejectModal(r)} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                          <button onClick={() => { setAdminCancelModal(r); setAdminCancelRefund(false); }} className="px-3 py-1.5 text-xs font-medium bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">Cancel</button>
                        </div>
                      )}
                      {r.status === "confirmed" && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button onClick={() => handleReschedule(r)} className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Reschedule</button>
                          <button onClick={() => { setAdminCancelModal(r); setAdminCancelRefund(true); }} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                        </div>
                      )}
                      {r.status === "pending_payment" && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setAdminCancelModal(r); setAdminCancelRefund(false); }} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                        </div>
                      )}
                      {r.status === "cancelled" && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => fetchLogs(r)} className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Logs</button>
                        </div>
                      )}
                      {r.status === "expired" && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => fetchLogs(r)} className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Logs</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setConfirmModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Reservation</h3>
            <p className="text-sm text-gray-500 mb-4">Set a meeting date and time for <strong>{confirmModal.listing?.title}</strong></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Meeting Date</label>
                <input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Meeting Time</label>
                <input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmModal(null)} disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleConfirm} disabled={!meetingDate || !meetingTime || submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
                {submitting ? "Confirming..." : "Confirm & Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setRejectModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Reject Reservation</h3>
            <p className="text-sm text-gray-500 mb-4">Reject the reservation for <strong>{rejectModal.listing?.title}</strong></p>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Reason (optional)</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                placeholder="Reason for rejection..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setRejectModal(null)} disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleReject} disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                {submitting ? "Rejecting..." : "Reject Reservation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailRes(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue-light px-5 py-4 flex items-center justify-between">
              <div><h3 className="text-base font-bold text-white truncate max-w-[260px]">{detailRes.listing?.title || "Property"}</h3><p className="text-xs text-brand-blue/60">{detailRes.listing?.address || ""}</p></div>
              <button onClick={() => setDetailRes(null)} className="text-white/80 hover:text-white"><i className="bi bi-x-lg text-sm"></i></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={detailRes.status === "confirmed" ? "success" : detailRes.status === "pending" ? "warning" : detailRes.status === "cancelled" ? "danger" : "default"}>
                  {detailRes.status === "pending" ? "Awaiting Confirmation" : detailRes.status}
                </Badge>
                <span className="text-xs text-gray-400">ID: {detailRes.id.slice(0, 8)}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Client</span><span className="font-medium text-gray-900">{detailRes.clientName || detailRes.user?.name || "—"}</span></div>
                {detailRes.user?.email && <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{detailRes.user.email}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-gray-500">Deposit</span><span className="font-bold text-gray-900">{formatNaira(detailRes.holdingDeposit)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Created</span><span className="font-medium text-gray-900">{new Date(detailRes.createdAt).toLocaleDateString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Expires</span><span className={`font-medium ${new Date(detailRes.expiresAt) < new Date() ? "text-red-600" : "text-gray-900"}`}>{new Date(detailRes.expiresAt).toLocaleDateString()}</span></div>
                {detailRes.paymentRef && <div className="flex justify-between text-sm"><span className="text-gray-500">Payment Ref</span><span className="text-xs font-mono text-gray-600">{detailRes.paymentRef}</span></div>}
                {detailRes.refundAmount ? <div className="flex justify-between text-sm"><span className="text-gray-500">Refund</span><span className="font-bold text-emerald-600">{formatNaira(detailRes.refundAmount)}</span></div> : null}
                {detailRes.cancelledAt && <div className="flex justify-between text-sm"><span className="text-gray-500">Cancelled</span><span className="font-medium text-gray-900">{new Date(detailRes.cancelledAt).toLocaleDateString()}</span></div>}
                {detailRes.cancellationReason && <div className="flex justify-between text-sm"><span className="text-gray-500">Reason</span><span className="font-medium text-gray-900 text-right max-w-[200px]">{detailRes.cancellationReason}</span></div>}
              </div>
              {detailRes.status === "confirmed" && detailRes.meetingDate && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                  <i className="bi bi-calendar-check text-emerald-600 text-lg"></i>
                  <p className="text-sm font-bold text-emerald-700">{new Date(detailRes.meetingDate).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} {detailRes.meetingTime ? `at ${detailRes.meetingTime}` : ""}</p>
                </div>
              )}
              <button onClick={() => setDetailRes(null)} className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {adminCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setAdminCancelModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Cancel Reservation</h3>
            <p className="text-sm text-gray-500 mb-4">
              Cancel reservation for <strong>{adminCancelModal.listing?.title}</strong>
              <br />Deposit: <strong>{formatNaira(adminCancelModal.holdingDeposit)}</strong>
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Reason</label>
                <textarea value={adminCancelReason} onChange={e => setAdminCancelReason(e.target.value)} rows={2}
                  placeholder="Reason for cancellation..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={adminCancelRefund}
                  onChange={e => setAdminCancelRefund(e.target.checked)}
                  className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                Process full refund
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdminCancelModal(null)} disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">Keep</button>
              <button onClick={handleAdminCancel} disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                {submitting ? "Processing..." : "Cancel & " + (adminCancelRefund ? "Refund" : "Mark Cancelled")}
              </button>
            </div>
          </div>
        </div>
      )}

      {logModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLogModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Audit Log</h3>
              <button onClick={() => setLogModal(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Reservation: <strong>{logModal.listing?.title}</strong></p>
            {logsLoading ? (
              <div className="flex justify-center py-8"><div className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
            ) : logs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No audit logs found</p>
            ) : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900 capitalize">{log.action}</span>
                      <span className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      {log.oldStatus && <span className="text-gray-400">{log.oldStatus}</span>}
                      {log.oldStatus && <span>→</span>}
                      <span className="font-medium text-gray-700">{log.newStatus}</span>
                    </div>
                    {log.reason && <p className="text-[11px] text-gray-500 mt-1 italic">{log.reason}</p>}
                    {log.user && <p className="text-[10px] text-gray-400 mt-1">by {log.user.name} ({log.user.email})</p>}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setLogModal(null)}
              className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}