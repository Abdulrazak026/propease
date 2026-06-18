"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface Conversation {
  id: string; phone: string; name: string | null; step: string;
  status: string; lastMessageAt: string;
  messages: { id: string; message: string; direction: string; fromBot: boolean; timestamp: string }[];
}

interface WaStatus { connected: boolean; needsQR: boolean; botRunning: boolean }

export default function SocialMediaPage() {
  const [tab, setTab] = useState<"dashboard" | "inbox">("dashboard");
  const [waStatus, setWaStatus] = useState<WaStatus>({ connected: false, needsQR: true, botRunning: true });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Conversation | null>(null);
  const [responseText, setResponseText] = useState("");
  const [reconnecting, setReconnecting] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [inboxFilter, setInboxFilter] = useState<"all" | "waiting" | "active">("all");
  const [inboxLoading, setInboxLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Poll WhatsApp status every 10s
  useEffect(() => {
    const poll = () => {
      api.get<WaStatus>("/api/whatsapp/status").then(r => {
        if (r.data) setWaStatus(r.data);
      }).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch QR when not connected
  useEffect(() => {
    if (!waStatus.connected && waStatus.needsQR) {
      fetch("/api/whatsapp/qr-svg").then(r => r.ok ? r.text() : "").then(svg => setQrSvg(svg)).catch(() => {});
    }
  }, [waStatus.connected, waStatus.needsQR]);

  // Fetch conversations
  const fetchConversations = () => {
    setInboxLoading(true);
    api.get<{ conversations: Conversation[] }>("/api/whatsapp/conversations").then(r => {
      if (r.data?.conversations) setConversations(r.data.conversations);
    }).catch(() => {}).finally(() => setInboxLoading(false));
  };

  // Select conversation
  const viewConversation = (phone: string) => {
    setSelectedConv(phone);
    api.get<{ conversation: Conversation }>(`/api/whatsapp/conversations/${phone}`).then(r => {
      if (r.data?.conversation) setChatHistory(r.data.conversation);
    }).catch(() => {});
  };

  // Send reply
  const sendReply = async () => {
    if (!responseText.trim() || !selectedConv) return;
    await api.post("/api/whatsapp/send", { phone: selectedConv, message: responseText.trim() });
    setResponseText("");
    setTimeout(() => viewConversation(selectedConv), 500);
  };

  // Reconnect
  const handleReconnect = async () => {
    setReconnecting(true);
    await api.post("/api/whatsapp/reconnect");
    setTimeout(() => {
      api.get<WaStatus>("/api/whatsapp/status").then(r => { if (r.data) setWaStatus(r.data); }).catch(() => {});
      setReconnecting(false);
    }, 15000);
  };

  // Filter conversations
  const waitingCount = conversations.filter(c => c.status === "waiting").length;
  const filteredConvs = inboxFilter === "waiting"
    ? conversations.filter(c => c.status === "waiting")
    : inboxFilter === "active"
    ? conversations.filter(c => c.status === "active")
    : conversations;

  // Real metrics from conversations
  const totalConvs = conversations.length;
  const activeConvs = conversations.filter(c => c.status === "active").length;

  const accounts = [
    { id: "instagram", name: "Instagram", handle: "@mbpproperties", bg: "bg-pink-50", fg: "text-pink-600", initials: "IG", connected: false },
    { id: "tiktok", name: "TikTok", handle: "@mbpproperties", bg: "bg-gray-900", fg: "text-white", initials: "TK", connected: false },
    { id: "facebook", name: "Facebook", handle: "MBPP Properties", bg: "bg-blue-50", fg: "text-blue-600", initials: "FB", connected: false },
    { id: "whatsapp", name: "WhatsApp", handle: "+234 707 422 2284", bg: "bg-emerald-50", fg: "text-emerald-600", initials: "WA", connected: waStatus.connected },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Social Media</h1>
            <p className="text-xs text-gray-500">{tab === "inbox" ? "WhatsApp Conversations" : "Dashboard · Post scheduler · Analytics"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setTab("dashboard")} className={`px-3 py-1 text-xs font-medium rounded-md ${tab === "dashboard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Dashboard</button>
            <button onClick={() => { setTab("inbox"); fetchConversations(); }} className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 ${tab === "inbox" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
              Inbox
              {waitingCount > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{waitingCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== INBOX TAB ==================== */}
      {tab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Conversation List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
            <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
              <input type="text" placeholder="Search..." className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
              <select value={inboxFilter} onChange={e => setInboxFilter(e.target.value as any)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none">
                <option value="all">All</option>
                <option value="waiting">Waiting</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div className="flex-1 overflow-y-auto">
              {inboxLoading ? <div className="p-8 text-center"><div className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto"/></div>
              : filteredConvs.length === 0 ? <div className="p-8 text-center text-xs text-gray-400">No conversations</div>
              : filteredConvs.map(c => (
                <button key={c.id} onClick={() => viewConversation(c.phone)} className={`w-full text-left px-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedConv === c.phone ? "bg-blue-50/50 border-l-2 border-l-blue-500" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name || c.phone}</p>
                    <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full ${c.status === "waiting" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{c.messages?.[0]?.message || c.phone}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : ""}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat View */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
            {!selectedConv ? (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.525C3.373 3.748 2.25 5.14 2.25 6.741v6.018z"/></svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">Select a conversation</p>
                  <p className="text-xs text-gray-400 mt-1">Click any conversation on the left to view chat history and respond.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{chatHistory?.name || selectedConv}</p>
                    <p className="text-[11px] text-gray-400">{selectedConv}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { api.patch(`/api/whatsapp/conversations/${selectedConv}/status`, { status: "active" }); }} className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded">Mark Active</button>
                    <button onClick={() => setSelectedConv(null)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>

                {/* Chat messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                  {chatHistory?.messages?.map((m, i) => (
                    <div key={m.id || i} className={`flex ${m.direction === "outgoing" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.direction === "outgoing" ? "bg-[var(--color-primary)] text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                        {m.fromBot && <p className="text-[10px] opacity-70 mb-1">🤖 MBPP Bot</p>}
                        <p className="whitespace-pre-wrap">{m.message}</p>
                        <p className={`text-[10px] mt-1 ${m.direction === "outgoing" ? "text-white/60" : "text-gray-400"}`}>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  )) || <p className="text-center text-xs text-gray-400 py-8">No messages yet.</p>}
                </div>

                {/* Reply input */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2">
                  <input type="text" value={responseText} onChange={e => setResponseText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendReply(); }} placeholder="Type your reply..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                  <button onClick={sendReply} disabled={!responseText.trim()} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40">Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================== DASHBOARD TAB ==================== */}
      {tab === "dashboard" && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Conversations", value: totalConvs, change: "WhatsApp" },
              { label: "Active Now", value: activeConvs, change: "Conversations" },
              { label: "Waiting for Reply", value: waitingCount, change: waitingCount > 0 ? "Needs attention" : "All caught up" },
              { label: "Bot Status", value: waStatus.connected ? "Online" : "Offline", change: waStatus.connected ? "Connected" : "Needs QR scan" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
                <p className="text-[11px] text-gray-400 mt-1">{m.change}</p>
              </div>
            ))}
          </div>

          {/* Accounts + QR Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accounts.map(a => {
              const isCon = a.connected;
              const badgeText = a.id === "whatsapp" ? (waStatus.connected ? "Active" : "Not Linked") : "Coming soon";
              const badgeColor = isCon ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500";
              return (
                <div key={a.id} className={`bg-white rounded-xl border ${a.id === "whatsapp" ? "border-emerald-200" : "border-gray-200"} p-4 hover:shadow-sm transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${a.bg} ${a.fg} font-bold text-sm`}>{a.initials}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${badgeColor}`}>{badgeText}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{a.handle}</p>
                  <button onClick={() => { if (a.id === "whatsapp") { setShowQR(!showQR); if (!waStatus.connected && !reconnecting) handleReconnect(); } }} className="w-full py-1.5 text-xs font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors">
                    {a.id === "whatsapp" ? (waStatus.connected ? "Settings" : "Connect WhatsApp") : "Connect"}
                  </button>
                  {a.id === "whatsapp" && showQR && !waStatus.connected && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col items-center">
                      <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                      <p className="text-[10px] text-gray-400 mt-2">Scan to connect · Auto-refreshes</p>
                      <button onClick={handleReconnect} disabled={reconnecting} className="mt-2 w-full py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 disabled:opacity-50">
                        {reconnecting ? "Reconnecting..." : "Reconnect"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Post Composer */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Compose Post</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <textarea placeholder="Write a post... Share a new listing, market tip, or property update." rows={4} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none" />
              <div className="flex items-center justify-between mt-3">
                <label className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 012.671-.142l3.188 2.126a2.25 2.25 0 002.75-.246l4.732-4.732M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Photo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
                <button className="px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
                  Post Now
                </button>
              </div>
            </div>
          </div>

          {/* Info message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
            <div>
              <p className="text-sm text-gray-700 font-medium">WhatsApp Bot is {waStatus.connected ? "active" : "disconnected"}</p>
              <p className="text-xs text-gray-500 mt-1">{waStatus.connected ? "The bot is handling conversations automatically. Messages appear in the Inbox tab." : "Scan the QR code above to connect your WhatsApp. Once connected, the bot will handle conversations."}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
