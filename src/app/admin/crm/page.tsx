"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { useRole } from "@/context/RoleContext";

interface Inquiry {
  id: string; clientName: string; clientContact: string; message: string;
  status: string; createdAt: string; listingId?: string;
  listing?: { id: string; title: string } | null;
  assignedAgent?: { id: string; name: string } | null;
}
interface Conversation {
  id: string; messages: { id: string; content: string; senderId: string; sender?: { id: string; name: string }; createdAt: string }[];
  participants: { user: { id: string; name: string } }[];
}

export default function CrmPage() {
  const { currentUser } = useRole();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loadingConv, setLoadingConv] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchInquiries = () => {
    api.get<{ inquiries: Inquiry[] }>("/api/inquiries/all").then(r => {
      if (r.data?.inquiries) setInquiries(r.data.inquiries);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 15000);
    return () => clearInterval(interval);
  }, []);

  // Poll selected conversation every 10 seconds
  useEffect(() => {
    if (!selected) return;
    const poll = () => {
      api.get<{ conversation: Conversation | null }>(`/api/inquiries/${selected.id}/conversation`).then(r => {
        if (r.data?.conversation) setConversation(r.data.conversation);
      }).catch(() => {});
    };
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [selected?.id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [conversation?.messages?.length]);

  const openInquiry = async (i: Inquiry) => {
    setSelected(i);
    setLoadingConv(true);
    setConversation(null);
    try {
      const r = await api.get<{ inquiry: Inquiry; conversation: Conversation | null }>(`/api/inquiries/${i.id}/conversation`);
      if (r.data?.conversation) {
        setConversation(r.data.conversation);
      } else {
        // If no conversation exists, show the inquiry message as the first message
        setConversation({
          id: "",
          messages: [{
            id: i.id,
            content: i.message,
            senderId: "client",
            createdAt: i.createdAt,
          }],
          participants: [],
        });
      }
    } catch {
      setConversation({ id: "", messages: [{ id: i.id, content: i.message, senderId: "client", createdAt: i.createdAt }], participants: [] });
    }
    setLoadingConv(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/api/inquiries/${id}/status`, { status });
    fetchInquiries();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSendingReply(true);
    const r = await api.post(`/api/inquiries/${selected.id}/reply`, { message: replyText.trim() });
    setSendingReply(false);
    if (r.status === 200) {
      setReplyText("");
      // Refresh conversation
      try {
        const cr = await api.get<{ conversation: Conversation | null }>(`/api/inquiries/${selected.id}/conversation`);
        if (cr.data?.conversation) setConversation(cr.data.conversation);
      } catch {}
      updateStatus(selected.id, "responded");
    }
  };

  const filtered = inquiries.filter((l) => {
    const m = l.clientName.toLowerCase().includes(search.toLowerCase()) || l.clientContact.includes(search);
    const s = filterStatus === "all" || l.status === filterStatus.toLowerCase().replace(/\s/g, "_");
    return m && s;
  });

  const stages = ["New", "Read", "Responded"].map((s) => ({
    stage: s,
    count: inquiries.filter((i) => i.status === s.toLowerCase().replace(/\s/g, "_")).length,
  }));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Inquiries</h1><p className="text-xs text-gray-500">Track client inquiries and respond</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline</h3>
        <div className="flex gap-2 overflow-x-auto">
          {stages.map((s) => (
            <button key={s.stage} onClick={() => setFilterStatus(s.stage.toLowerCase())} className={`flex-1 min-w-[80px] p-3 rounded-lg text-center border transition-colors ${filterStatus === s.stage.toLowerCase() ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
              <div className="text-2xl font-bold text-gray-900">{s.count}</div>
              <div className="text-[11px] text-gray-500 mt-1">{s.stage}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inquiry List */}
        <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${selected ? "hidden lg:block" : ""}`}>
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value="all">All</option>
              {stages.map((s) => <option key={s.stage} value={s.stage.toLowerCase()}>{s.stage}</option>)}
            </select>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filtered.map((l) => (
              <button key={l.id} onClick={() => openInquiry(l)} className={`w-full text-left px-4 py-3 hover:bg-gray-50/50 transition-colors ${selected?.id === l.id ? "bg-emerald-50/50 border-l-2 border-emerald-500" : ""} ${l.status === "new" ? "bg-amber-50/30" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-900">{l.clientName}</span>
                  <Badge variant={l.status === "new" ? "warning" : l.status === "responded" ? "success" : "default"}>{l.status}</Badge>
                </div>
                <p className="text-[10px] text-gray-500 mb-1">{l.clientContact}</p>
                {l.listing && <p className="text-[10px] text-gray-500 mb-1 truncate">Re: {l.listing.title}</p>}
                {l.assignedAgent && <p className="text-[10px] text-emerald-600">Agent: {l.assignedAgent.name}</p>}
                <p className="text-xs text-gray-600 line-clamp-1 mt-1">{l.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(l.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
            {filtered.length === 0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">No inquiries found</div>}
          </div>
        </div>

        {/* Conversation Detail */}
        {selected && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelected(null); setConversation(null); }} className="lg:hidden text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{selected.clientName}</h3>
                    <Badge variant={selected.status === "new" ? "warning" : selected.status === "responded" ? "success" : "default"}>{selected.status}</Badge>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {selected.clientContact}
                    {selected.listing ? ` · ${selected.listing.title}` : ""}
                    {selected.assignedAgent ? ` · Agent: ${selected.assignedAgent.name}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {selected.status === "new" && <Button size="sm" variant="ghost" onClick={() => updateStatus(selected.id, "read")}>Mark Read</Button>}
                <Button size="sm" variant={selected.status === "responded" ? "ghost" : "primary"} onClick={() => updateStatus(selected.id, "responded")}>Mark Responded</Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loadingConv ? (
                <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
              ) : conversation?.messages?.length ? (
                conversation.messages.map(msg => {
                  const isCustomer = msg.senderId !== currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
                      <div className="max-w-[80%]">
                        <p className="text-[10px] text-gray-400 mb-0.5 px-1">{msg.sender?.name || "Unknown"}</p>
                        <div className={`px-3 py-2 rounded-xl text-sm ${isCustomer ? "bg-white border border-gray-200 text-gray-900 rounded-bl-sm" : "bg-[var(--color-primary)] text-white rounded-br-sm"}`}>
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 px-1">{new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-sm text-gray-500 mb-2">No conversation found</p>
                  <p className="text-xs text-gray-400 mb-1">{selected.message}</p>
                  <p className="text-[10px] text-gray-400">Contact: {selected.clientContact}</p>
                </div>
              )}
            </div>

            {/* Reply */}
            <div className="shrink-0 border-t border-gray-100 p-3 bg-white">
              <p className="text-[10px] text-gray-400 mb-2">Reply to {selected.clientName} via email</p>
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <Button onClick={sendReply} disabled={!replyText.trim() || sendingReply} className="self-end">
                  {sendingReply ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
