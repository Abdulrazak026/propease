"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface Notification {
  id: string; type: string; title: string; body: string;
  link: string | null; read: boolean; createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  saved_search_match: "🔍", review_response: "⭐", agreement_signed: "📝",
  application_status: "📋", price_change: "💰", message_received: "💬",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchNotifications = () => {
    api.get<{ notifications: Notification[]; unread: number }>("/api/notifications").then((r) => {
      if (r.data?.notifications) setNotifications(r.data.notifications);
    });
  };

  useEffect(() => {
    api.get<{ notifications: Notification[]; unread: number }>("/api/notifications").then((r) => {
      if (r.data?.notifications) setNotifications(r.data.notifications);
    }).finally(() => setLoading(false));
  }, [refreshKey]);

  const markAllRead = async () => {
    await api.patch("/api/notifications/read-all");
    setRefreshKey(k => k + 1);
  };

  const markRead = async (id: string) => {
    await api.patch(`/api/notifications/${id}/read`);
    setRefreshKey(k => k + 1);
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-900">Notifications</h1><p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p></div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>All</button>
              <button onClick={() => setFilter("unread")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "unread" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Unread</button>
            </div>
            {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Mark all read</button>}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full py-20"><div className="text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-xs text-gray-500">No {filter === "unread" ? "unread " : ""}notifications</p>
            </div></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((n) => (
                <Link key={n.id} href={n.link || "#"} onClick={() => { if (!n.read) markRead(n.id); }} className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
                  <span className="text-lg mt-0.5 shrink-0">{TYPE_ICONS[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-sm font-semibold text-gray-900">{n.title}</p>{!n.read && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />}</div>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{new Date(n.createdAt).toLocaleDateString()}</p>
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
