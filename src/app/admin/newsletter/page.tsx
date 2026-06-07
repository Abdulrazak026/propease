"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface Subscriber { id: string; email: string; source?: string; isActive: boolean; createdAt: string; }

export default function AdminNewsletterPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get<{ subscribers: Subscriber[]; total: number }>("/api/newsletter/subscribers")
      .then(r => setSubs(r.data?.subscribers || []))
      .catch(() => setSubs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subs.filter(s => !search || s.email.toLowerCase().includes(search.toLowerCase()));

  const remove = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await api.delete(`/api/newsletter/subscribers/${id}`);
    setSubs(subs.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500">Emails collected from the website footer</p>
        </div>
        <Link href="/admin" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back</Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <input
          type="search"
          placeholder="Search by email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm bg-transparent border-0 focus:outline-none px-2 py-1.5"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">No subscribers yet</p>
            <p className="text-xs text-gray-500">Visitors who subscribe from the footer will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Subscribed</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{s.source || "footer"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(s.id)} className="text-[11px] font-medium text-red-600 hover:text-red-700">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">Total: {subs.length}</p>
    </div>
  );
}
