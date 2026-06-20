"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import { formatNaira } from "@/lib/utils";

interface Reservation {
  id: string; clientName: string; holdingDeposit: number; status: string;
  expiresAt: string; createdAt: string; meetingDate?: string | null; meetingTime?: string | null;
  listing?: { id: string; title: string; address: string; price: number } | null;
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
      await api.patch(`/api/reservations/${confirmModal.id}/confirm`, { meetingDate, meetingTime });
      setReservations(prev => prev.map(r => r.id === confirmModal.id ? { ...r, status: "confirmed", meetingDate, meetingTime } : r));
      setConfirmModal(null);
      setMeetingDate("");
      setMeetingTime("");
    } catch { alert("Failed to confirm reservation"); }
    setSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setSubmitting(true);
    try {
      await api.patch(`/api/reservations/${rejectModal.id}/reject`, { reason: rejectReason });
      setReservations(prev => prev.map(r => r.id === rejectModal.id ? { ...r, status: "cancelled" } : r));
      setRejectModal(null);
      setRejectReason("");
    } catch { alert("Failed to reject reservation"); }
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
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Expires</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{r.clientName || r.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{r.user?.email || ""}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{r.listing?.title || "—"}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(r.holdingDeposit)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.status === "confirmed" ? "success" : r.status === "pending" ? "warning" : r.status === "cancelled" ? "danger" : "default"}>
                        {r.status === "pending" ? "Awaiting Confirmation" : r.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {r.status === "pending" && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setConfirmModal(r)}
                            className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setRejectModal(r)}
                            className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {r.status === "confirmed" && r.meetingDate && (
                        <div className="text-xs text-emerald-600">
                          <p className="font-medium">Meeting set</p>
                          <p>{new Date(r.meetingDate).toLocaleDateString()} at {r.meetingTime}</p>
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
                <input
                  type="date"
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Meeting Time</label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={e => setMeetingTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!meetingDate || !meetingTime || submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
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
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Reason for rejection..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRejectModal(null)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "Rejecting..." : "Reject Reservation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
