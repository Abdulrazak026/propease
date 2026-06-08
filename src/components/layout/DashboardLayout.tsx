"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useSettings } from "@/context/SettingsContext";
import { dashboardNav, NavItem } from "@/lib/nav-config";
import { api } from "@/lib/api-client";

const icons: Record<string, React.ReactNode> = {
  dashboard: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  users: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  commissions: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  settings: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  audit: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>,
  tasks: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75M10.5 16.875h3.75M10.5 11.25h3.75M10.5 14.0625h3.75" /></svg>,
  inquiries: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.136-.847-2.1-1.98-2.193-.34-.027-.68-.052-1.02-.072l-3 .001m0 0l-3 .001m0 0c-1.354 0-2.694.055-4.02.163a2.115 2.115 0 01-.825.242m0 0c-.884.284-1.5 1.128-1.5 2.097v4.286c0 1.136.847 2.1 1.98 2.193.34.027.68.052 1.02.072l3-.001" /></svg>,
  wallet: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>,
  applications: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  agreements: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>,
  "city-overview": <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  "post-listing": <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  "create-task": <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
  messages: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.525C3.373 3.748 2.25 5.14 2.25 6.741v6.018z" /></svg>,
  notifications: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
};

const NOTIF_ICONS: Record<string, string> = {
  saved_search_match: "🔍", review_response: "⭐", agreement_signed: "📝",
  application_status: "📋", price_change: "💰", message_received: "💬",
};

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, currentUser, loading, isAuthenticated, logout } = useRole();
  const { get: getSetting } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<{ id: string; type: string; title: string; body: string; link: string | null; read: boolean; createdAt: string }[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const notifRef = useRef<HTMLDivElement>(null);

  const resolvedRole = role === "head" ? "admin" : role;
  const logo = getSetting("site_logo");
  const allItems = resolvedRole ? dashboardNav[resolvedRole] || [] : [];
  const items = allItems.filter(item => {
    if (!item.permission) return true;
    if (role === "head") return true;
    return (currentUser as any)?.[item.permission] === true;
  });

  // Group items for admin
  const groups: Record<string, NavItem[]> = {};
  if (resolvedRole === "admin") {
    items.forEach(item => {
      const g = item.group || "Other";
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });
  }

  // Fetch notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetch = () => {
      api.get<{ notifications: any[]; unread: number }>("/api/notifications").then(r => {
        if (r.data?.notifications) setNotifs(r.data.notifications.slice(0, 8));
        if (r.data?.unread !== undefined) setUnreadCount(r.data.unread);
      }).catch(() => {});
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Auto-expand groups with active items
  useEffect(() => {
    if (resolvedRole !== "admin") return;
    Object.entries(groups).forEach(([groupName, groupItems]) => {
      if (groupItems.some(item => pathname === item.href || pathname.startsWith(item.href + "/"))) {
        setExpandedGroups(prev => ({ ...prev, [groupName]: true }));
      }
    });
  }, [pathname, resolvedRole]);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleGroup = (g: string) => setExpandedGroups(prev => ({ ...prev, [g]: !prev[g] }));

  const markRead = async (id: string) => {
    await api.patch(`/api/notifications/${id}/read`);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await api.patch("/api/notifications/read-all");
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const bellIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );

  const NotificationDropdown = ({ mobile }: { mobile?: boolean }) => (
    <div className={`${mobile ? "w-full" : "absolute right-0 top-full mt-2 w-80"} bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Notifications</span>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{unreadCount}</span>}
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] font-medium text-[var(--color-primary)] hover:underline">Mark all read</button>
          )}
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-xs">No notifications yet</div>
        ) : notifs.map(n => (
          <button key={n.id} onClick={() => { if (!n.read) markRead(n.id); if (n.link) router.push(n.link); setNotifOpen(false); }} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
            <span className="text-base mt-0.5 shrink-0">{NOTIF_ICONS[n.type] || "🔔"}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900">{n.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5" />}
          </button>
        ))}
      </div>
      <Link href="/notifications" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-xs font-medium text-[var(--color-primary)] hover:bg-gray-50 text-center border-t border-gray-100">
        View all notifications →
      </Link>
    </div>
  );

  // Desktop sidebar nav — grouped for admin, flat for others
  const DesktopNavItems = () => {
    if (resolvedRole !== "admin") {
      return <>{items.map(item => <NavLink key={item.href} item={item} />)}</>;
    }
    return <>
      {Object.entries(groups).map(([groupName, groupItems]) => {
        const expanded = expandedGroups[groupName] === true;
        const hasActive = groupItems.some(i => pathname === i.href || pathname.startsWith(i.href + "/"));
        return (
          <div key={groupName} className="mb-1">
            <button onClick={() => toggleGroup(groupName)} className={`flex items-center justify-between w-full px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${hasActive ? "text-emerald-400/80" : "text-slate-500 hover:text-slate-400"}`}>
              <span>{groupName}</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
            {expanded && <div className="space-y-0.5 mt-0.5">{groupItems.map(item => <NavLink key={item.href} item={item} />)}</div>}
          </div>
        );
      })}
    </>;
  };

  // Mobile nav — grouped for admin, flat for others
  const MobileNavItems = () => {
    if (resolvedRole !== "admin") {
      return <>{items.map(item => <MobileNavLink key={item.href} item={item} />)}</>;
    }
    return <>
      {Object.entries(groups).map(([groupName, groupItems]) => (
        <div key={groupName} className="mb-3">
          <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{groupName}</p>
          <div className="space-y-0.5">{groupItems.map(item => <MobileNavLink key={item.href} item={item} />)}</div>
        </div>
      ))}
    </>;
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link href={item.href} className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${active ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-white shadow-sm shadow-emerald-500/5" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
        <span className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-md transition-colors ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}>{icons[item.icon] || null}</span>
        <span className="truncate">{item.label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />}
      </Link>
    );
  };

  const MobileNavLink = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all ${active ? "bg-gray-100 text-gray-900 font-semibold border-l-2 border-[var(--color-primary)]" : "text-gray-600 hover:bg-gray-50"}`}>
        <span className="shrink-0 text-gray-400">{icons[item.icon] || null}</span>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  const quickActions = [
    { label: "Dashboard", href: `/${resolvedRole}`, icon: icons.dashboard },
    { label: "Messages", href: "/messages", icon: icons.messages },
    { label: "Notifications", href: "/notifications", icon: icons.notifications },
    { label: "Settings", href: resolvedRole === "admin" ? "/admin/settings" : `/${resolvedRole}/settings`, icon: icons.settings },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <button onClick={() => setMobileOpen(true)} className="text-gray-600 p-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </button>
        <div className="flex items-center gap-2">
          {logo && <img src={logo} alt="" className="h-6 w-auto rounded" />}
          <span className="text-sm font-bold text-gray-900">{getSetting("site_name", "MBPP")}</span>
        </div>
        <div className="flex items-center gap-1" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-gray-500 hover:text-gray-700 p-2">
            {bellIcon}
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>
          {notifOpen && <div className="absolute top-full right-2 mt-1"><NotificationDropdown /></div>}
        </div>
      </div>

      {/* Mobile full-screen nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up-bottom" style={{ animation: "slideUpBottom 0.25s ease-out" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                  {currentUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "P"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{currentUser?.name || "User"}</p>
                  <p className="text-xs text-gray-500 capitalize">{resolvedRole}{currentUser?.city ? ` · ${currentUser.city}` : ""}</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pb-4">
              {/* Nav items */}
              <div className="pt-2">
                <MobileNavItems />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
              <button onClick={async () => { await logout(); setMobileOpen(false); window.location.href = "/"; }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                Sign Out
              </button>
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                ← Site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-56 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 backdrop-blur-xl hidden md:flex md:flex-col shrink-0 border-r border-slate-800/50">
        {logo && (
          <div className="p-4 border-b border-slate-800/50">
            <Link href="/" className="flex items-center justify-center"><img src={logo} alt="" className="h-7 w-auto rounded" /></Link>
          </div>
        )}
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/20 shrink-0">
              {currentUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "P"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.name || "User"}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">{resolvedRole}{currentUser?.city ? ` · ${currentUser.city}` : ""}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-thin"><DesktopNavItems /></nav>
        <div className="p-2 border-t border-slate-800/50 space-y-0.5">
          <button onClick={async () => { await logout(); window.location.href = "/"; }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Sign Out
          </button>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Site
          </Link>
        </div>
      </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 overflow-y-auto pt-14 md:pt-0">
          {/* Content top bar with notification bell */}
          <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-500 font-medium">{resolvedRole === "admin" ? "Admin Panel" : resolvedRole === "agent" ? "Agent Dashboard" : "Ambassador Portal"}</span>
            </div>
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100/80 transition-all">
                {bellIcon}
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>
              {notifOpen && <div className="absolute right-0 top-full mt-2"><NotificationDropdown /></div>}
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
    </div>
  );
}
