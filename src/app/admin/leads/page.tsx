"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  intent: string;
  createdAt: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Fetch WhatsApp conversations as leads + contact submissions
    Promise.all([
      api.get<{ conversations: any[] }>("/api/whatsapp/conversations"),
      api.get<{ submissions: any[] }>("/api/admin/submissions"),
    ]).then(([waRes, contactRes]) => {
      const waLeads: Lead[] = (waRes.data?.conversations || []).map(c => ({
        id: c.id,
        name: c.name || c.phone,
        phone: c.phone,
        source: "WhatsApp",
        status: c.status,
        intent: c.intent || "inquiry",
        createdAt: c.lastMessageAt || c.createdAt,
      }));
      const contactLeads: Lead[] = (contactRes.data?.submissions || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        phone: s.phone || "",
        source: "Contact Form",
        status: s.read ? "read" : "new",
        intent: s.subject || "inquiry",
        createdAt: s.createdAt,
      }));
      setLeads([...waLeads, ...contactLeads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter || l.source.toLowerCase() === filter);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new" || l.status === "waiting").length,
    whatsapp: leads.filter(l => l.source === "WhatsApp").length,
    form: leads.filter(l => l.source === "Contact Form").length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div><h1 className="text-xl font-bold text-gray-900">Leads</h1><p className="text-xs text-gray-500">All inquiries from WhatsApp and website</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: stats.total },
          { label: "New/Waiting", value: stats.new },
          { label: "WhatsApp", value: stats.whatsapp },
          { label: "Contact Form", value: stats.form },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "new", "waiting", "WhatsApp", "Contact Form"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No leads yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(lead => (
              <div key={lead.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  if (lead.source === "WhatsApp") router.push("/admin/social-media?tab=inbox");
                }}>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                  {lead.source === "WhatsApp" ? "💬" : "📧"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500">{lead.source}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{lead.phone || "No phone"} · {lead.intent}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    lead.status === "new" || lead.status === "waiting" ? "bg-amber-100 text-amber-700" :
                    lead.status === "read" ? "bg-gray-100 text-gray-500" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>{lead.status}</span>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
