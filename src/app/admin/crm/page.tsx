"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api-client";

interface Inquiry { id: string; clientName: string; clientContact: string; message: string; status: string; createdAt: string; listing?: { title: string } | null; }

export default function CrmPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    api.get<{ inquiries: Inquiry[] }>("/api/inquiries/all").then(r => {
      if (r.data?.inquiries) setInquiries(r.data.inquiries);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = inquiries.filter((l) => {
    const m = l.clientName.toLowerCase().includes(search.toLowerCase()) || l.clientContact.includes(search);
    const s = filterStatus === "all" || l.status === filterStatus.toLowerCase().replace(/\s/g, "_");
    return m && s;
  });

  const stages = ["New", "Contacted", "Viewed", "Closed"].map((s) => ({
    stage: s,
    count: inquiries.filter((i) => i.status === s.toLowerCase().replace(/\s/g, "_")).length,
  }));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">CRM: Client Relationship</h1><p className="text-xs text-gray-500">Track leads, inquiries, and pipeline</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Stages</h3>
        <div className="flex gap-2 overflow-x-auto">
          {stages.map((s) => (
            <div key={s.stage} className="flex-1 min-w-[80px] p-3 rounded-lg text-center border border-gray-100 bg-gray-50">
              <div className="text-2xl font-bold text-gray-900">{s.count}</div>
              <div className="text-[11px] text-gray-500 mt-1">{s.stage}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <option value="all">All</option>
            {stages.map((s) => <option key={s.stage} value={s.stage.toLowerCase()}>{s.stage}</option>)}
          </select>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Client</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Contact</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th></tr></thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-xs">{l.clientName}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{l.clientContact}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{l.listing?.title || "N/A"}</td>
                  <td className="px-4 py-3"><Badge variant={l.status === "new" ? "warning" : l.status === "responded" ? "success" : "default"}>{l.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No leads found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3 p-4">
          {filtered.map((l) => (
            <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{l.clientName}</p>
                <Badge variant={l.status === "new" ? "warning" : l.status === "responded" ? "success" : "default"}>{l.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-400">Contact</span><p className="font-medium text-gray-900">{l.clientContact}</p></div>
                <div><span className="text-gray-400">Date</span><p className="font-medium text-gray-900">{new Date(l.createdAt).toLocaleDateString()}</p></div>
                <div className="col-span-2"><span className="text-gray-400">Property</span><p className="font-medium text-gray-900">{l.listing?.title || "N/A"}</p></div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center text-gray-400 text-sm py-8">No leads found</div>}
        </div>
      </div>
    </div>
  );
}
