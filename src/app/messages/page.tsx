"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import { useRole } from "@/context/RoleContext";

interface User { id: string; name: string; avatar?: string; }
interface Conversation {
  id: string;
  subject: string | null;
  participants: { user: User }[];
  listing?: { id: string; title: string } | null;
  lastMessage?: string;
  lastMessageAt?: string;
  unread: number;
}

function avatarColor(name: string) {
  const colors = [
    "from-rose-400 to-rose-600",
    "from-amber-400 to-amber-600",
    "from-emerald-400 to-emerald-600",
    "from-sky-400 to-sky-600",
    "from-violet-400 to-violet-600",
    "from-orange-400 to-orange-600",
    "from-teal-400 to-teal-600",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <MessagesPage />
    </Suspense>
  );
}

function MessagesPage() {
  const { currentUser } = useRole();
  const searchParams = useSearchParams();
  const newListingId = searchParams.get("listing");
  const newAgentId = searchParams.get("agent");
  const directConvoId = searchParams.get("id");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [newConvo, setNewConvo] = useState<{ subject: string; recipientId: string; listingId: string } | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetch = () => {
      api.get<{ conversations: Conversation[] }>("/api/messages/conversations").then(r => {
        if (!isMounted) return;
        if (r.data?.conversations) {
          setConversations(prev => {
            const merged = [...prev];
            for (const c of r.data!.conversations) {
              const idx = merged.findIndex(x => x.id === c.id);
              if (idx === -1) merged.push(c);
              else merged[idx] = { ...merged[idx], ...c };
            }
            return merged.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
          });
        }
        setLoading(false);
      }).catch(() => { if (isMounted) setLoading(false); });
    };
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (directConvoId) {
      setSelectedId(directConvoId);
    }
  }, [directConvoId]);

  useEffect(() => {
    if (newListingId && newAgentId && newAgentId.trim() && newAgentId !== "undefined" && newAgentId !== "null") {
      setNewConvo({ subject: "", recipientId: newAgentId, listingId: newListingId });
    }
  }, [newListingId, newAgentId]);

  const handleSendNewConversation = async () => {
    if (!newConvo || !newMessage.trim()) return;
    try {
      const r = await api.post("/api/messages/conversations", {
        recipientId: newConvo.recipientId,
        listingId: newConvo.listingId || undefined,
        content: newMessage.trim(),
      });
      if (r.status === 201 || r.status === 200) {
        const conv = (r.data as any)?.conversation || (r.data as any);
        if (conv?.id) {
          setConversations(prev => {
            const exists = prev.find(c => c.id === conv.id);
            if (exists) return prev;
            return [{ ...conv, lastMessage: newMessage.trim(), lastMessageAt: new Date().toISOString(), unread: 0 }, ...prev];
          });
          setSelectedId(conv.id);
          setNewConvo(null);
          setNewMessage("");
        }
      }
    } catch {}
  };

  const selected = conversations.find((c) => c.id === selectedId);
  const filtered = query
    ? conversations.filter(c => {
        const other = c?.participants?.find(p => p.user.id !== currentUser?.id)?.user;
        const name = other?.name || "";
        const subj = c.subject || "";
        const lst = c.listing?.title || "";
        return [name, subj, lst].some(s => s.toLowerCase().includes(query.toLowerCase()));
      })
    : conversations;

  // Show conversation detail full-screen
  if (selectedId && selected) {
    return (
      <div className="flex-1 flex flex-col min-h-0 max-w-2xl mx-auto w-full">
        <ConversationDetail conversation={selected} onBack={() => setSelectedId(null)} currentUserId={currentUser?.id} />
      </div>
    );
  }

  // Show new conversation form full-screen
  if (newConvo) {
    return (
      <div className="flex-1 flex flex-col min-h-0 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-100 shrink-0">
          <button onClick={() => { setNewConvo(null); setNewMessage(""); }} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">New Conversation</p>
            <p className="text-[11px] text-gray-500">Start a new message thread</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md space-y-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your first message..."
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <Button className="w-full" onClick={handleSendNewConversation} disabled={!newMessage.trim()}>Send Message</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show inbox list
  return (
    <div className="flex-1 flex flex-col min-h-0 max-w-2xl mx-auto w-full">
      <div className="px-5 pt-5 pb-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Inbox</h1>
            <p className="text-xs text-gray-500 mt-0.5">{conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}</p>
          </div>
        </div>
        {conversations.length > 0 && (
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search messages…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:bg-white"
            />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-100" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {query ? "No matches" : "No messages yet"}
            </h3>
            <p className="text-xs text-gray-500 max-w-[220px] mx-auto">
              {query ? "Try a different name or subject." : "When you inquire about a property, the conversation shows up here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((conv) => {
              const other = conv?.participants?.find(p => p.user.id !== currentUser?.id)?.user || conv?.participants?.[0]?.user;
              const name = other?.name || conv?.listing?.title || conv?.subject || "New conversation";
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white`}>
                      {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    {conv.unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--color-primary)] border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm truncate ${conv.unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>{name}</span>
                      <span className={`text-[10px] shrink-0 ${conv.unread > 0 ? "text-[var(--color-primary)] font-semibold" : "text-gray-400"}`}>{timeAgo(conv.lastMessageAt)}</span>
                    </div>
                    {conv.subject && (
                      <p className="text-[11px] text-gray-500 truncate mb-0.5">{conv.subject}</p>
                    )}
                    <p className={`text-xs truncate ${conv.unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                      {conv.lastMessage || (conv.listing ? `Re: ${conv.listing.title}` : "No messages yet")}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationDetail({ conversation, onBack, currentUserId }: { conversation: Conversation; onBack: () => void; currentUserId?: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const other = conversation?.participants?.find(p => p.user.id !== currentUserId)?.user || conversation?.participants?.[0]?.user;
  const name = other?.name || "Unknown";

  useEffect(() => {
    setLoading(true);
    const fetch = () => {
      api.get<any>(`/api/messages/conversations/${conversation.id}/messages`).then(r => {
        if ((r.data as any)?.messages) setMessages((r.data as any).messages);
        setLoading(false);
      }).catch(() => setLoading(false));
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [conversation.id]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  }, [messages.length]);

  const handleSend = async () => {
    const txt = input.trim();
    if (!txt || sending) return;
    setSending(true);
    try {
      const r = await api.post(`/api/messages/conversations/${conversation.id}/messages`, { content: txt });
      if (r.data) {
        const newMsg = (r.data as any)?.message || { id: crypto.randomUUID(), content: txt, senderId: currentUserId, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm`}>
          {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-[11px] text-gray-500 truncate">
            {conversation.listing ? `About: ${conversation.listing.title}` : "General inquiry"}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 min-h-0 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-sm font-medium text-gray-900 mb-1">Say hello</p>
            <p className="text-xs text-gray-500 max-w-[260px]">Start the conversation. Your message will arrive instantly.</p>
          </div>
        ) : (
          <div className="space-y-2 max-w-2xl mx-auto">
            {messages.map((msg: any) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%]">
                    {!isMe && msg.sender?.name && (
                      <p className="text-[10px] text-gray-500 mb-0.5 px-1 font-medium">{msg.sender.name}</p>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-[var(--color-primary)] text-white rounded-2xl rounded-br-md"
                        : "bg-white border border-gray-100 text-gray-900 rounded-2xl rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-gray-400 mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}>{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-100 px-4 py-3 bg-white pb-20 lg:pb-3">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] placeholder:text-gray-400 max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0 w-11 h-11 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-[var(--color-primary)]/20"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
