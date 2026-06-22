"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyFilters from "@/components/listings/PropertyFilters";
import { useListings } from "@/hooks/useListings";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/context/SettingsContext";
import { useRole } from "@/context/RoleContext";
import SoldPropertiesGallery from "@/components/listings/SoldPropertiesGallery";
import AutoCarousel, { CarouselItem } from "@/components/homepage/AutoCarousel";
import { resolveImageUrl } from "@/lib/utils";

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
  whatsapp: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

const PRIMARY_LINKS = [
  { label: "Buy", href: "/list-property" },
  { label: "Rental", href: "/list-property?type=rent" },
  { label: "Sell", href: "/sell" },
];

const HERO_MORE_ITEMS = (isAuth: boolean, isAdmin: boolean) => [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  ...(isAuth && isAdmin ? [{ label: "Dashboard", href: "/admin" }] : []),
  ...(!isAuth ? [{ label: "Sign In", href: "/login" }] : []),
  ...(isAuth ? [{ label: "Sign Out", href: "/", action: "logout" as const }] : []),
];

export default function HomePage() {
  const { get: getSetting, loading: settingsLoading } = useSettings();
  const { currentUser, isAuthenticated, logout, role } = useRole();
  const heroImage = getSetting("hero_image") || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=900&fit=crop";
  const siteName = getSetting("site_name", "MBPP");
  const siteTagline = getSetting("site_tagline", "Find Your Dream Property in Kano & Northern States");
  const heroRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroMoreOpen, setHeroMoreOpen] = useState(false);
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [cities, setCities] = useState<City[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  let researchReports: ResearchReport[] = [];
  try { const raw = getSetting("research_reports"); if (raw) researchReports = JSON.parse(raw); } catch {}

  let teamMembers: TeamMember[] = [];
  try { const raw = getSetting("team_members"); if (raw) teamMembers = JSON.parse(raw); } catch {}

  let completedProjects: CarouselItem[] = [];
  try { const raw = getSetting("completed_projects"); if (raw) completedProjects = JSON.parse(raw); } catch {}

  let developmentsProjects: CarouselItem[] = [];
  try { const raw = getSetting("developments_in_progress"); if (raw) developmentsProjects = JSON.parse(raw); } catch {}

  useEffect(() => {
    const handler = () => {
      setHeroOpacity(Math.max(0, Math.min(1, 1 - window.scrollY / (window.innerHeight * 0.6))));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      const el = document.getElementById("hero-more");
      if (el && !el.contains(e.target as Node)) setHeroMoreOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
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
      state: next.state || "",
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
  const whatsappUrl = getSetting("whatsapp_url");

  const socialLinks = [
    { url: facebookUrl, label: "Facebook", icon: "facebook" },
    { url: instagramUrl, label: "Instagram", icon: "instagram" },
    { url: tiktokUrl, label: "TikTok", icon: "tiktok" },
    { url: whatsappUrl, label: "WhatsApp", icon: "whatsapp" },
    { url: linkedinUrl, label: "LinkedIn", icon: "linkedin" },
    { url: twitterUrl, label: "Twitter", icon: "twitter" },
  ].filter(s => s.url);

  const staffItems = (teamMembers.length > 0 ? teamMembers : [
    { name: "Aisha Bello", role: "CEO / Lead Consultant", photo: "" },
    { name: "Ahmad Abubakar", role: "Head of Operations", photo: "" },
    { name: "Zahradden Aliyu", role: "Senior Property Manager", photo: "" },
  ]).map(m => ({
    image: m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6366f1&color=fff&size=200`,
    title: m.name,
    subtitle: m.role,
  }));

  return (
    <div className="flex flex-col">
      <section ref={heroRef} className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          {!settingsLoading && <img src={heroImage} alt="MBPP Properties - Find verified houses, land and flats in Kano & Northern States, Nigeria" className="w-full h-full object-cover opacity-65 transition-opacity duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/25 to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-25 mix-blend-screen" />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24" style={{ opacity: heroOpacity }}>
          {/* Top-left links */}
          <div className="absolute top-4 left-5 sm:left-6 lg:left-10 flex items-center gap-2 sm:gap-3 z-10">
            {PRIMARY_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="bg-black/40 backdrop-blur-sm text-white/90 hover:text-white text-sm sm:text-base font-semibold tracking-wide uppercase px-4 py-2 rounded-full transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Top-right hamburger */}
          <div className="absolute top-4 right-5 sm:right-6 lg:right-10 z-10" id="hero-more">
            <button
              onClick={() => setHeroMoreOpen(!heroMoreOpen)}
              className="bg-black/40 backdrop-blur-sm text-white/90 hover:text-white rounded-full transition-colors w-10 h-10 flex items-center justify-center"
              aria-label="More"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {heroMoreOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-900/5 p-3 z-50">
                {HERO_MORE_ITEMS(!!isAuthenticated, role === "head" || role === "admin" || role === "ambassador" || role === "agent").map((item) => (
                  item.action === "logout" ? (
                    <button
                      key="logout"
                      onClick={() => { setHeroMoreOpen(false); logout(); }}
                      className="w-full text-left block px-5 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setHeroMoreOpen(false)}
                      className="block px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center text-center min-h-[25vh] sm:min-h-[30vh] mt-10 sm:mt-6">
            <img
              src={getSetting("site_logo") || `https://mbpproperties.com/api/upload/file/7ea15ec8-11b2-4c34-a855-1469d56656a5.png`}
              alt={siteName}
              className="h-36 sm:h-44 lg:h-56 w-auto rounded-lg object-contain mb-4 sm:mb-6"
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight max-w-3xl">
              Find Your Properties in Kano & Other Northern States
            </h2>
            <p className="text-sm sm:text-base text-white/60 mt-3 sm:mt-4 max-w-2xl leading-relaxed">
              Whether you are looking to buy, rent, or sell, we have verified properties across Northern Nigeria. Gidan siyarwa, gidan haya, flats, land, and commercial spaces.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between rounded-xl bg-gray-50/50 px-4 py-3">
            {[
              { v: "30+", l: "Properties", icon: "bi-shield-check", c: "text-[var(--color-primary)]" },
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

      {/* VERIFIED PROPERTIES + OUR PROMISE TO YOU */}
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <i className="bi bi-shield-fill-check text-[var(--color-primary)] text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">VERIFIED PROPERTIES</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Every property we sell is 100% verified through due diligence and transparency.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="bi bi-shield-check text-amber-600 text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">OUR PROMISE TO YOU</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">For any issue related to purchased properties, MBPP takes 100% responsibility. Your peace of mind is our commitment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-4 sm:mb-5">WHAT WE OFFER</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 p-4 sm:p-5 divide-y divide-gray-100">
            {[
              { icon: "bi-map-fill", color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary)]/10", title: "WE SELL LANDS", desc: "Genuine plots in prime locations with secure titles" },
              { icon: "bi-house-fill", color: "text-blue-600", bg: "bg-blue-50", title: "WE BUILD HOUSES", desc: "From foundation to finishing, we build quality homes tailored to your needs" },
              { icon: "bi-buildings-fill", color: "text-purple-600", bg: "bg-purple-50", title: "WE SELL COMPLETED HOUSES", desc: "Move-in ready homes with modern finishing and quality construction" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 sm:py-3.5 first:pt-0 last:pb-0">
                <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <i className={`bi ${item.icon} ${item.color} text-sm`}></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR COMPLETED PROJECTS */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">OUR COMPLETED PROJECTS</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-6 sm:mb-8 max-w-xl mx-auto">Take a look at some of our delivered projects across Kano &amp; Northern Nigeria</p>
          <AutoCarousel items={completedProjects.length > 0 ? completedProjects : PLACEHOLDER_PROJECTS} heightClass="h-72 sm:h-96 lg:h-[28rem]" />
        </div>
      </section>

      {/* OUR DEVELOPMENTS IN PROGRESS */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4">OUR DEVELOPMENTS IN PROGRESS</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-6 sm:mb-8 max-w-xl mx-auto">Ongoing projects taking shape across prime locations</p>
          <AutoCarousel items={developmentsProjects.length > 0 ? developmentsProjects : PLACEHOLDER_DEVELOPMENTS} heightClass="h-72 sm:h-96 lg:h-[28rem]" />
        </div>
      </section>

      {/* WHY BUY FROM MBPP */}
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-4 sm:mb-5">WHY BUY FROM MBPP?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { title: "Verified & Genuine", icon: "bi-shield-fill-check", color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary)]/10" },
              { title: "Prime Locations", icon: "bi-geo-alt-fill", color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Northern Nigeria Focus", icon: "bi-buildings", color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Quality Finishing", icon: "bi-star-fill", color: "text-amber-500", bg: "bg-amber-50" },
              { title: "Flexible Payment", icon: "bi-credit-card", color: "text-rose-500", bg: "bg-rose-50" },
              { title: "Expert Team", icon: "bi-people-fill", color: "text-cyan-500", bg: "bg-cyan-50" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <i className={`bi ${item.icon} ${item.color} text-sm`}></i>
                </div>
                <p className="text-[11px] font-semibold text-gray-900 leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLYER */}
      {getSetting("flyer_image") && (
        <section className="bg-white py-10 sm:py-16">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">PROMOTIONAL FLYER</h2>
            <div className="max-w-3xl mx-auto cursor-pointer" onClick={() => setFlyerOpen(true)}>
              <img src={getSetting("flyer_image")} alt="Promotional Flyer" className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow" />
            </div>
          </div>
          {flyerOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setFlyerOpen(false)}>
              <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setFlyerOpen(false)} className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-medium">
                  Close ✕
                </button>
                <img src={getSetting("flyer_image")} alt="Promotional Flyer" className="w-full h-auto max-h-[85vh] object-contain rounded-xl scale-100 animate-in" />
              </div>
            </div>
          )}
        </section>
      )}

      {/* MEET OUR TEAM */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3 text-center">The team</p>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4 tracking-tight leading-[1.15]">Meet Our Team</h2>
          <p className="text-xs sm:text-base text-gray-500 text-center mb-8 sm:mb-12 max-w-xl mx-auto">Get to know the dedicated professionals behind MBPP</p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-10 max-w-3xl mx-auto">
            {staffItems.map((m, i) => {
              const isLead = i === 0;
              const name = m.title;
              const role = m.subtitle;
              const photo = teamMembers[i]?.photo;
              const bio = teamMembers[i]?.bio;
              return (
                <div
                  key={name}
                  className={`group flex gap-4 p-3 -m-3 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-gray-900/5 hover:-translate-y-0.5 cursor-default ${
                    isLead ? "sm:col-span-2 sm:items-center bg-gradient-to-br from-blue-50/60 to-white border border-blue-100/60" : ""
                  }`}
                  style={{ animation: `fadeUp 0.5s ease-out ${i * 60}ms both` }}
                >
                  <div className={`shrink-0 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 overflow-hidden ring-2 ring-white shadow-md shadow-gray-900/5 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/20 ${
                    isLead ? "w-24 h-24 sm:w-32 sm:h-32 text-lg" : "w-24 h-24 sm:w-28 sm:h-28 text-base"
                  }`}>
                    {photo ? (
                      <img src={resolveImageUrl(photo) || ""} alt={name} className="w-full h-full object-cover object-top" loading="lazy" />
                    ) : (
                      name.split(" ").map(n => n[0]).join("").slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold text-gray-900 leading-tight transition-colors duration-300 group-hover:text-[var(--color-primary)] ${isLead ? "text-lg sm:text-xl" : "text-base"}`}>{name}</p>
                      {isLead && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-semibold uppercase tracking-wider">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118L10 14.347l-3.37 2.448c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.644 8.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                          Lead
                        </span>
                      )}
                    </div>
                    <p className={`text-[var(--color-primary)] font-medium mb-1 mt-0.5 ${isLead ? "text-sm" : "text-xs"}`}>{role}</p>
                    {bio && <p className={`text-gray-500 leading-relaxed ${isLead ? "text-base" : "text-sm"}`}>{bio}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      {socialLinks.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Connect With Us</h2>
            <p className="text-gray-500 text-sm mb-8">Follow us on social media for updates and new listings</p>
            <div className="flex items-center justify-center gap-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                  aria-label={s.label}
                >
                  {SOCIAL_ICONS[s.icon] || s.label[0]}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
