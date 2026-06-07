"use client";
import React from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  instagram: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  linkedin: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  twitter: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
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
  const hours = g("business_hours", "Mon-Fri 8AM-6PM");

  const socialItems = [
    { key: "facebook_url", label: "Facebook", icon: "facebook" },
    { key: "instagram_url", label: "Instagram", icon: "instagram" },
    { key: "linkedin_url", label: "LinkedIn", icon: "linkedin" },
    { key: "twitter_url", label: "Twitter", icon: "twitter" },
  ].filter(s => g(s.key));

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {logo ? (
                <img src={logo} alt={brand} className="h-8 w-auto brightness-0 invert" />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-gray-950 font-black text-sm">M</span>
                  </div>
                  <span className="text-base font-bold text-white tracking-tight">MBPP</span>
                </>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">{tagline}</p>
            {email && (
              <a href={`mailto:${email}`} className="text-sm text-white hover:text-gray-300 inline-block transition-colors">
                {email}
              </a>
            )}
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
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { l: "Browse", h: "/" },
                { l: "Saved", h: "/saved" },
                { l: "Inbox", h: "/messages" },
                { l: "Updates", h: "/notifications" },
                { l: "Sell Property", h: "/sell" },
              ].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm hover:text-white transition-colors inline-block min-h-[32px]">{link.l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-4">Services</h4>
            <ul className="space-y-2.5">
              {[
                { l: "Manage Rentals", h: "/agent" },
                { l: "Advertise", h: "/list-property" },
                { l: "Apply as Agent", h: "/apply-as-agent" },
                { l: "Custom Request", h: "/custom-order" },
                { l: "Research", h: "/research" },
              ].map(link => (
                <li key={link.h}><Link href={link.h} className="text-sm hover:text-white transition-colors inline-block min-h-[32px]">{link.l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-4">Company</h4>
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
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-4">Legal</h4>
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

        <div className="mt-14 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-white font-medium">Head Office</p>
            <p className="text-sm text-gray-400">{address}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
              {phone && <span>{phone}</span>}
              {whatsapp && (!phone || whatsapp !== phone) && (
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">WhatsApp: {whatsapp}</a>
              )}
              <span>{hours}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email"
              className="text-sm bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2.5 flex-1 md:w-56 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-0"
            />
            <button className="text-sm bg-white text-gray-950 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-semibold">Subscribe</button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Copyright &copy; {new Date().getFullYear()} {brand}. All rights reserved.
          </p>
          <a
            href="https://savanix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>Designed by</span>
            <span className="font-semibold text-gray-300 group-hover:text-white">Savanix</span>
            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
