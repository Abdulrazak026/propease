"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "saved_search_match", title: "New match found", body: "2 new properties match your '2-bedroom flat in Tarauni' search", link: "/saved", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "n2", type: "review_response", title: "Review response received", body: "Agent Aisha responded to your review on No. 15 Kabo Road", link: "/listings/l2", read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "n3", type: "agreement_signed", title: "Agreement signed", body: "Tenant signed the tenancy agreement for No. 42 Ibrahim Taiwo Road", link: "/agreements/a1", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "n4", type: "application_status", title: "Application approved", body: "Your rental application for No. 7B Zoo Road has been approved", link: "/agent/applications", read: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "n5", type: "price_change", title: "Price reduced", body: "No. 10 Bello Road dropped from ₦2.2M to ₦1.8M", link: "/listings/l4", read: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: "n6", type: "message_received", title: "New message", body: "You have a new message from Dr. Amina about No. 15 Kabo Road", link: "/messages", read: false, createdAt: new Date(Date.now() - 432000000).toISOString() },
];

const TYPE_ICONS: Record<string, string> = {
  saved_search_match: "🔍", review_response: "⭐", agreement_signed: "📝",
  application_status: "📋", price_change: "💰", message_received: "💬",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                All
              </button>
              <button onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "unread" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Unread
              </button>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[var(--color-primary)] hover:underline font-medium">
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full py-20">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">All caught up!</h3>
                <p className="text-xs text-gray-500">No {filter === "unread" ? "unread " : ""}notifications</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => {
                    if (!n.read) setNotifications((prev) => prev.map((p) => p.id === n.id ? { ...p, read: true } : p));
                  }}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${
                    !n.read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <span className="text-lg mt-0.5 shrink-0">{TYPE_ICONS[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{formatDate(n.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
