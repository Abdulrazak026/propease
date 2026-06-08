"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";

interface Reservation {
  id: string; clientName: string; holdingDeposit: number; status: string;
  expiresAt: string; createdAt: string;
  listing?: { id: string; title: string; address: string; price: number } | null;
  user?: { id: string; name: string; email: string } | null;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ reservations: Reservation[] }>("/api/reservations/all").then(r => {
      if (r.data?.reservations) setReservations(r.data.reservations);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Reservations</h1><p className="text-xs text-gray-500">Property holding deposits</p></div>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No reservations yet</div>
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
              </tr></thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{r.clientName || r.user?.name || "—"}</p><p className="text-[10px] text-gray-400">{r.user?.email || ""}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{r.listing?.title || "—"}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{r.holdingDeposit?.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge variant={r.status === "active" ? "success" : r.status === "expired" ? "warning" : "default"}>{r.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
