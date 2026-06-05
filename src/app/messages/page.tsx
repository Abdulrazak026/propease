"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

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

const MOCK_CONVOS: Conversation[] = [
  { id: "c1", subject: "Inquiry about No. 15 Kabo Road", participants: [{ user: { id: "u2", name: "Aisha Abubakar" } }], listing: { id: "l2", title: "No. 15 Kabo Road" }, lastMessage: "Is this property still available?", lastMessageAt: new Date(Date.now() - 1800000).toISOString(), unread: 2 },
  { id: "c2", subject: "Tenancy agreement for No. 42 Ibrahim Taiwo Road", participants: [{ user: { id: "u1", name: "Dr. Amina Yusuf" } }], listing: { id: "l1", title: "No. 42 Ibrahim Taiwo Road" }, lastMessage: "I've reviewed the agreement terms.", lastMessageAt: new Date(Date.now() - 86400000).toISOString(), unread: 0 },
  { id: "c3", subject: "Partnership inquiry", participants: [{ user: { id: "u4", name: "Fatima Bello" } }], listing: null, lastMessage: "We'd like to partner with MBPP.", lastMessageAt: new Date(Date.now() - 172800000).toISOString(), unread: 0 },
];

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>(MOCK_CONVOS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = conversations.find((c) => c.id === selectedId);

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
  const [messages, setMessages] = useState<{ id: string; content: string; isMe: boolean; time: string }[]>([
    { id: "m1", content: "Hello, is this property still available?", isMe: true, time: "10:30 AM" },
    { id: "m2", content: "Yes, it's still available! Would you like to schedule a viewing?", isMe: false, time: "10:45 AM" },
    { id: "m3", content: "Great! I'd love to see it this weekend.", isMe: true, time: "11:00 AM" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), content: input.trim(), isMe: true, time: "Now" }]);
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
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${msg.isMe ? "order-1" : "order-1"}`}>
              <div className={`px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                msg.isMe ? "bg-[var(--color-primary)] text-white rounded-br-md" : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
              }`}>
                {msg.content}
              </div>
              <p className={`text-[10px] text-gray-400 mt-1 ${msg.isMe ? "text-right" : "text-left"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
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
