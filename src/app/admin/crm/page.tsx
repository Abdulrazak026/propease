"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { inquiries } from "@/lib/mock-data";

const PIPELINE_STAGES = ["New", "Contacted", "Viewing Scheduled", "Negotiation", "Closed", "Lost"] as const;

export default function CrmPage() {
  const [leads] = useState(inquiries);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = leads.filter((l) => {
    const matchesSearch = l.clientName.toLowerCase().includes(search.toLowerCase()) || l.clientContact.includes(search);
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stageCounts = PIPELINE_STAGES.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.status === s.toLowerCase().replace(/\s/g, "_")).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">CRM — Client Relationship</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track leads, inquiries, and deal pipeline</p>
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Stages</h3>
        <div className="flex gap-2 overflow-x-auto">
          {stageCounts.map((s) => (
            <div key={s.stage} className={`flex-1 min-w-[100px] p-3 rounded-lg text-center border ${filterStatus === s.stage.toLowerCase().replace(/\s/g, "_") ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-100 bg-gray-50"}`}>
              <div className="text-2xl font-bold text-gray-900">{s.count}</div>
              <div className="text-[11px] text-gray-500 mt-1">{s.stage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <option value="all">All Statuses</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s.toLowerCase().replace(/\s/g, "_")}>{s}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 font-medium text-gray-600">Contact</th>
                <th className="px-4 py-3 font-medium text-gray-600">Property</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const statusLabel = lead.status.replace(/_/g, " ");
                return (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.clientName}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.clientContact}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.listingId || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={lead.status === "new" ? "warning" : lead.status === "responded" ? "success" : "default"}>
                        {statusLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No leads found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
