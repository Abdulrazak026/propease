"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface App { id: string; fullName: string; email: string; phone: string; status: string; monthlyIncome: number | null; employmentStatus: string | null; createdAt: string; listing?: { title: string } | null; }

export default function AgentApplicationsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<App | null>(null);

  useEffect(() => {
    api.get<{ applications: App[] }>("/api/applications").then(r => {
      if (r.data?.applications) setApps(r.data.applications);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/agent" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Applications</h1><p className="text-xs text-gray-500">Tenant applications for your listings</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Applicant</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Income</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><p className="text-xs font-medium text-gray-900">{a.fullName}</p><p className="text-[10px] text-gray-400">{a.email}</p></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{a.listing?.title || "—"}</td>
                  <td className="px-4 py-3 text-xs">{a.monthlyIncome ? `₦${a.monthlyIncome.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3"><Badge variant={a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : "warning"}>{a.status}</Badge></td>
                  <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => setSelected(a)}>View</Button></td>
                </tr>
              ))}
              {apps.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No applications yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">{selected.fullName}</h3><button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium">{selected.email}</p></div>
              <div><span className="text-gray-400 text-xs">Phone</span><p className="font-medium">{selected.phone}</p></div>
              <div><span className="text-gray-400 text-xs">Income</span><p className="font-medium">{selected.monthlyIncome ? `₦${selected.monthlyIncome.toLocaleString()}` : "—"}</p></div>
              <div><span className="text-gray-400 text-xs">Employment</span><p className="font-medium">{selected.employmentStatus || "—"}</p></div>
              <div><span className="text-gray-400 text-xs">Status</span><Badge variant={selected.status === "approved" ? "success" : selected.status === "rejected" ? "danger" : "warning"}>{selected.status}</Badge></div>
              <div><span className="text-gray-400 text-xs">Date</span><p className="font-medium">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
