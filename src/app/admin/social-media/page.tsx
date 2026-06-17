"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

const ACCOUNTS = [
  { id: "instagram", name: "Instagram", handle: "@mbpproperties", icon: "📷", connected: false },
  { id: "tiktok", name: "TikTok", handle: "@mbpproperties", icon: "🎵", connected: false },
  { id: "facebook", name: "Facebook", handle: "MBPP Properties", icon: "📘", connected: false },
  { id: "whatsapp", name: "WhatsApp", handle: "+234 707 422 2284", icon: "💬", connected: true },
];

const POSTS = [
  { platform: "WhatsApp", time: "via bot", content: "Automated property listing alerts and client inquiries handled 24/7 through WhatsApp Business.", status: "Active" as const },
  { platform: "Instagram", time: "Coming soon", content: "Connect your Instagram account to auto-post new property listings and share stories.", status: "Setup" as const },
  { platform: "TikTok", time: "Coming soon", content: "Share property walkthrough videos and market tips. Connect to start posting.", status: "Setup" as const },
  { platform: "Facebook", time: "Coming soon", content: "Auto-share listings to your Facebook page and engage with the community.", status: "Setup" as const },
];

export default function SocialMediaPage() {
  const [showKeys, setShowKeys] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Social Media</h1>
          <p className="text-xs text-gray-500">Manage connected accounts and social presence</p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Connected Accounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACCOUNTS.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{a.icon}</span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${a.connected ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {a.connected ? "Active" : "Not linked"}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.handle}</p>
              <button
                onClick={() => setShowKeys(showKeys === a.id ? null : a.id)}
                className="mt-3 w-full py-1.5 text-xs font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors"
              >
                {showKeys === a.id ? "Hide Settings" : "Manage"}
              </button>
              {showKeys === a.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {a.id !== "whatsapp" ? (
                    <>
                      <input type="text" placeholder="API Key / Access Token" className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                      <button className="w-full py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 transition-opacity">Connect</button>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">WhatsApp is connected via the Baileys bot. Manage in your account settings.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content & Posts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Social Channels Overview</h2>
        <div className="space-y-3">
          {POSTS.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg shrink-0">
                    {p.platform === "WhatsApp" ? "💬" : p.platform === "Instagram" ? "📷" : p.platform === "TikTok" ? "🎵" : "📘"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.platform}</p>
                    <p className="text-xs text-gray-400">{p.time}</p>
                  </div>
                </div>
                <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                  p.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>{p.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{p.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Post Scheduler */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Post</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <textarea
            placeholder="Write a post to share on your connected social channels..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {ACCOUNTS.filter(a => a.connected).map(a => (
                <span key={a.id} className="text-lg" title={a.name}>{a.icon}</span>
              ))}
              {ACCOUNTS.filter(a => a.connected).length === 0 && (
                <span className="text-xs text-gray-400">Connect an account to start posting</span>
              )}
            </div>
            <button className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Post Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
