"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useSettings } from "@/context/SettingsContext";
import LangPill from "@/components/layout/LangPill";

const PRIMARY_LINKS = [
  { label: "Buy", href: "/?type=buy" },
  { label: "Rent", href: "/?type=rent" },
  { label: "Sell", href: "/list-property" },
  { label: "Research", href: "/research" },
];

const MORE_LINKS = [
  { label: "About", href: "/about", desc: "Our story and team" },
  { label: "Contact", href: "/contact", desc: "Talk to us" },
  { label: "Get Help", href: "/help", desc: "FAQ and support" },
  { label: "Apply as Agent", href: "/apply-as-agent", desc: "Join the team" },
  { label: "News", href: "/news", desc: "Latest updates" },
  { label: "Careers", href: "/careers", desc: "Open roles" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, setCurrentUser, isAuthenticated } = useRole();
  const { get: getSetting } = useSettings();
  const [moreOpen, setMoreOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const siteLogo = getSetting("site_logo");
  const siteName = getSetting("site_name", "MBPP");

  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/agent") || pathname.startsWith("/ambassador") || pathname === "/wallet";

  const handleLogout = () => { setCurrentUser(null); router.push("/"); };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 8) { setHidden(false); setScrolled(false); }
      else {
        setScrolled(true);
        if (delta > 4 && y > 80) setHidden(true);
        else if (delta < -4) setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isDashboard) return null;

  return (
    <>
    <header
      className={`lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b h-12 flex items-center px-3 sm:px-4 max-w-[100vw] overflow-hidden rounded-b-2xl transition-transform duration-300 ${
        scrolled ? "border-gray-200" : "border-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
        {siteLogo ? (
          <img src={siteLogo} alt={siteName} className="h-6 w-auto rounded-lg object-contain" />
        ) : (
          <>
            <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-[9px]">M</span>
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-tight truncate">{siteName}</span>
          </>
        )}
      </Link>
      <div className="flex-1 min-w-0" />
      <div className="mr-1 shrink-0"><LangPill /></div>
      {isAuthenticated ? (
        <Link
          href={currentUser!.role === "head" ? "/admin" : `/${currentUser!.role}`}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0 ml-2"
        >
          {currentUser!.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </Link>
      ) : (
        <Link
          href="/login"
          className="ml-2 px-3 py-1.5 text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 rounded-full transition-colors shrink-0"
        >
          Sign In
        </Link>
      )}
    </header>
    <header
      className={`hidden lg:flex sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b h-14 items-center rounded-b-2xl transition-transform duration-300 ${
        scrolled ? "border-gray-200" : "border-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 xl:px-10 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {siteLogo ? (
            <img src={siteLogo} alt={siteName} className="h-8 w-auto rounded-lg object-contain" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-black text-xs">M</span>
              </div>
              <span className="text-base font-bold text-gray-900 tracking-tight">{siteName}</span>
            </>
          )}
        </Link>

        <nav className="flex items-center gap-1">
          {PRIMARY_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all ${
                  active
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/8"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all inline-flex items-center gap-1 ${
                moreOpen ? "text-gray-900 bg-gray-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              More
              <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-900/5 p-2 z-50">
                {MORE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-md bg-gray-100 group-hover:bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="mr-1"><LangPill /></div>
          {isAuthenticated ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {currentUser!.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className="text-sm text-gray-700 font-medium capitalize hidden xl:inline">{currentUser!.role === "head" ? "admin" : currentUser!.role}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-900/5 p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{currentUser!.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser!.role === "head" ? "admin" : currentUser!.role}{currentUser!.city ? ` · ${currentUser!.city}` : ""}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={currentUser!.role === "head" ? "/admin" : `/${currentUser!.role}`}
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link href="/saved" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                      Saved
                    </Link>
                    <Link href="/notifications" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                      Notifications
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button onClick={() => { handleLogout(); setUserOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
          <Link
            href="/list-property"
            className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 rounded-lg transition-colors"
          >
            List Property
          </Link>
        </>
      )}
    </div>
      </div>
    </header>
    </>
  );
}
