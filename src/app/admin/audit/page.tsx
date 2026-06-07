"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api-client";

interface AuditLog { id: string; action: string; entity: string; entityId: string | null; details: unknown; createdAt: string; user?: { name: string } | null; }

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AuditLog[]>("/api/head/audit-logs").then(r => {
      if (r.data) setLogs(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Audit Log</h1><p className="text-xs text-gray-500">Platform activity and approvals</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Action</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Entity</th><th className="px-4 py-3 text-xs font-medium text-gray-600">User</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th></tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">{l.action}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{l.entity}{l.entityId ? ` #${l.entityId.slice(0, 8)}` : ""}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{l.user?.name || "System"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(l.createdAt).toLocaleDateString()} {new Date(l.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No activity recorded yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
