"use client";
import { useState, useEffect, useRef } from "react";
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
 { id: "n1", type: "saved_search_match", title: "New match found", body: "2 new properties match your '2-bedroom flat' search", link: "/saved", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
 { id: "n2", type: "review_response", title: "Review responded", body: "Agent responded to your review", link: "/listings/l2", read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
 { id: "n3", type: "agreement_signed", title: "Agreement signed", body: "Tenant signed the tenancy agreement", link: "/agreements/a1", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export default function NotificationBell() {
 const [open, setOpen] = useState(false);
 const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClick = (e: MouseEvent) => {
 if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
 };
 document.addEventListener("mousedown", handleClick);
 return () => document.removeEventListener("mousedown", handleClick);
 }, []);

 const unread = notifications.filter((n) => !n.read).length;

 const markAllRead = () => {
 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
 };

 return (
 <div ref={ref} className="relative">
 <button
 onClick={() => setOpen(!open)}
 className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
 aria-label="Notifications"
>
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
 </svg>
 {unread> 0 && (
 <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
 {unread> 9 ? "9+" : unread}
 </span>
 )}
 </button>

 {open && (
 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-xl z-50">
 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
 <span className="text-sm font-semibold text-gray-900">Notifications</span>
 {unread> 0 && (
 <button onClick={markAllRead} className="text-[10px] text-[var(--color-primary)] hover:underline font-medium">
 Mark all read
 </button>
 )}
 </div>

 <div className="max-h-80 overflow-y-auto">
 {notifications.length === 0 ? (
 <div className="text-center py-8 text-gray-400 text-xs">No notifications yet</div>
 ) : (
 notifications.slice(0, 10).map((n) => (
 <Link
 key={n.id}
 href={n.link || "#"}
 onClick={() => {
 if (!n.read) setNotifications((prev) => prev.map((p) => p.id === n.id ? { ...p, read: true } : p));
 setOpen(false);
 }}
 className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}
>
 <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-[var(--color-primary)]" : "bg-transparent"}`} />
 <div className="min-w-0">
 <p className="text-xs font-semibold text-gray-900 truncate">{n.title}</p>
 <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{n.body}</p>
 <p className="text-[10px] text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
 </div>
 </Link>
 ))
 )}
 </div>

 <Link
 href="/notifications"
 onClick={() => setOpen(false)}
 className="block text-center text-xs text-[var(--color-primary)] font-medium py-3 border-t border-gray-100 hover:bg-gray-50 rounded-b-2xl"
>
 View all notifications
 </Link>
 </div>
 )}
 </div>
 );
}
