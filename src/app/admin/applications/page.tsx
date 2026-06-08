"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface App {
  id: string; fullName: string; email: string; phone: string; status: string;
  monthlyIncome: number | null; employmentStatus: string | null; createdAt: string;
  listing?: { title: string } | null;
  assignedAgent?: { id: string; name: string } | null;
}

const statusStyles: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<App | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get<{ applications: App[] }>("/api/applications").then(r => {
      if (r.data?.applications) setApps(r.data.applications);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);
  const counts = {
    all: apps.length,
    submitted: apps.filter(a => a.status === "submitted").length,
    under_review: apps.filter(a => a.status === "under_review").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Applications</h1><p className="text-xs text-gray-500">All tenant applications across the platform</p></div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[["all", `All (${counts.all})`], ["submitted", `Submitted (${counts.submitted})`], ["under_review", `Under Review (${counts.under_review})`], ["approved", `Approved (${counts.approved})`], ["rejected", `Rejected (${counts.rejected})`]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v!)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${filter === v ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{l}</button>
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Applicant</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Agent</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Income</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{a.fullName}</p><p className="text-[10px] text-gray-400">{a.email}</p></td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate">{a.listing?.title || "N/A"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{a.assignedAgent?.name || "Unassigned"}</td>
                  <td className="px-4 py-3 text-xs">{a.monthlyIncome ? `₦${a.monthlyIncome.toLocaleString()}` : "N/A"}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[a.status] || "bg-gray-100 text-gray-700"}`}>{a.status.replace(/_/g, " ")}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => setSelected(a)}>View</Button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No applications found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{a.fullName}</p>
                <p className="text-[10px] text-gray-400">{a.email}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[a.status] || "bg-gray-100 text-gray-700"}`}>{a.status.replace(/_/g, " ")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-400">Property</span><p className="font-medium text-gray-900">{a.listing?.title || "N/A"}</p></div>
              <div><span className="text-gray-400">Agent</span><p className="font-medium text-gray-900">{a.assignedAgent?.name || "Unassigned"}</p></div>
              <div><span className="text-gray-400">Income</span><p className="font-medium text-gray-900">{a.monthlyIncome ? `₦${a.monthlyIncome.toLocaleString()}` : "N/A"}</p></div>
              <div><span className="text-gray-400">Date</span><p className="font-medium text-gray-900">{new Date(a.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="pt-1">
              <Button size="sm" variant="ghost" onClick={() => setSelected(a)}>View</Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No applications found</div>}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">{selected.fullName}</h3><button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium">{selected.email}</p></div>
              <div><span className="text-gray-400 text-xs">Phone</span><p className="font-medium">{selected.phone}</p></div>
              <div><span className="text-gray-400 text-xs">Income</span><p className="font-medium">{selected.monthlyIncome ? `₦${selected.monthlyIncome.toLocaleString()}` : "N/A"}</p></div>
              <div><span className="text-gray-400 text-xs">Employment</span><p className="font-medium">{selected.employmentStatus || "N/A"}</p></div>
              <div><span className="text-gray-400 text-xs">Property</span><p className="font-medium">{selected.listing?.title || "N/A"}</p></div>
              <div><span className="text-gray-400 text-xs">Agent</span><p className="font-medium">{selected.assignedAgent?.name || "Unassigned"}</p></div>
              <div><span className="text-gray-400 text-xs">Status</span><span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[selected.status] || "bg-gray-100 text-gray-700"}`}>{selected.status.replace(/_/g, " ")}</span></div>
              <div><span className="text-gray-400 text-xs">Date</span><p className="font-medium">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
