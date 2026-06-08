"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";

interface Subscriber { id: string; email: string; source?: string; isActive: boolean; createdAt: string; }

export default function AdminNewsletterPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

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

  const sendNewsletter = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setMsg(null);
    const { status } = await api.post("/api/newsletter/send", { subject, body });
    setSending(false);
    if (status === 200) {
      setMsg("Newsletter sent successfully!");
      setShowCompose(false);
      setSubject("");
      setBody("");
    } else {
      setMsg("Failed to send newsletter. Please try again.");
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500">Emails collected from the website footer</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowCompose(!showCompose)}>Send Newsletter</Button>
          <Link href="/admin" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back</Link>
        </div>
      </div>

      {msg && <div className={`px-4 py-3 rounded-lg text-sm ${msg.includes("success") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

      {showCompose && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Compose Newsletter</h2>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="e.g. New properties this week" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Body (HTML) *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 font-mono" placeholder="<p>Write your newsletter content here...</p>" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Will be sent to {subs.length} subscriber{subs.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowCompose(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
              <Button disabled={sending || !subject.trim() || !body.trim()} onClick={sendNewsletter}>{sending ? "Sending..." : "Send to All"}</Button>
            </div>
          </div>
        </div>
      )}

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
