"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Inquiry { id: string; clientName: string; clientContact: string; message: string; status: string; createdAt: string; listing?: { title: string } | null; }
interface Message { id: string; content: string; senderId: string; createdAt: string; sender?: { id: string; name: string; }; }

export default function AgentInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loadingConv, setLoadingConv] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get<{ inquiries: Inquiry[] }>("/api/inquiries/my").then(r => {
      if (r.data?.inquiries) setInquiries(r.data.inquiries);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openInquiry = async (i: Inquiry) => {
    setSelected(i);
    setReplyText("");
    setConversation([]);
    setLoadingConv(true);
    try {
      const r = await api.get<any>(`/api/inquiries/${i.id}/conversation`);
      if (r.data?.conversation?.messages) {
        setConversation(r.data.conversation.messages);
      }
    } catch {}
    setLoadingConv(false);
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    try {
      const r = await api.post(`/api/inquiries/${selected.id}/reply`, { message: replyText.trim() });
      if ((r as any).error) return;
      setConversation(prev => [...prev, {
        id: crypto.randomUUID(),
        content: replyText.trim(),
        senderId: "me",
        createdAt: new Date().toISOString(),
        sender: { id: "me", name: "You" },
      }]);
      setReplyText("");
      setInquiries(prev => prev.map(inq => inq.id === selected.id ? { ...inq, status: "responded" as const } : inq));
      setSelected(prev => prev ? { ...prev, status: "responded" as const } : null);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selected) return;
    try {
      await api.patch(`/api/inquiries/${selected.id}/status`, { status });
      setInquiries(prev => prev.map(inq => inq.id === selected.id ? { ...inq, status: status as any } : inq));
      setSelected(prev => prev ? { ...prev, status: status as any } : null);
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/agent" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Inquiries</h1><p className="text-xs text-gray-500">Client inquiries about your listings</p></div>
      </div>

      <div className="space-y-3">
        {inquiries.map(i => (
          <button key={i.id} onClick={() => openInquiry(i)} className="w-full text-left bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
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
          </button>
        ))}
        {inquiries.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No inquiries yet</div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if (!sending) { setSelected(null); } }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-teal-600 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white truncate">{selected.clientName}</h3>
                  <p className="text-sm text-emerald-100 truncate">{selected.clientContact}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 text-white/80 hover:text-white ml-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={selected.status === "new" ? "warning" : selected.status === "responded" ? "success" : "default"}>{selected.status}</Badge>
                <span className="text-xs text-emerald-200">{selected.listing?.title || ""}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
              {loadingConv ? (
                <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
              ) : conversation.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-gray-900 mb-1">Initial Inquiry</p>
                  <p className="text-xs text-gray-500 bg-white rounded-lg p-3 border border-gray-200">{selected.message}</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-600">{selected.message}</div>
                  <div className="border-t border-gray-200 pt-2">
                    {conversation.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"} mb-2`}>
                        <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${msg.senderId === "me" ? "bg-[var(--color-primary)] text-white rounded-br-md" : "bg-white border border-gray-100 text-gray-900 rounded-bl-md"}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="shrink-0 border-t border-gray-200 p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2">
                {selected.status !== "read" && <button onClick={() => updateStatus("read")} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Mark Read</button>}
                {selected.status !== "responded" && <button onClick={() => updateStatus("responded")} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Mark Responded</button>}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <Button className="self-end min-h-[44px]" onClick={handleReply} disabled={!replyText.trim() || sending} loading={sending}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
