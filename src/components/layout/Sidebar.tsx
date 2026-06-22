"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api-client";

const NAV_ITEMS = [
  {
    label: "Browse",
    href: "/",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    label: "Saved",
    href: "/saved",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    label: "Inbox",
    href: "/messages",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.525C3.373 3.748 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    label: "Updates",
    href: "/notifications",
    count: 0,
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
];

const MORE_ITEMS = [
  { label: "Manage Rentals", href: "/agent", desc: "Tools for property managers",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  { label: "Sell", href: "/sell", desc: "List and promote your property",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.851.851 0 01-1.08-.246 7.5 7.5 0 00-3.505-2.49m3.72-4.134a4.5 4.5 0 010-5.652m0 5.652c.533.64 1.377 1.028 2.28 1.028h.75a4.5 4.5 0 010 9h-.75c-.702 0-1.402-.03-2.09-.09m3.72-9.882a7.467 7.467 0 00-1.23-3.29c-.355-.582-.188-1.33.399-1.653l.657-.38a.851.851 0 011.08.246 7.5 7.5 0 003.505 2.49m-3.72 4.134a4.5 4.5 0 000 5.652m0-5.652c.533-.64 1.377-1.028 2.28-1.028h.75a4.5 4.5 0 000-9h-.75c-.702 0-1.402.03-2.09.09" />
      </svg>
    ),
  },
  { label: "Apply as Agent", href: "/apply-as-agent", desc: "List and manage your properties",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m2.248 2.247a23.938 23.938 0 014.197 0l.347.052m-7.864 1.12a45.5 45.5 0 0110.5 0m-6.248 1.072l1.066.067c.276.017.553.026.83.026.278 0 .554-.009.831-.027l1.066-.067a1.5 1.5 0 011.423 1.5v.076a1.5 1.5 0 01-1.388 1.497L12 13.5l-2.402-.024a1.5 1.5 0 01-1.388-1.497v-.076a1.5 1.5 0 011.422-1.5z" />
      </svg>
    ),
  },
  { label: "Request Service", href: "/custom-order", desc: "Custom property requests",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.878-4.878a2.25 2.25 0 010-3.182l5.628-5.628a2.25 2.25 0 013.182 0l4.878 4.878m-6.81 6.81l-4.92 4.92a2.25 2.25 0 01-3.182 0l-1.591-1.591a2.25 2.25 0 010-3.182l5.4-5.4m6.81 6.81l4.878-4.878a2.25 2.25 0 000-3.182l-5.628-5.628a2.25 2.25 0 00-3.182 0l-4.878 4.878" />
      </svg>
    ),
  },
  { label: "Dashboard", href: "/login", desc: "Manage your account and listings",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  { label: "About", href: "/about", desc: "Learn about MBPP",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
  { label: "Contact", href: "/contact", desc: "Get in touch with us",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  { label: "Get Help", href: "/help", desc: "Support and assistance",
    icon: (a: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser, isAuthenticated } = useRole();
  const { get: getSetting } = useSettings();
  const siteLogo = getSetting("site_logo");
  const siteName = getSetting("site_name", "MBPP");
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get<{ unread: number }>("/api/notifications").then(r => {
        if (r.data?.unread) setUnreadCount(r.data.unread);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/agent") || pathname.startsWith("/ambassador");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) setDemoOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDemoLogin = (_userId: string) => {
    router.push("/login");
  };

  if (isDashboard) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-out ${
          collapsed ? "w-16" : "w-44"
        } shrink-0`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-gray-200 ${collapsed ? "justify-center h-14" : "px-3 h-14"}`}>
          {collapsed ? (
            <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
              {siteLogo ? <img src={siteLogo} alt={siteName} className="w-9 h-9 rounded-lg object-contain" /> : (
                <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
              )}
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 group">
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="h-9 w-auto rounded-lg object-contain" />
              ) : (
                <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
              )}
              {!siteLogo && <span className="text-sm font-bold text-[var(--color-primary)]">MBPP</span>}
            </Link>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const isMore = item.href === null;
            const count = item.href === "/notifications" ? unreadCount : ((item as any).count || 0);
            return (
              <div key={item.label} className="relative">
                {isMore ? (
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      moreOpen ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      </svg>
                    </span>
                    {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      active
                        ? "text-[var(--color-primary)] font-medium shadow-[inset_3px_0_0_0_var(--color-primary)] bg-[var(--color-primary)]/5"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    } ${collapsed ? "justify-center px-0 shadow-[inset_0_0_0_0_transparent]" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon(active)}</span>
                    {!collapsed && (
                      <>
                        <span className="text-sm">{item.label}</span>
                        {count > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {count > 9 ? "9+" : count}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200 py-2 px-2 space-y-0.5">
          {collapsed ? (
            <>
              {isAuthenticated ? (
                <div className="flex justify-center py-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {currentUser!.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-2" />
              )}
              <button
                onClick={() => setCollapsed(false)}
                className="w-full flex justify-center py-1.5 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-all duration-150"
                title="Expand"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {isAuthenticated ? (
                <div className="px-3 py-2 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                    {currentUser!.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 truncate capitalize">{currentUser!.role === "head" ? "admin" : currentUser!.role}</p>
                    <p className="text-[10px] text-gray-500 truncate">{currentUser!.city}</p>
                  </div>
                </div>
              ) : (
                <div />
              )}
              <button
                onClick={() => { setCollapsed(true); }}
                className="flex items-center justify-center w-full py-1.5 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-all duration-150 group"
                title="Collapse"
              >
                <svg className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* More popover */}
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)} />
          <div
            ref={moreRef}
            className={`fixed z-40 bg-white rounded-xl border border-gray-200 shadow-xl p-3 ${
              collapsed ? "left-16 top-1/3" : "left-44 top-1/3"
            } ml-2 w-56`}
          >
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 pb-2">More</p>
            <div className="space-y-1.5">
              {MORE_ITEMS.map((item) => {
                const isDashboardItem = item.href === "/login";
                const actualHref = isAuthenticated && isDashboardItem
                  ? (currentUser!.role === "head" ? "/admin" : `/${currentUser!.role}`)
                  : item.href;
                return (
                  <Link
                    key={item.label}
                    href={actualHref}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-start gap-3.5 p-2.5 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-150 group"
                  >
                    <span className="shrink-0 mt-0.5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors">
                      {item.icon(false)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--color-primary)] transition-colors">{item.label}</p>
                      <p className="text-[11px] text-gray-400 leading-tight">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
