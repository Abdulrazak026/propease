"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface Conversation {
  id: string; phone: string; name: string | null; step: string;
  status: string; messages: { id: string; message: string; direction: string; fromBot: boolean; timestamp: string }[];
}

const METRICS = [
  { label: "Total Posts", value: "32", change: "+8 this month" },
  { label: "Total Reach", value: "12.4K", change: "+23% vs last month" },
  { label: "Engagement", value: "843", change: "+12% this week" },
  { label: "Leads from Social", value: "17", change: "5 new this week" },
];

export default function SocialMediaPage() {
  const [tab, setTab] = useState<"dashboard" | "inbox">("dashboard");
  const [showKeys, setShowKeys] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");

  // WhatsApp real status
  const [waStatus, setWaStatus] = useState({ connected: false, needsQR: true });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Conversation | null>(null);
  const [responseText, setResponseText] = useState("");
  const [inboxLoading, setInboxLoading] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>("");

  useEffect(() => {
    api.get<any>("/api/whatsapp/status").then(r => { if (r.data) setWaStatus(r.data); }).catch(() => {});
    // Poll status every 10 seconds
    const interval = setInterval(() => {
      api.get<any>("/api/whatsapp/status").then(r => {
        if (r.data) setWaStatus(r.data);
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch QR when not connected
  useEffect(() => {
    if (!waStatus.connected) {
      fetch("/api/whatsapp/qr-svg").then(r => {
        if (r.ok) return r.text();
        return "";
      }).then(svg => setQrSvg(svg)).catch(() => {});
    }
  }, [waStatus.connected]);

  const handleReconnect = async () => {
    setReconnecting(true);
    await api.post("/api/whatsapp/reconnect");
    setTimeout(() => {
      api.get<any>("/api/whatsapp/status").then(r => { if (r.data) setWaStatus(r.data); }).catch(() => {});
      setReconnecting(false);
    }, 15000);
  };

  const fetchConversations = () => {
    setInboxLoading(true);
    api.get<{ conversations: Conversation[] }>("/api/whatsapp/conversations").then(r => {
      if (r.data?.conversations) setConversations(r.data.conversations);
    }).catch(() => {}).finally(() => setInboxLoading(false));
  };

  const viewConversation = async (phone: string) => {
    setSelectedConv(phone);
    const r = await api.get<{ conversation: Conversation }>(`/api/whatsapp/conversations/${phone}`);
    if (r.data?.conversation) setChatHistory(r.data.conversation);
  };

  const sendReply = async () => {
    if (!responseText.trim() || !selectedConv) return;
    await api.post("/api/whatsapp/send", { phone: selectedConv, message: responseText.trim() });
    setResponseText("");
    viewConversation(selectedConv);
  };

  const waConnected = waStatus.connected || !waStatus.needsQR;
  const waConvs = conversations.filter(c => c.status === "waiting").length;

  const accounts = [
    { id: "instagram", name: "Instagram", handle: "@mbpproperties", bg: "bg-pink-50", fg: "text-pink-600", initials: "IG", connected: false },
    { id: "tiktok", name: "TikTok", handle: "@mbpproperties", bg: "bg-gray-50", fg: "text-gray-700", initials: "TK", connected: false },
    { id: "facebook", name: "Facebook", handle: "MBPP Properties", bg: "bg-blue-50", fg: "text-blue-600", initials: "FB", connected: false },
    { id: "whatsapp", name: "WhatsApp", handle: "+234 707 422 2284", bg: "bg-emerald-50", fg: "text-emerald-600", initials: "WA", connected: waConnected },
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
            <p className="text-xs text-gray-500">{tab === "inbox" ? "WhatsApp Conversations" : "Dashboard · Post scheduler"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setTab("dashboard")} className={`px-3 py-1 text-xs font-medium rounded-md ${tab === "dashboard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Dashboard</button>
            <button onClick={() => { setTab("inbox"); fetchConversations(); }} className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 ${tab === "inbox" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
              Inbox {waConvs > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{waConvs}</span>}
            </button>
          </div>
          <Link href="/admin/settings" className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">API Settings</Link>
        </div>
      </div>

      {/* INBOX TAB */}
      {tab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-700">Conversations ({conversations.length})</p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {inboxLoading ? <div className="p-8 text-center text-xs text-gray-400">Loading...</div>
              : conversations.length === 0 ? <div className="p-8 text-center text-xs text-gray-400">No conversations yet</div>
              : conversations.map(c => (
                <button key={c.id} onClick={() => viewConversation(c.phone)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${selectedConv === c.phone ? "bg-blue-50/50 border-l-2 border-blue-500" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name || c.phone}</p>
                    {c.status === "waiting" && <span className="shrink-0 w-2 h-2 rounded-full bg-amber-500" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{c.messages?.[0]?.message || "No messages"}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{c.status === "waiting" ? "⏳ Waiting" : "💬 Active"}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col" style={{ minHeight: "600px" }}>
            {!selectedConv ? (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.525C3.373 3.748 2.25 5.14 2.25 6.741v6.018z"/></svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">Select a conversation</p>
                  <p className="text-xs text-gray-400 mt-1">Click on the left to view chat history.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div><p className="text-sm font-semibold text-gray-900">{chatHistory?.name || selectedConv}</p><p className="text-[11px] text-gray-400">{selectedConv}</p></div>
                  <button onClick={() => setSelectedConv(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                  {chatHistory?.messages?.length ? chatHistory.messages.map((m, i) => (
                    <div key={m.id || i} className={`flex ${m.direction === "outgoing" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.direction === "outgoing" ? "bg-[var(--color-primary)] text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                        <p>{m.message}</p>
                        <p className={`text-[10px] mt-1 ${m.direction === "outgoing" ? "text-white/60" : "text-gray-400"}`}>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{m.fromBot ? " · bot" : ""}</p>
                      </div>
                    </div>
                  )) : <p className="text-center text-xs text-gray-400 py-8">No messages yet.</p>}
                </div>
                <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2">
                  <input type="text" value={responseText} onChange={e => setResponseText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendReply(); }} placeholder="Type your reply..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                  <button onClick={sendReply} disabled={!responseText.trim()} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40">Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* DASHBOARD TAB */}
      {tab === "dashboard" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {METRICS.map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
                <p className="text-[11px] text-emerald-600 mt-1">{m.change}</p>
              </div>
            ))}
          </div>

          {/* Connected Accounts */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Connected Accounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {accounts.map(a => {
                const isCon = a.id === "whatsapp" ? waConnected : a.connected;
                const badge = a.id === "whatsapp" ? (waStatus.connected ? "Connected" : waStatus.botRunning ? "Not Linked" : "Offline") : (a.connected ? "Active" : "Disconnected");
                const badgeColor = isCon ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500";
                return (
                  <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${a.bg} ${a.fg} font-bold text-lg`}>{a.initials}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${badgeColor}`}>{badge}</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-400 mb-3">{a.handle}</p>
                    <div className="flex items-end justify-between">
                      <div><p className="text-lg font-extrabold text-gray-900">{isCon ? "Active" : "—"}</p><p className="text-[10px] text-gray-400">{isCon ? "Online" : "Connect to start"}</p></div>
                      <button onClick={() => setShowKeys(showKeys === a.id ? null : a.id)} className="px-3 py-1 text-[11px] font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/5">{isCon ? "Settings" : "Connect"}</button>
                    </div>
                    {showKeys === a.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        {a.id === "whatsapp" ? (
                          <div className="text-xs text-gray-500 space-y-3">
                            <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${waStatus.connected ? "bg-emerald-50" : "bg-amber-50"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${waStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                              <span>{waStatus.connected ? "Connected · Bot active 24/7" : "Disconnected · Scan QR below"}</span>
                            </div>
                            {!waStatus.connected && qrSvg && (
                              <div className="flex flex-col items-center py-2">
                                <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                                <p className="text-[10px] text-gray-400 mt-1">WhatsApp → Settings → Linked Devices → Scan</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              {!waStatus.connected && (
                                <button
                                  onClick={handleReconnect}
                                  disabled={reconnecting}
                                  className="flex-1 py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                  {reconnecting ? "Reconnecting..." : "Reconnect"}
                                </button>
                              )}
                              <a href="/api/whatsapp/qr" target="_blank" rel="noopener" className="flex-1 py-1.5 text-xs font-medium text-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                                Open QR Fullscreen
                              </a>
                            </div>
                            <p className="text-gray-400">Conversations appear in the Inbox tab.</p>
                          </div>
                        ) : (
                          <>
                            <input type="text" placeholder="Access Token / API Key" className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                            <button className="w-full py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90">Connect {a.name}</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Post Composer */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Compose Post</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="Write a post... Share a new listing, market tip, or property update." rows={4} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none" />
              <div className="flex items-center justify-between mt-3">
                <label className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 012.671-.142l3.188 2.126a2.25 2.25 0 002.75-.246l4.732-4.732M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Photo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
                <button disabled={!postContent.trim()} className="px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg> Post Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
