"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";

interface Faq { id: string; question: string; answer: string; order: number; }

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = () => {
    setLoading(true);
    api.get<{ faqs: Faq[] }>("/api/faqs").then(r => {
      if (r.data?.faqs) setFaqs(r.data.faqs);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const openEdit = (f: Faq) => {
    setEditId(f.id);
    setForm({ question: f.question, answer: f.answer, order: f.order });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ question: "", answer: "", order: faqs.length });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    if (editId) {
      await api.patch(`/api/faqs/${editId}`, form);
    } else {
      await api.post("/api/faqs", form);
    }
    setSaving(false);
    setShowForm(false);
    fetchFaqs();
  };

  const deleteFaq = async (id: string) => {
    await api.delete(`/api/faqs/${id}`);
    fetchFaqs();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
          <div><h1 className="text-xl font-bold text-gray-900">FAQs</h1><p className="text-xs text-gray-500">Manage frequently asked questions</p></div>
        </div>
        <Button size="sm" onClick={openCreate}>+ New FAQ</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">{editId ? "Edit FAQ" : "New FAQ"}</h3>
          <input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Question" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Answer" rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Display order" className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <div className="flex gap-2"><Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600 w-8">#</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Question</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Answer</th><th className="px-4 py-3 text-xs font-medium text-gray-600 w-32">Actions</th></tr></thead>
          <tbody>
            {faqs.map(f => (
              <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-xs text-gray-400">{f.order}</td>
                <td className="px-4 py-3 text-xs font-medium text-gray-900">{f.question}</td>
                <td className="px-4 py-3 text-xs text-gray-600 max-w-[300px] truncate">{f.answer}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => openEdit(f)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => deleteFaq(f.id)}>Delete</Button></div>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No FAQs yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
