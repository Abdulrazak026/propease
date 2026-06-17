"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

const METRICS = [
  { label: "Total Posts", value: "32", change: "+8 this month", trend: "up" },
  { label: "Total Reach", value: "12.4K", change: "+23% vs last month", trend: "up" },
  { label: "Engagement", value: "843", change: "+12% this week", trend: "up" },
  { label: "Leads from Social", value: "17", change: "5 new this week", trend: "up" },
];

const ACCOUNTS = [
  { id: "instagram", name: "Instagram", handle: "@mbpproperties", followers: "—", change: "Connect to see data", connected: false, color: "from-pink-500 to-rose-500", bg: "bg-pink-50", fg: "text-pink-600" },
  { id: "tiktok", name: "TikTok", handle: "@mbpproperties", followers: "—", change: "Connect to see data", connected: false, color: "from-gray-900 to-gray-700", bg: "bg-gray-50", fg: "text-gray-700" },
  { id: "facebook", name: "Facebook", handle: "MBPP Properties", followers: "—", change: "Connect to see data", connected: false, color: "from-blue-600 to-blue-500", bg: "bg-blue-50", fg: "text-blue-600" },
  { id: "whatsapp", name: "WhatsApp", handle: "+234 707 422 2284", followers: "Active", change: "Connected via bot", connected: true, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50", fg: "text-emerald-600" },
];

const RECENT_ACTIVITY = [
  { platform: "WhatsApp", type: "Auto-reply", content: "Bot replied to 12 client inquiries about property listings", time: "Today, 2:30 PM", icon: "💬" },
  { platform: "WhatsApp", type: "Alert", content: "Sent listing alert to 6 subscribers for: 3 Bedroom Bungalow in Barnawa", time: "Today, 10:15 AM", icon: "💬" },
  { platform: "WhatsApp", type: "Message", content: "Bot processed 3 viewing schedule requests", time: "Yesterday, 4:45 PM", icon: "💬" },
  { platform: "WhatsApp", type: "Inquiry", content: "New client inquiry: 'Show me 2-bedroom flats in Kano under 5M'", time: "Yesterday, 11:20 AM", icon: "💬" },
  { platform: "WhatsApp", type: "Alert", content: "Daily digest sent to 18 saved search subscribers", time: "Jun 16, 8:00 AM", icon: "💬" },
];

const POSTING_CHANNELS = [
  { id: "whatsapp", label: "WhatsApp Bot", desc: "Auto-replies & listing alerts", connected: true, syncMode: "immediate" as const },
  { id: "instagram", label: "Instagram", desc: "Post listings to feed & stories", connected: false, syncMode: "manual" as const },
  { id: "tiktok", label: "TikTok", desc: "Share property walkthroughs", connected: false, syncMode: "manual" as const },
  { id: "facebook", label: "Facebook", desc: "Auto-share to business page", connected: false, syncMode: "manual" as const },
];

export default function SocialMediaPage() {
  const [postContent, setPostContent] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["whatsapp"]);
  const [showKeys, setShowKeys] = useState<string | null>(null);

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Social Media</h1>
            <p className="text-xs text-gray-500">Dashboard · Post scheduler · Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/settings" className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            API Settings
          </Link>
          <button className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Post
          </button>
        </div>
      </div>

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
          {ACCOUNTS.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${a.bg} ${a.fg} font-bold text-lg`}>
                  {a.id === "instagram" ? "IG" : a.id === "tiktok" ? "TK" : a.id === "facebook" ? "FB" : "WA"}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${a.connected ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {a.connected ? "Active" : "Disconnected"}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
              <p className="text-xs text-gray-400 mb-3">{a.handle}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-extrabold text-gray-900">{a.followers}</p>
                  <p className="text-[10px] text-gray-400">{a.change}</p>
                </div>
                <button
                  onClick={() => setShowKeys(showKeys === a.id ? null : a.id)}
                  className="px-3 py-1 text-[11px] font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors"
                >
                  {a.connected ? "Settings" : "Connect"}
                </button>
              </div>
              {showKeys === a.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {a.id === "whatsapp" ? (
                    <div className="text-xs text-gray-500 space-y-2">
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-50 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Bot running via Baileys · 24/7</span>
                      </div>
                      <p className="text-gray-400">Connection managed automatically. QR scan needed after server restart.</p>
                    </div>
                  ) : (
                    <>
                      <input type="text" placeholder="Access Token / API Key" className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                      <button className="w-full py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 transition-opacity">Connect {a.name}</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Post Sync Configuration */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Post Sync Settings</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {POSTING_CHANNELS.map(ch => (
              <div key={ch.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ch.connected ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ch.label}</p>
                    <p className="text-[11px] text-gray-400">{ch.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    ch.syncMode === "immediate" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {ch.syncMode === "immediate" ? "Live Sync" : "After Connect"}
                  </span>
                  {ch.connected && (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={selectedChannels.includes(ch.id)} onChange={() => toggleChannel(ch.id)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              <strong>Sync modes:</strong> <span className="text-emerald-600 font-medium">Live Sync</span> = posts go out immediately across all enabled channels.
              <span className="text-amber-600 font-medium ml-2">After Connect</span> = will sync once API keys are provided.
              WhatsApp auto-syncs listing alerts through the bot.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map((act, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-lg shrink-0">{act.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-900">{act.platform}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-100 text-gray-500">{act.type}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{act.content}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{act.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Composer */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Compose Post</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-gray-500">Posting to:</p>
            {POSTING_CHANNELS.map(ch => (
              selectedChannels.includes(ch.id) && (
                <span key={ch.id} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {ch.label}
                </span>
              )
            ))}
          </div>
          <textarea
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            placeholder="Write a post... Share a new listing, market tip, or property update. Posts sync immediately to all enabled channels."
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 012.671-.142l3.188 2.126a2.25 2.25 0 002.75-.246l4.732-4.732M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Photo
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            <button
              disabled={!postContent.trim()}
              className="px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Post Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
