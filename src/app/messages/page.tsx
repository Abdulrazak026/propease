"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api-client";

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

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchConversations = () => {
    api.get<{ conversations: Conversation[] }>("/api/messages/conversations").then(r => {
      if (r.data?.conversations) setConversations(r.data.conversations);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchConversations(); }, []);

  const selected = conversations.find((c) => c.id === selectedId);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* List */}
        <div className={`w-full lg:w-80 xl:w-96 border-r border-gray-200 bg-white flex flex-col ${selectedId ? "hidden lg:flex" : "flex"}`}>
          <div className="px-5 py-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            <p className="text-xs text-gray-500 mt-0.5">{conversations.length} conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-16 px-4">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No messages</h3>
                <p className="text-xs text-gray-500">Inquire about a property to start a conversation</p>
              </div>
            ) : (
              <div>
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 ${
                      selectedId === conv.id ? "bg-[var(--color-primary)]/5 border-l-2 border-[var(--color-primary)]" : "border-l-2 border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">
                      {conv.participants[0]?.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 truncate">{conv.participants[0]?.user.name}</span>
                        {conv.unread > 0 && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />}
                      </div>
                      {conv.subject && <p className="text-xs text-gray-500 truncate">{conv.subject}</p>}
                      {conv.lastMessage && <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-400">{conv.lastMessageAt ? formatDate(conv.lastMessageAt) : ""}</p>
                      {conv.unread > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full px-1 mt-1">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail / Placeholder */}
        <div className={`flex-1 flex flex-col bg-gray-50 min-h-0 ${!selectedId ? "hidden lg:flex" : "flex"}`}>
          {selected ? (
            <ConversationDetail conversation={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Select a conversation</h3>
                <p className="text-xs text-gray-500">Choose a conversation from the left to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationDetail({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>(`/api/messages/conversations/${conversation.id}`).then(r => {
      if ((r.data as any)?.messages) setMessages((r.data as any).messages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [conversation.id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const r = await api.post(`/api/messages/conversations/${conversation.id}`, { content: input.trim() });
      if (r.data) {
        const newMsg = (r.data as any).message || { id: crypto.randomUUID(), content: input.trim(), senderId: "me", createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, newMsg]);
      }
    } catch {}
    setInput("");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200 shrink-0">
        <button onClick={onBack} className="lg:hidden text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
          {conversation.participants[0]?.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{conversation.participants[0]?.user.name}</p>
          <p className="text-[11px] text-gray-400">
            {conversation.listing ? `Re: ${conversation.listing.title}` : "General inquiry"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
        {loading ? <p className="text-xs text-gray-400 text-center">Loading...</p> :
          messages.map((msg: any) => {
            const isMe = msg.senderId !== conversation.participants[0]?.user.id;
            return (
          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%]`}>
              <div className={`px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                isMe ? "bg-[var(--color-primary)] text-white rounded-br-md" : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
              }`}>
                {msg.content}
              </div>
              <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>{formatDate(msg.createdAt)}</p>
            </div>
          </div>
          );
          })}
      </div>

      <div className="shrink-0 border-t border-gray-200 px-5 py-3 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
