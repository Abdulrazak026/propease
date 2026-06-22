"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters from "@/components/listings/PropertyFilters";
import { useListings } from "@/hooks/useListings";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";
import SoldPropertiesGallery from "@/components/listings/SoldPropertiesGallery";
import AutoCarousel from "@/components/homepage/AutoCarousel";

interface City { id: string; name: string; }
interface BlogPost { id: string; slug: string; title: string; excerpt?: string | null; content?: string | null; coverImage: string | null; publishedAt: string | null; author?: { name: string } | null; }
interface ResearchReport { title: string; date: string; summary: string; metrics: string[]; }
interface TeamMember { name: string; role: string; bio?: string; photo?: string; }

const INITIAL_SHOW = 6;
const LOAD_MORE = 6;

const CATEGORY_PILLS = [
  { label: "All", value: "" },
  { label: "Houses", value: "house" },
  { label: "Flats", value: "flat" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
];

const PLACEHOLDER_PROJECTS = [
  { image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop", title: "Luxury Villa, Tarauni", subtitle: "4-bedroom duplex with modern finishes" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop", title: "Modern Estate, Nassarawa", subtitle: "6 units of 3-bedroom apartments" },
  { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop", title: "Smart Homes, Kano Municipal", subtitle: "Eco-friendly smart homes" },
  { image: "https://images.unsplash.com/photo-1600566753086-00f18f6b7c92?w=800&h=500&fit=crop", title: "Gated Community, Fagge", subtitle: "Secure compound with 8 townhouses" },
];

const PLACEHOLDER_DEVELOPMENTS = [
  { image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=500&fit=crop", title: "Green Valley Estate", subtitle: "Phase 2 construction ongoing" },
  { image: "https://images.unsplash.com/photo-1590674899484-d5640f854633?w=800&h=500&fit=crop", title: "City Center Towers", subtitle: "12-storey commercial complex" },
  { image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=500&fit=crop", title: "Harmony Heights", subtitle: "Luxury hilltop development" },
];

const PLACEHOLDER_LANDS = [
  { image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop", title: "Prime Plot, Tarauni", subtitle: "500 sqm, title documents ready" },
  { image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&h=500&fit=crop", title: "Commercial Land, Kano Municipal", subtitle: "2,000 sqm, high traffic area" },
  { image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&h=500&fit=crop", title: "Residential Plot, Nassarawa", subtitle: "300 sqm, quiet neighborhood" },
];

const SOCIAL_PLATFORMS = [
  { key: "facebook_url", label: "Facebook", icon: "facebook" },
  { key: "instagram_url", label: "Instagram", icon: "instagram" },
  { key: "tiktok_url", label: "TikTok", icon: "tiktok" },
  { key: "linkedin_url", label: "LinkedIn", icon: "linkedin" },
  { key: "twitter_url", label: "Twitter", icon: "twitter" },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  instagram: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  linkedin: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  twitter: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  tiktok: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.58-1.42V6.69h3.58z"/></svg>,
};

export default function HomePage() {
  const { get: getSetting, loading: settingsLoading } = useSettings();
  const heroImage = getSetting("hero_image") || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=900&fit=crop";
  const siteName = getSetting("site_name", "MBPP");
  const siteTagline = getSetting("site_tagline", "Find Your Dream Property in Kano & Northern States");
  const heroRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [cities, setCities] = useState<City[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  let researchReports: ResearchReport[] = [];
  try { const raw = getSetting("research_reports"); if (raw) researchReports = JSON.parse(raw); } catch {}

  let teamMembers: TeamMember[] = [];
  try { const raw = getSetting("team_members"); if (raw) teamMembers = JSON.parse(raw); } catch {}

  useEffect(() => {
    const handler = () => {
      setHeroOpacity(Math.max(0, Math.min(1, 1 - window.scrollY / (window.innerHeight * 0.6))));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    fetch("https://mbpproperties.com/api/blog").then(r => r.json()).then(d => {
      const fetched = (d.posts || []).filter((p: BlogPost) => p.publishedAt);
      if (fetched.length > 0) setPosts(fetched);
      setPostsLoading(false);
    }).catch(() => setPostsLoading(false));
  }, []);

  const { listings, loading, filters, setFilters } = useListings();

  useEffect(() => {
    if (listings.length > 0) {
      const unique = new Map<string, City>();
      listings.forEach(l => {
        if (l.city) unique.set(l.city, { id: l.city, name: l.city });
      });
      setCities(Array.from(unique.values()));
    }
  }, [listings]);

  const handleFilterChange = (next: any) => {
    setFilters({
      search: next.search,
      propertyType: next.propertyType,
      listingType: next.listingType,
      rentTier: next.rentTier || "",
      city: next.city,
      category: next.category || "",
      minPrice: next.minPrice?.toString() || "",
      maxPrice: next.maxPrice?.toString() || "",
      minBeds: next.minBeds?.toString() || "",
      maxBeds: next.maxBeds?.toString() || "",
      minBaths: next.minBaths?.toString() || "",
      maxBaths: next.maxBaths?.toString() || "",
      minSqft: next.minSqft?.toString() || "",
      maxSqft: next.maxSqft?.toString() || "",
      paymentOption: next.paymentOption || "",
    });
    setShowCount(INITIAL_SHOW);
  };

  const visibleListings = listings.slice(0, showCount);

  const isSearching = !!(filters.search || filters.propertyType || filters.listingType || filters.city || filters.minPrice || filters.maxPrice || filters.minBeds || filters.maxBeds || filters.minBaths || filters.maxBaths || filters.category);

  const facebookUrl = getSetting("facebook_url");
  const instagramUrl = getSetting("instagram_url");
  const tiktokUrl = getSetting("tiktok_url");
  const linkedinUrl = getSetting("linkedin_url");
  const twitterUrl = getSetting("twitter_url");

  const socialLinks = [
    { url: facebookUrl, label: "Facebook", icon: "facebook" },
    { url: instagramUrl, label: "Instagram", icon: "instagram" },
    { url: tiktokUrl, label: "TikTok", icon: "tiktok" },
    { url: linkedinUrl, label: "LinkedIn", icon: "linkedin" },
    { url: twitterUrl, label: "Twitter", icon: "twitter" },
  ].filter(s => s.url);

  const staffItems = (teamMembers.length > 0 ? teamMembers : [
    { name: "Aisha Bello", role: "CEO / Lead Consultant", photo: "" },
    { name: "Ahmad Abubakar", role: "Head of Operations", photo: "" },
    { name: "Zahradden Aliyu", role: "Senior Property Manager", photo: "" },
  ]).map(m => ({
    image: m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6366f1&color=fff&size=400`,
    title: m.name,
    subtitle: m.role,
  }));

  return (
    <div className="flex flex-col">
      <section ref={heroRef} className="relative bg-gray-950 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          {!settingsLoading && <img src={heroImage} alt="MBPP Properties - Find verified houses, land and flats in Kano & Northern States, Nigeria" className="w-full h-full object-cover opacity-65 transition-opacity duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/25 to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-25 mix-blend-screen" />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-24 sm:py-32 lg:py-40" style={{ opacity: heroOpacity }}>
          <div className="flex flex-col items-center text-center">
            <img
              src={getSetting("site_logo") || `https://mbpproperties.com/api/upload/file/7ea15ec8-11b2-4c34-a855-1469d56656a5.png`}
              alt={siteName}
              className="h-28 sm:h-36 lg:h-44 w-auto rounded-lg object-contain mb-8 sm:mb-10"
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight max-w-2xl">
              Find Your Property in<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">Kano &amp; other northern states</span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 mt-4 sm:mt-5 max-w-xl leading-relaxed">
              Trusted properties. Verified listings. Happy clients.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between rounded-xl bg-gray-50/50 px-4 py-3">
            {[
              { v: "30+", l: "Properties", icon: "bi-shield-check", c: "text-emerald-500" },
              { v: "14", l: "Areas", icon: "bi-buildings", c: "text-blue-500" },
              { v: "4", l: "Cities", icon: "bi-geo-alt", c: "text-purple-500" },
              { v: "100+", l: "Clients", icon: "bi-people", c: "text-orange-500" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-2 sm:gap-3">
                <i className={`bi ${s.icon} ${s.c} text-lg sm:text-xl`}></i>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-extrabold text-[var(--color-primary)]">{s.v}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{s.l}</p>
                </div>
                {i < 3 && <div className="h-8 w-px bg-gray-200 ml-1 sm:ml-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 shadow-sm" data-filter-search>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-4">
          <PropertyFilters onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {isSearching ? "Search results" : "Properties for you"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{loading ? "Loading\u2026" : listings.length > 0 ? `${listings.length} ${listings.length === 1 ? "property" : "properties"}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            {CATEGORY_PILLS.map((p) => {
              const active = activeCategory === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => {
                    setActiveCategory(p.value);
                    setFilters((prev: any) => ({ ...prev, propertyType: p.value }));
                    setShowCount(INITIAL_SHOW);
                  }}
                  className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-56 bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : visibleListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No properties match your search</h3>
            <p className="text-sm text-gray-500 mb-6">Tell us what you need and we'll find it for you.</p>
            <Link
              href="/custom-order"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.878-4.878a2.25 2.25 0 010-3.182l5.628-5.628a2.25 2.25 0 013.182 0l4.878 4.878m-6.81 6.81l-4.92 4.92a2.25 2.25 0 01-3.182 0l-1.591-1.591a2.25 2.25 0 010-3.182l5.4-5.4m6.81 6.81l4.878-4.878a2.25 2.25 0 000-3.182l-5.628-5.628a2.25 2.25 0 00-3.182 0l-4.878 4.878" />
              </svg>
              Request Custom Search
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleListings.map((l) => (
                <PropertyCard key={l.id} listing={l as any} />
              ))}
            </div>
            {listings.length > showCount && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setShowCount(c => c + LOAD_MORE)} className="min-h-[48px] px-8 py-3 text-sm font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all">
                  Load more properties
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SoldPropertiesGallery />

      {/* VERIFIED PROPERTIES */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <i className="bi bi-shield-fill-check text-emerald-600 text-2xl sm:text-3xl"></i>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">VERIFIED PROPERTIES</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 max-w-xl">Every property we sell is 100% verified through due diligence and transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROMISE TO YOU */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <i className="bi bi-shield-check text-amber-600 text-2xl sm:text-3xl"></i>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">OUR PROMISE TO YOU</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 max-w-xl">For any issue related to purchased properties, MBPP takes 100% responsibility. Your peace of mind is our commitment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-10">WHAT WE OFFER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-emerald-100 transition-colors">
                <i className="bi bi-map-fill text-emerald-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">WE SELL LANDS</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Genuine plots in prime locations with secure titles</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-100 transition-colors">
                <i className="bi bi-house-fill text-blue-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">WE BUILD HOUSES</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">From foundation to finishing, we build quality homes tailored to your needs</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-purple-100 transition-colors">
                <i className="bi bi-buildings-fill text-purple-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">WE SELL COMPLETED HOUSES</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Move-in ready homes with modern finishing and quality construction</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR COMPLETED PROJECTS */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">OUR COMPLETED PROJECTS</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-6 sm:mb-8 max-w-xl mx-auto">Take a look at some of our delivered projects across Kano &amp; Northern Nigeria</p>
          <AutoCarousel items={PLACEHOLDER_PROJECTS} />
        </div>
      </section>

      {/* OUR DEVELOPMENTS IN PROGRESS */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">OUR DEVELOPMENTS IN PROGRESS</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-6 sm:mb-8 max-w-xl mx-auto">Ongoing projects taking shape across prime locations</p>
          <AutoCarousel items={PLACEHOLDER_DEVELOPMENTS} />
        </div>
      </section>

      {/* OUR LANDS */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">OUR LANDS</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-6 sm:mb-8 max-w-xl mx-auto">Prime land parcels with genuine titles and secure transactions</p>
          <AutoCarousel items={PLACEHOLDER_LANDS} />
        </div>
      </section>

      {/* WHY BUY FROM MBPP */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-10">WHY BUY FROM MBPP?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Verified & Genuine Properties", icon: "bi-shield-fill-check", color: "text-emerald-500", bg: "bg-emerald-50" },
              { title: "Prime Locations", icon: "bi-geo-alt-fill", color: "text-blue-500", bg: "bg-blue-50" },
              { title: "In Kano & Northern States", icon: "bi-buildings", color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Quality Construction & Finishing", icon: "bi-star-fill", color: "text-amber-500", bg: "bg-amber-50" },
              { title: "Flexible Payment Options", icon: "bi-credit-card", color: "text-rose-500", bg: "bg-rose-50" },
              { title: "Professional & Experienced Team", icon: "bi-people-fill", color: "text-cyan-500", bg: "bg-cyan-50" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <i className={`bi ${item.icon} ${item.color} text-xl`}></i>
                </div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET OUR TEAM - Staff Carousel */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">MEET OUR TEAM</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-6 sm:mb-8 max-w-xl mx-auto">Get to know the dedicated professionals behind MBPP</p>
          <AutoCarousel items={staffItems} heightClass="h-80 sm:h-96" />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-10">WHY CHOOSE US?</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { text: "Professional & experienced team", icon: "bi-award-fill", color: "text-amber-500" },
              { text: "Proven track record", icon: "bi-trophy-fill", color: "text-emerald-500" },
              { text: "High-quality materials & workmanship", icon: "bi-tools", color: "text-blue-500" },
              { text: "Timely project completion", icon: "bi-clock-fill", color: "text-purple-500" },
              { text: "Customer satisfaction is our priority", icon: "bi-heart-fill", color: "text-rose-500" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <i className={`bi ${item.icon} ${item.color} text-lg`}></i>
                </div>
                <p className="text-sm font-medium text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      {socialLinks.length > 0 && (
        <section className="bg-gray-950 py-14">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Connect With Us</h2>
            <p className="text-gray-400 text-sm mb-8">Follow us on social media for updates and new listings</p>
            <div className="flex items-center justify-center gap-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-white hover:text-gray-950 hover:border-white transition-all duration-200"
                  aria-label={s.label}
                >
                  {SOCIAL_ICONS[s.icon] || s.label[0]}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Find Property in Northern Nigeria</h2>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">Whether you are looking to buy, rent, or sell — we have verified properties across Northern Nigeria. Gidan siyarwa, gidan haya, flats, land, and commercial spaces.</p>
          <div className="flex flex-wrap gap-2">
            {["House for sale", "Gidan siyarwa", "House for rent", "Gidan haya", "Flat", "Land for sale", "Plaza", "Shop", "Commercial property", "Sell house", "Sayar da gida", "Siyan gida"].map(tag => (
              <Link key={tag} href={`/list-property?search=${encodeURIComponent(tag)}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
