"use client";
import { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { api } from "@/lib/api-client";
import { formatNaira, formatDate } from "@/lib/utils";
import Link from "next/link";

interface Reservation {
  id: string; clientName: string; holdingDeposit: number; status: string;
  expiresAt: string; createdAt: string; meetingDate?: string | null; meetingTime?: string | null;
  listing?: { id: string; title: string; address: string; price: number } | null;
}

interface Transaction {
  id: string; reference: string; type: string; amount: number;
  method: string; status: string; createdAt: string;
}

type Tab = "reservations" | "transactions";

export default function DealsPage() {
  const { currentUser, isAuthenticated, loading: authLoading } = useRole();
  const [tab, setTab] = useState<Tab>("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLoading(false); return; }

    Promise.all([
      api.get<{ reservations: Reservation[] }>("/api/reservations/my"),
      api.get<{ transactions: Transaction[] }>("/api/wallet/transactions"),
    ]).then(([rRes, rTx]) => {
      if (rRes.data?.reservations) setReservations(rRes.data.reservations);
      if (rTx.data?.transactions) setTransactions(rTx.data.transactions);
    }).catch(() => {}).finally(() => setLoading(false));
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
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sign in to view your deals</h1>
          <p className="text-sm text-gray-500 mt-2">Track your reservations, purchases and transactions.</p>
          <Link href="/login" className="inline-block mt-4 px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Sign In
          </Link>
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-[var(--color-primary)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Deals</h1>
              <p className="text-xs text-gray-500">Reserved properties &amp; transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTab("reservations")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === "reservations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Reservations ({activeReservations.length})
            </button>
            <button
              onClick={() => setTab("transactions")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === "transactions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Transactions ({filteredTransactions.length})
            </button>
          <button onClick={() => setShowDateFilter(!showDateFilter)} className={`shrink-0 px-2 py-1 rounded-md transition-colors ${hasDateFilter ? "bg-[var(--color-primary)] text-white" : "text-gray-400 hover:text-gray-600"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          </button>
          </div>
        {showDateFilter && (
          <div className="flex items-center gap-2 mt-3">
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" placeholder="From" />
            <span className="text-xs text-gray-400">to</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" placeholder="To" />
            {hasDateFilter && (
              <button onClick={() => { setFromDate(""); setToDate(""); }} className="text-xs text-red-500 hover:text-red-700 px-2">
                Clear
              </button>
            )}
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
                    <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <Link href={`/listings/${r.listing?.id}`} className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)] block truncate">
                            {r.listing?.title || "Property"}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">{r.listing?.address || "Kano"}</p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full ${r.status === "active" || r.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : r.status === "pending" || r.status === "pending_payment" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                          {r.status === "pending" || r.status === "pending_payment" ? "Paid, Awaiting Confirmation" : r.status === "confirmed" ? "Confirmed" : r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <div><span className="text-gray-400">Deposit</span><p className="font-medium text-gray-900">₦{r.holdingDeposit?.toLocaleString()}</p></div>
                        <div><span className="text-gray-400">Expires</span><p className="font-medium text-gray-900">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}</p></div>
                        <div><span className="text-gray-400">Created</span><p className="font-medium text-gray-900">{new Date(r.createdAt).toLocaleDateString()}</p></div>
                      </div>
                      {r.status === "confirmed" && r.meetingDate && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                          <span className="text-xs font-medium text-emerald-700">Meeting: {new Date(r.meetingDate).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} {r.meetingTime ? `at ${r.meetingTime}` : ""}</span>
                        </div>
                      )}
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
                    <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate">{r.listing?.title || "Property"}</p>
                        <p className="text-[11px] text-gray-400">₦{r.holdingDeposit?.toLocaleString()} &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500 capitalize">{r.status}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {reservations.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
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
                        {tx.type === "withdrawal" ? "-" : "+"}₦{tx.amount?.toLocaleString()}
                      </p>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        tx.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        tx.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
