"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";

interface Inquiry { id: string; clientName: string; clientContact: string; message: string; status: string; createdAt: string; listing?: { title: string } | null; }

export default function AgentInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ inquiries: Inquiry[] }>("/api/inquiries/my").then(r => {
      if (r.data?.inquiries) setInquiries(r.data.inquiries);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/agent" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Inquiries</h1><p className="text-xs text-gray-500">Client inquiries about your listings</p></div>
      </div>

      <div className="space-y-3">
        {inquiries.map(i => (
          <div key={i.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{i.clientName}</h3>
                <p className="text-xs text-gray-500">{i.clientContact}</p>
              </div>
              <Badge variant={i.status === "new" ? "warning" : i.status === "responded" ? "success" : "default"}>{i.status}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{i.message}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{i.listing?.title || "N/A"}</p>
              <p className="text-xs text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No inquiries yet</div>}
      </div>
    </div>
  );
}
