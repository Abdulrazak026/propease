"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface Agreement { id: string; tenantName: string; landlordName: string; propertyTitle: string; annualRent: number; status: string; createdAt: string; }

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", pending_landlord: "bg-amber-100 text-amber-800",
  pending_tenant: "bg-blue-100 text-blue-800", completed: "bg-emerald-100 text-emerald-800",
  expired: "bg-red-100 text-red-800", terminated: "bg-red-100 text-red-800",
};

export default function AdminAgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get<Agreement[]>("/api/agreements").then(r => {
      if (r.data) setAgreements(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? agreements : filter === "pending" ? agreements.filter(a => a.status === "pending_landlord" || a.status === "pending_tenant") : agreements.filter(a => a.status === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const stats = { total: agreements.length, pending: agreements.filter(a => a.status === "pending_landlord" || a.status === "pending_tenant").length, completed: agreements.filter(a => a.status === "completed").length };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Agreements</h1><p className="text-xs text-gray-500">Tenancy agreements and contracts</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: "Total", value: stats.total, bg: "bg-gray-50", filterKey: "all" },{ label: "Pending Signature", value: stats.pending, bg: "bg-amber-50", filterKey: "pending" },{ label: "Completed", value: stats.completed, bg: "bg-emerald-50", filterKey: "completed" }].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-gray-200 p-4 text-center cursor-pointer`} onClick={() => setFilter(filter === s.filterKey ? "all" : s.filterKey)}>
            <p className="text-xs text-gray-500">{s.label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Tenant</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Landlord</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Rent</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs text-gray-900">{a.tenantName}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{a.landlordName}</td>
                  <td className="px-4 py-3 text-xs text-gray-900 font-medium max-w-[150px] truncate">{a.propertyTitle}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{a.annualRent.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[a.status]||""}`}>{a.status.replace(/_/g," ")}</span></td>
                  <td className="px-4 py-3"><Link href={`/agreements/${a.id}`} className="text-xs text-[var(--color-primary)] hover:underline font-medium">View</Link></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No agreements found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
