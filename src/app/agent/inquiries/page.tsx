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
  const [myId, setMyId] = useState<string>("");

  useEffect(() => {
    api.get<{ inquiries: Inquiry[] }>("/api/inquiries/my").then(r => {
      if (r.data?.inquiries) setInquiries(r.data.inquiries);
      setLoading(false);
    }).catch(() => setLoading(false));
    api.get<any>("/api/auth/me").then(r => {
      if (r.data?.user?.id) setMyId(r.data.user.id);
    }).catch(() => {});
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

  const isMyMessage = (msg: Message) => msg.senderId === "me" || (myId && msg.senderId === myId);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  if (selected) {
    return (
      <div className="min-h-[80vh] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-[var(--color-primary)] p-1"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-gray-900">{selected.clientName}</h1>
            <p className="text-xs text-gray-500">{selected.clientContact} — {selected.listing?.title || ""}</p>
          </div>
          <Badge variant={selected.status === "new" ? "warning" : selected.status === "responded" ? "success" : "default"}>{selected.status}</Badge>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold">{selected.clientName?.charAt(0) || "C"}</div>
              <span className="text-xs font-semibold text-amber-700">{selected.clientName} — Client</span>
              <span className="text-xs text-amber-500">{new Date(selected.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{selected.message}</p>
          </div>

          {loadingConv ? (
            <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
          ) : conversation.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-400">No replies yet. Type below to respond.</div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center">— Conversation —</p>
              {conversation.map(msg => {
                const mine = isMyMessage(msg);
                const senderName = mine ? "You" : (msg.sender?.name || selected.clientName);
                return (
                  <div key={msg.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                    <span className={`text-xs font-medium mb-1 px-1 ${mine ? "text-[var(--color-primary)]" : "text-amber-600"}`}>{senderName}</span>
                    <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${mine ? "bg-[var(--color-primary)] text-white rounded-br-md" : "bg-amber-50 border border-amber-200 text-gray-900 rounded-bl-md"}`}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3 bg-white">
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
    );
  }

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
    </div>
  );
}
