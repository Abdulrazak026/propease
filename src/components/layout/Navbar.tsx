"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api-client";

const MENU_LINKS = [
  { label: "Buy", href: "/list-property" },
  { label: "Rent", href: "/list-property?type=rent" },
  { label: "Sell", href: "/sell" },
  { label: "Partner With Us", href: "/partner" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Apply as Agent", href: "/apply-as-agent" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, setCurrentUser, isAuthenticated, loading, logout } = useRole();
  const { get: getSetting } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<{ id: string; title: string; body: string; link: string | null; read: boolean; createdAt: string; type: string }[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const siteLogo = getSetting("site_logo");
  const siteName = getSetting("site_name", "MBPP");

  useEffect(() => { setMounted(true); }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/agent") || pathname.startsWith("/ambassador") || pathname === "/wallet") return null;

  const handleLogout = async () => { await logout(); router.push("/"); };

  const fetchNotifs = useCallback(async () => {
    if (!isAuthenticated) return;
    const r = await api.get<{ notifications: typeof notifs; unread: number }>("/api/notifications");
    if (r.data?.notifications) { setNotifs(r.data.notifications.slice(0, 5)); setUnreadCount(r.data.unread || 0); }
  }, [isAuthenticated]);

  const markAllNotifRead = async () => {
    await api.patch("/api/notifications/read-all");
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as Node;
      if (userRef.current && !userRef.current.contains(target)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => { document.removeEventListener("mousedown", handler); };
  }, []);

  const isAdmin = currentUser?.role === "head" || currentUser?.role === "admin";

  return (
    <>
    {/* Mobile header */}
    <header className="lg:hidden w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link href="/" className="shrink-0 h-full flex items-center pl-2" style={{ width: "55%", maxWidth: "55%" }}>
          <img src={siteLogo || `https://mbpproperties.com/api/upload/file/7ea15ec8-11b2-4c34-a855-1469d56656a5.png`} alt={siteName} className="h-full w-auto object-contain object-left" />
        </Link>
        <div className="flex items-center gap-2 pr-2">
          {mounted && isAuthenticated && currentUser && (
            <div ref={notifRef} className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); fetchNotifs(); }} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                    {unreadCount > 0 && <button onClick={markAllNotifRead} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Mark all read</button>}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifs.length === 0 ? <div className="px-4 py-6 text-center text-gray-400 text-xs">No notifications</div> : notifs.map(n => (
                      <button key={n.id} onClick={() => { if (!n.read) api.patch(`/api/notifications/${n.id}/read`).then(fetchNotifs); if (n.link) router.push(n.link); setNotifOpen(false); }} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
                        <span className="text-sm mt-0.5 shrink-0">{n.type === "message_received" ? "💬" : n.type === "price_change" ? "💰" : "🔔"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900">{n.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{n.body}</p>
                        </div>
                        {!n.read && <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />}
                      </button>
                    ))}
                  </div>
                  <Link href="/notifications" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs text-[var(--color-primary)] font-medium hover:bg-gray-50 border-t border-gray-100">View all</Link>
                </div>
              )}
            </div>
          )}
          {mounted && isAuthenticated && currentUser && (
            <div ref={userRef} className="relative">
              <button onClick={() => setUserOpen(!userOpen)} className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                {currentUser.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
              </button>
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser.role === "head" ? "admin" : currentUser.role}</p>
                  </div>
                  <div className="py-1">
                    <Link href={currentUser.role === "head" ? "/admin" : `/${currentUser.role}`} onClick={() => setUserOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">Dashboard</Link>
                    <Link href="/deals" onClick={() => setUserOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">Transactions</Link>
                    <Link href="/messages" onClick={() => setUserOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">Messages</Link>
                    <Link href="/saved" onClick={() => setUserOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">Saved</Link>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button onClick={() => { handleLogout(); setUserOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={menuRef} className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 hover:border-brand-blue rounded-full transition font-semibold text-sm text-slate-700 min-h-[44px]">
              <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span>Menu</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-50 rounded-xl border border-gray-200 shadow-xl p-2 z-50">
                  <p className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider px-1 pb-2">Navigation</p>
                  <div>
                    {MENU_LINKS.map((item, i) => (
                      <div key={item.href} className="px-1 py-0.5">
                        <a href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-base font-medium ${
                          item.label === "Buy" ? "bg-brand-blue text-white hover:bg-brand-blue-light" :
                          item.label === "Partner With Us" ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20" :
                          "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                          <span className="font-bold text-sm w-5">{item.label[0]}</span>
                          <span>{item.label}</span>
                        </a>
                      </div>
                    ))}
                    {mounted && isAuthenticated && currentUser && (
                      <>
                        <div className="border-t border-gray-100 mx-2" />
                        <a href={isAdmin ? "/admin" : `/${currentUser?.role}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-100 transition-colors text-base text-gray-700 hover:text-gray-900">
                          <span className="text-brand-blue font-bold text-sm w-5">D</span>
                          <span className="font-medium">Dashboard</span>
                        </a>
                      </>
                    )}
                    {!mounted || !isAuthenticated ? (
                      <>
                        <div className="border-t border-gray-100 mx-2" />
                        <a href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-100 transition-colors text-base text-gray-700 hover:text-gray-900">
                          <span className="text-brand-blue font-bold text-sm w-5">S</span>
                          <span className="font-medium">Sign In</span>
                        </a>
                      </>
                    ) : null}
                    {mounted && isAuthenticated && (
                      <>
                        <div className="border-t border-gray-100 mx-2" />
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 p-3.5 rounded-lg hover:bg-red-50 transition-colors text-base text-red-500 text-left">
                          <span className="text-red-400 font-bold text-sm w-5">L</span>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Desktop header */}
    <header className="hidden lg:flex w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 xl:px-10 flex items-center justify-between w-full h-16">
        <Link href="/" className="shrink-0 h-full flex items-center pl-2" style={{ width: "20%", maxWidth: "20%" }}>
          <img src={siteLogo || `https://mbpproperties.com/api/upload/file/7ea15ec8-11b2-4c34-a855-1469d56656a5.png`} alt={siteName} className="h-full w-auto object-contain object-left" />
        </Link>

        <nav className="flex items-center gap-1.5">
          <a href="/list-property" className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue rounded-full hover:bg-brand-blue-light transition-colors">Buy</a>
          <a href="/list-property?type=rent" className="px-4 py-2 text-sm font-semibold text-brand-blue border-2 border-brand-blue rounded-full hover:bg-brand-blue hover:text-white transition-colors">Rent</a>
          <a href="/sell" className="px-4 py-2 text-sm font-semibold text-brand-blue border-2 border-brand-blue rounded-full hover:bg-brand-blue hover:text-white transition-colors">Sell</a>
          <a href="/partner" className="px-4 py-2 text-sm font-semibold text-brand-gold border-2 border-brand-gold rounded-full hover:bg-brand-gold hover:text-white transition-colors">Partner</a>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && isAuthenticated && currentUser && (
            <div ref={notifRef} className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); fetchNotifs(); }} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                    {unreadCount > 0 && <button onClick={markAllNotifRead} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Mark all read</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? <div className="px-4 py-8 text-center text-gray-400 text-xs">No notifications</div> : notifs.map(n => (
                      <button key={n.id} onClick={() => { if (!n.read) api.patch(`/api/notifications/${n.id}/read`).then(fetchNotifs); if (n.link) router.push(n.link); setNotifOpen(false); }} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
                        <span className="text-sm mt-0.5 shrink-0">{n.type === "message_received" ? "💬" : n.type === "price_change" ? "💰" : "🔔"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900">{n.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                        {!n.read && <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />}
                      </button>
                    ))}
                  </div>
                  <Link href="/notifications" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs text-[var(--color-primary)] font-medium hover:bg-gray-50 border-t border-gray-100">View all notifications</Link>
                </div>
              )}
            </div>
          )}
          {mounted && isAuthenticated && currentUser && (
            <div ref={userRef} className="relative">
              <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {currentUser.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                </div>
                <span className="text-sm text-gray-700 font-medium capitalize hidden xl:inline">{currentUser.role === "head" ? "admin" : currentUser.role}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-xl p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser.role === "head" ? "admin" : currentUser.role}{currentUser.city ? ` · ${currentUser.city}` : ""}</p>
                  </div>
                  <div className="py-1">
                    <Link href={currentUser.role === "head" ? "/admin" : `/${currentUser.role}`} onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" /></svg>
                      Dashboard
                    </Link>
                    <Link href="/deals" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
                      Transactions
                    </Link>
                    <Link href="/messages" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      Messages
                    </Link>
                    <Link href="/saved" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                      Saved
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button onClick={() => { handleLogout(); setUserOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={menuRef} className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-brand-blue rounded-full transition font-semibold text-sm text-slate-700">
              <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span>Menu</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-72 bg-gray-50 rounded-xl border border-gray-200 shadow-xl p-2 z-50">
                  <p className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider px-1 pb-2">Navigation</p>
                  <div>
                    {MENU_LINKS.map((item, i) => (
                      <div key={item.href} className="px-1 py-0.5">
                        <a href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-base font-medium ${
                          item.label === "Buy" ? "bg-brand-blue text-white hover:bg-brand-blue-light" :
                          item.label === "Partner With Us" ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20" :
                          "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                          <span className="font-bold text-sm w-5">{item.label[0]}</span>
                          <span>{item.label}</span>
                        </a>
                      </div>
                    ))}
                    {mounted && isAuthenticated && currentUser && (
                      <>
                        <div className="border-t border-gray-100 mx-2" />
                        <a href={isAdmin ? "/admin" : `/${currentUser?.role}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-100 transition-colors text-base text-gray-700 hover:text-gray-900">
                          <span className="text-brand-blue font-bold text-sm w-5">D</span>
                          <span className="font-medium">Dashboard</span>
                        </a>
                      </>
                    )}
                    {!mounted || !isAuthenticated ? (
                      <>
                        <div className="border-t border-gray-100 mx-2" />
                        <a href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-100 transition-colors text-base text-gray-700 hover:text-gray-900">
                          <span className="text-brand-blue font-bold text-sm w-5">S</span>
                          <span className="font-medium">Sign In</span>
                        </a>
                      </>
                    ) : null}
                    {mounted && isAuthenticated && (
                      <>
                        <div className="border-t border-gray-100 mx-2" />
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 p-3.5 rounded-lg hover:bg-red-50 transition-colors text-base text-red-500 text-left">
                          <span className="text-red-400 font-bold text-sm w-5">L</span>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
