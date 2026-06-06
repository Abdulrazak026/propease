"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
  ),
  instagram: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  tiktok: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ),
};

function getLinkCols(brand: string) {
  return [
    {
      title: "Real Estate",
      links: [
        { label: "Browse Homes", href: "/" },
        { label: "Rentals", href: "/?type=rent" },
        { label: `About ${brand}`, href: "/about" },
        { label: "News", href: "/news" },
        { label: "Research", href: "/research" },
      ],
    },
    {
      title: "For Professionals",
      links: [
        { label: "Advertise", href: "/list-property" },
        { label: "Manage Rentals", href: "/agent" },
      ],
    },
    {
      title: "Learn & Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Privacy Notice", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
        { label: "Fair Housing Guide", href: "/fair-housing" },
      ],
    },
    {
      title: `More from ${brand}`,
      links: [
        { label: "Mobile Apps", href: "/mobile-apps" },
        { label: "AI & Technology", href: "/about#technology" },
        { label: "Zestimates", href: "/zestimates" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ];
}

export default function Footer() {
  const { get: getSetting } = useSettings();
  const brand = getSetting("site_name", "MBPP");

  const socials = [
    { label: "Facebook", href: getSetting("facebook_url") || "#", icon: "facebook" },
    { label: "Instagram", href: getSetting("instagram_url") || "#", icon: "instagram" },
    { label: "LinkedIn", href: getSetting("linkedin_url") || "#", icon: "linkedin" },
  ].filter((s) => s.href && s.href !== "#");
  if (getSetting("youtube_url")) socials.push({ label: "YouTube", href: getSetting("youtube_url"), icon: "youtube" });
  if (getSetting("twitter_url")) socials.push({ label: "X", href: getSetting("twitter_url"), icon: "twitter" });
  const LINK_COLS = getLinkCols(brand);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setMobileOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop grid — hidden on mobile */}
        {/* Brand — top, full width */}
        <div className="hidden lg:flex items-center justify-between pt-14 pb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-white">{brand}</span>
            <span className="text-sm text-gray-400 ml-2">&mdash; Kano&apos;s trusted real estate marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200" aria-label={s.label}>
                {SOCIAL_ICONS[s.icon]}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-10 pb-10">
          {LINK_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-150">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion — only on mobile */}
        <div className="lg:hidden pt-8 pb-4">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-base font-bold text-white">{brand}</span>
          </Link>
          {LINK_COLS.map((col) => (
            <div key={col.title} className="border-b border-gray-800">
              <button
                onClick={() => toggleSection(col.title)}
                className="flex items-center justify-between w-full py-3.5 text-sm font-medium text-gray-200"
              >
                {col.title}
                <svg className={`w-4 h-4 transition-transform duration-150 ${mobileOpen[col.title] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileOpen[col.title] && (
                <div className="pb-3 space-y-2.5">
                  {col.links.map((l) => (
                    <Link key={l.label} href={l.href} className="block text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legal notice */}
        <div className="hidden lg:block border-t border-gray-800 py-6 text-xs text-gray-500 leading-relaxed space-y-2">
          <p>{brand} is committed to ensuring digital accessibility for individuals with disabilities. We are continuously working to improve the accessibility of our web experience for everyone, and we welcome feedback and accommodation requests.</p>
          <p>All information provided on this website is for informational purposes only. {brand} does not guarantee the accuracy of listings, pricing, or availability. Always verify with the property owner or agent.</p>
          <p className="flex items-center gap-2 mt-3">
            <span className="inline-block w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[9px] text-gray-500 font-bold">EO</span>
            <span>Equal Housing Opportunity. We do not discriminate on the basis of race, color, religion, sex, handicap, familial status, or national origin.</span>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-500">
            <span>&copy; 2006&ndash;2026 {brand}. All rights reserved.</span>
            <span className="hidden sm:inline">&middot;</span>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <span className="hidden sm:inline">&middot;</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <span className="hidden sm:inline">&middot;</span>
            <span>Equal Housing Opportunity</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Designed by</span>
            <a
              href="https://savannix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              SAVANNIX TECHNOLOGIES LTD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
