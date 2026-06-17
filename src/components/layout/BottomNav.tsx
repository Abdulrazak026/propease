"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { api } from "@/lib/api-client";

const TABS = [
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
];

const MORE_TABS = [
  { label: "Advertise", href: "/sell", desc: "List your property",
    icon: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.851.851 0 01-1.08-.246 7.5 7.5 0 00-3.505-2.49m3.72-4.134a4.5 4.5 0 010-5.652m0 5.652c.533.64 1.377 1.028 2.28 1.028h.75a4.5 4.5 0 010 9h-.75c-.702 0-1.402-.03-2.09-.09m3.72-9.882a7.467 7.467 0 00-1.23-3.29c-.355-.582-.188-1.33.399-1.653l.657-.38a.851.851 0 011.08.246 7.5 7.5 0 003.505 2.49m-3.72 4.134a4.5 4.5 0 000 5.652m0-5.652c.533-.64 1.377-1.028 2.28-1.028h.75a4.5 4.5 0 000-9h-.75c-.702 0-1.402.03-2.09.09" />
      </svg>
    ),
  },
  { label: "Request Service", href: "/custom-order", desc: "Custom requests",
    icon: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.878-4.878a2.25 2.25 0 010-3.182l5.628-5.628a2.25 2.25 0 013.182 0l4.878 4.878m-6.81 6.81l-4.92 4.92a2.25 2.25 0 01-3.182 0l-1.591-1.591a2.25 2.25 0 010-3.182l5.4-5.4m6.81 6.81l4.878-4.878a2.25 2.25 0 000-3.182l-5.628-5.628a2.25 2.25 0 00-3.182 0l-4.878 4.878" />
      </svg>
    ),
  },
  { label: "About", href: "/about", desc: "Learn about MBPP",
    icon: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
  { label: "Contact", href: "/contact", desc: "Get in touch",
    icon: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  { label: "Get Help", href: "/help", desc: "Support & FAQ",
    icon: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, currentUser, role, loading, logout } = useRole();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleTabClick = useCallback((href: string) => {
    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  // Show skeleton while loading
  if (loading) return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 px-4">
            <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-8 h-2.5 bg-gray-100 rounded animate-pulse mt-0.5" />
          </div>
        ))}
      </div>
    </nav>
  );

  const tabs = [
    ...TABS.slice(0, 2),
    ...(isAuthenticated ? [{
      label: "Deals",
      href: "/deals",
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
    }] : []),
    ...TABS.slice(2),
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => handleTabClick(tab.href)}
                className={`relative flex flex-col items-center justify-center gap-0.5 h-full px-2 transition-colors duration-150 active:scale-95 min-w-0 ${
                  active ? "text-[var(--color-primary)]" : "text-gray-400"
                }`}
              >
                {active && (
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[var(--color-primary)] rounded-full" />
                )}
                <div className="relative">
                  {tab.icon(active)}
                </div>
                <span className={`text-[11px] font-medium leading-tight ${active ? "font-semibold" : ""}`}>{tab.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSheetOpen(true)}
            className="relative flex flex-col items-center justify-center gap-0.5 h-full px-2 text-gray-400 active:scale-95 transition-transform duration-150 min-w-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-[11px] font-medium leading-tight">More</span>
          </button>
        </div>
      </nav>

      {sheetOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-xl lg:hidden animate-slide-up-bottom" style={{ animation: "slideUpBottom 0.25s ease-out" }}>
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-9 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 pb-8 max-h-[70vh] overflow-y-auto">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 pb-3">More</p>
              <div className="space-y-0.5">
                {MORE_TABS.map((tab) => {
                  const actualHref = isAuthenticated && tab.href === "/login"
                    ? (currentUser!.role === "head" ? "/admin" : `/${currentUser!.role}`)
                    : tab.href;
                  return (
                    <Link
                      key={tab.label}
                      href={actualHref}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-start gap-3.5 p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-150 active:bg-gray-100 group"
                    >
                      <span className="shrink-0 mt-0.5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors">
                        {tab.icon()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--color-primary)] transition-colors">{tab.label}</p>
                        <p className="text-[11px] text-gray-400">{tab.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {isAuthenticated && (
                <button
                  onClick={async () => {
                    setSheetOpen(false);
                    await logout();
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-lg w-full text-left hover:bg-red-50 transition-colors mt-2 border-t border-gray-100 pt-4"
                >
                  <span className="shrink-0 text-red-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-red-600">Sign Out</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
