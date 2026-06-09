"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api-client";

import { resolveImageUrl } from "@/lib/utils";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  instagram: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  linkedin: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  twitter: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  tiktok: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.58-1.42V6.69h3.58z"/></svg>,
};

export default function Footer() {
  const { get: g } = useSettings();
  const brand = g("site_name", "Mutual Benefit Premier Properties");
  const tagline = g("site_tagline", "Find Your Dream Property in Kano");
  const logo = g("site_logo");
  const address = g("office_address", "Kano Municipal, Kano State, Nigeria");
  const phone = g("support_phone");
  const email = g("support_email", "support@mbpproperties.com");
  const whatsapp = g("support_whatsapp");
  const hours = g("business_hours", "Mon–Fri 8AM–6PM");

  const [emailInput, setEmailInput] = useState("");
  const [subState, setSubState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");

  const subscribe = async () => {
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setSubState("error");
      setSubMsg("Please enter a valid email");
      return;
    }
    setSubState("sending");
    const r = await api.post<{ ok: boolean; message: string }>("/api/newsletter/subscribe", { email: emailInput, source: "footer" });
    if (r.data?.ok) {
      setSubState("done");
      setSubMsg(r.data.message || "Thanks!");
      setEmailInput("");
    } else {
      setSubState("error");
      setSubMsg(r.error || "Something went wrong");
    }
    setTimeout(() => setSubState("idle"), 4000);
  };

  const socialItems = [
    { key: "facebook_url", label: "Facebook", icon: "facebook" },
    { key: "instagram_url", label: "Instagram", icon: "instagram" },
    { key: "tiktok_url", label: "TikTok", icon: "tiktok" },
    { key: "linkedin_url", label: "LinkedIn", icon: "linkedin" },
    { key: "twitter_url", label: "Twitter", icon: "twitter" },
  ].filter(s => g(s.key));

  const phoneClean = (phone || "").replace(/[^0-9]/g, "");
  const whatsappClean = (whatsapp || "").replace(/[^0-9]/g, "");

  return (
    <footer className="bg-gray-950 text-gray-400 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-gray-950 font-black text-base">M</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">{brand}</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">{tagline}</p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white tracking-wide">Head Office</p>
              <p className="text-sm text-gray-400 leading-relaxed">{address}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {phone && (
                  <a href={`tel:${phoneClean}`} className="inline-flex items-center gap-1.5 text-xs text-white hover:text-gray-200 transition-colors bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    {phone}
                  </a>
                )}
                {whatsappClean && (
                  <a href={`https://wa.me/${whatsappClean}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white hover:text-emerald-200 transition-colors bg-emerald-900/40 border border-emerald-800/60 rounded-full px-3 py-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    WhatsApp
                  </a>
                )}
                {hours && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {hours}
                  </span>
                )}
              </div>
            </div>
            {socialItems.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {socialItems.map(s => (
                  <a key={s.key} href={g(s.key)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-950 hover:border-white transition-all duration-200" aria-label={s.label}>
                    {SOCIAL_ICONS[s.icon] || s.label[0]}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white tracking-wide mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { l: "Browse", h: "/" },
                { l: "Inbox", h: "/messages" },
                { l: "Updates", h: "/notifications" },
                { l: "Sell Property", h: "/sell" },
              ].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm hover:text-white transition-colors inline-block min-h-[32px]">{link.l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white tracking-wide mb-4">Services</h4>
            <ul className="space-y-2.5">
              {[
                { l: "Advertise", h: "/sell" },
                { l: "Custom Request", h: "/custom-order" },
                { l: "Research", h: "/research" },
                { l: "Sign In", h: "/login" },
              ].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm hover:text-white transition-colors inline-block min-h-[32px]">{link.l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white tracking-wide mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { l: "About us", h: "/about" },
                { l: "Contact", h: "/contact" },
                { l: "Get Help", h: "/help" },
                { l: "Careers", h: "/careers" },
                { l: "News", h: "/news" },
              ].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm hover:text-white transition-colors inline-block min-h-[32px]">{link.l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white tracking-wide mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { l: "Terms of Use", h: "/terms" },
                { l: "Privacy Policy", h: "/privacy" },
                { l: "Disclaimer", h: "/disclaimer" },
                { l: "Fair Housing", h: "/fair-housing" },
              ].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm hover:text-white transition-colors inline-block min-h-[32px]">{link.l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-white mb-1">Get new properties by email</p>
            <p className="text-xs text-gray-500">We send fresh listings every Friday. No spam.</p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email for newsletter"
                className="text-sm bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2.5 flex-1 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              />
              <button
                onClick={subscribe}
                disabled={subState === "sending"}
                className="text-sm bg-white text-gray-950 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
              >
                {subState === "sending" ? "…" : "Subscribe"}
              </button>
            </div>
            {subState !== "idle" && (
              <p className={`text-[11px] mt-1.5 ${subState === "error" ? "text-red-400" : "text-emerald-400"}`}>
                {subMsg}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Copyright &copy; {new Date().getFullYear()} {brand}. All rights reserved.
          </p>
          <a
            href="https://savannix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>Designed by</span>
            <span className="font-semibold text-gray-300 group-hover:text-white">Savannix Tech ltd.</span>
            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
