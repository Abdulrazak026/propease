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
  facebook: <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  instagram: <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  tiktok: <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.58-1.42V6.69h3.58z"/></svg>,
  whatsapp: <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

export default function HomePage() {
  const { get: getSetting, loading: settingsLoading } = useSettings();
  const { currentUser, isAuthenticated, logout, role } = useRole();
  const heroImage = getSetting("hero_image") || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=900&fit=crop";
  const siteName = getSetting("site_name", "MBPP");
  const siteTagline = getSetting("site_tagline", "Find Your Dream Property in Kano & Northern States");
  const heroRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [activeCategory, setActiveCategory] = useState("");
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-advance carousel for Why Buy + Flyer
  useEffect(() => {
    const hasFlyer = !!getSetting("flyer_image");
    if (!hasFlyer) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, [getSetting]);

  const { listings, loading, filters, setFilters } = useListings();

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
  const whatsappUrl = getSetting("whatsapp_url");

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
      <section ref={heroRef} className="relative bg-brand-dark overflow-hidden">
        <div className="absolute inset-0">
          {!settingsLoading && <img src={heroImage} alt="MBPP Properties - Find verified houses, land and flats in Kano & Northern States, Nigeria" className="w-full h-full object-cover opacity-80 transition-opacity duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/10 via-brand-dark/5 to-brand-dark/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent)_0%,_transparent_60%)] opacity-25 mix-blend-screen" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24" style={{ opacity: heroOpacity }}>
          <div className="flex flex-col justify-center items-center text-center min-h-[25vh] sm:min-h-[30vh] mt-6 sm:mt-4 px-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight max-w-3xl" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
              Find Your Properties in Kano &amp; Other Northern States
            </h2>
            <p className="text-base sm:text-lg text-white/90 mt-3 sm:mt-4 max-w-2xl leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
              Buy, rent, or sell verified properties across Northern Nigeria with confidence.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-around rounded-xl bg-gray-50/50 px-3 py-2.5">
            {[
              { v: "30+", l: "Properties", icon: "bi-shield-check" },
              { v: "14", l: "Areas", icon: "bi-buildings" },
              { v: "4", l: "Cities", icon: "bi-geo-alt" },
              { v: "100+", l: "Clients", icon: "bi-people" },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-blue text-brand-gold rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                  <i className={`bi ${s.icon} text-xs sm:text-base`}></i>
                </div>
                <div>
                  <p className="text-sm sm:text-lg font-extrabold text-brand-blue leading-tight">{s.v}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wider">{s.l}</p>
                </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue text-brand-gold rounded-xl flex items-center justify-center shrink-0">
                <i className="bi bi-shield-fill-check text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-brand-blue">VERIFIED PROPERTIES</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Every property we sell is 100% verified through due diligence and transparency.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue text-brand-gold rounded-xl flex items-center justify-center shrink-0">
                <i className="bi bi-shield-check text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-brand-blue">OUR PROMISE TO YOU</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">For any issue related to purchased properties, MBPP takes 100% responsibility. Your peace of mind is our commitment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl font-bold text-brand-blue text-center mb-4 sm:mb-5">WHAT WE OFFER</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 p-4 sm:p-5 divide-y divide-gray-100">
            {[
              { icon: "bi-map-fill", title: "WE SELL LANDS", desc: "Genuine plots in prime locations with secure titles" },
              { icon: "bi-house-fill", title: "WE BUILD HOUSES", desc: "From foundation to finishing, we build quality homes tailored to your needs" },
              { icon: "bi-buildings-fill", title: "WE SELL COMPLETED HOUSES", desc: "Move-in ready homes with modern finishing and quality construction" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 sm:py-3.5 first:pt-0 last:pb-0">
                <div className="w-9 h-9 bg-brand-blue text-brand-gold rounded-lg flex items-center justify-center shrink-0">
                  <i className={`bi ${item.icon} text-sm`}></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-blue">{item.title}</p>
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

      {/* WHY BUY FROM MBPP? + FLYER — Swipeable */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Side: Why Buy from MBPP? + Flyer Carousel */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-2xl font-black text-brand-blue mb-2 tracking-tight">WHY BUY FROM MBPP?</h3>
              <p className="text-sm text-slate-500">We offer the most comprehensive real estate solution structures in Northern Nigeria.</p>
            </div>

            {/* Auto-advancing carousel: features + flyer */}
            <div className="relative flex-1">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {/* Slide 1: Features */}
                <div className={`transition-opacity duration-500 ${currentSlide === 0 ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}>
                  <div className="p-6 space-y-5">
                    {[
                      { icon: "bi-shield-fill-check", title: "Verified & Genuine Properties", desc: "Absolute assurance with fully documented ownership papers and title deeds." },
                      { icon: "bi-geo-alt-fill", title: "Prime Locations in Kano", desc: "Strategically situated within high capital appreciation corridors." },
                      { icon: "bi-tools", title: "Quality Construction & Finishing", desc: "Unmatched, durability-focused construction quality controlled by experts." },
                      { icon: "bi-receipt", title: "Flexible Payment Options", desc: "Accessible, custom payment plans optimized around client cashflows." },
                      { icon: "bi-person-badge-fill", title: "Professional & Experienced Team", desc: "Guidance from real estate agents who understand local market conditions." },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3 items-start">
                        <div className="w-9 h-9 bg-brand-blue text-brand-gold rounded-lg flex items-center justify-center shrink-0">
                          <i className={`bi ${item.icon} text-sm`}></i>
                        </div>
                        <div>
                          <h5 className="font-bold text-brand-blue text-sm">{item.title}</h5>
                          <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 2: Flyer */}
                {getSetting("flyer_image") && (
                  <div className={`transition-opacity duration-500 ${currentSlide === 1 ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}>
                    <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
                      <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">Promotional Flyer</p>
                      <div className="cursor-pointer w-full" onClick={() => setFlyerOpen(true)}>
                        <img src={getSetting("flyer_image")} alt="Promotional Flyer" className="w-full h-auto rounded-xl shadow-md hover:shadow-lg transition-shadow" />
                      </div>
                      <p className="text-xs text-gray-400 mt-3">Tap to enlarge</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dots indicator */}
              {getSetting("flyer_image") && (
                <div className="flex justify-center gap-2 mt-4">
                  <button onClick={() => setCurrentSlide(0)} className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === 0 ? "bg-brand-blue w-6" : "bg-gray-300"}`}></button>
                  <button onClick={() => setCurrentSlide(1)} className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === 1 ? "bg-brand-blue w-6" : "bg-gray-300"}`}></button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Meet our Team — Dark Card */}
          <div className="lg:col-span-7 bg-brand-dark text-white rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl"></div>

            <div>
              <span className="text-brand-gold font-bold text-xs uppercase tracking-widest block mb-1">Our Leadership</span>
              <h3 className="text-2xl font-black mb-8">MEET OUR TOP TEAM</h3>
            </div>

            <div className={`grid gap-6 ${showAllTeam && staffItems.length > 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-3"}`}>
              {(showAllTeam ? staffItems : staffItems.slice(0, 3)).map((m, i) => {
                const name = m.title;
                const role = m.subtitle;
                const photo = teamMembers[i]?.photo;
                return (
                  <div key={name} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition group">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-brand-gold/50 group-hover:border-brand-gold transition duration-300 mb-4">
                      {photo ? (
                        <img src={resolveImageUrl(photo) || ""} alt={name} className="w-full h-full object-cover object-top" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center text-white font-bold text-lg">
                          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-white leading-tight">{name}</h4>
                    <p className="text-xs text-brand-gold mt-1">{role}</p>
                  </div>
                );
              })}
            </div>

            {staffItems.length > 3 && (
              <div className="mt-8 border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-xs text-slate-400">Mutual Benefit Premier Properties Ltd.</span>
                <button
                  onClick={() => setShowAllTeam(!showAllTeam)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-brand-gold border border-brand-gold/30 rounded-full hover:bg-brand-gold/10 transition-all"
                >
                  {showAllTeam ? "Show less" : "View all members"}
                  <svg className={`w-3 h-3 transition-transform ${showAllTeam ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            )}
            {staffItems.length <= 3 && (
              <div className="mt-8 border-t border-white/10 pt-4 flex justify-between items-center text-xs text-slate-400">
                <span>Mutual Benefit Premier Properties Ltd.</span>
                <span className="flex gap-1.5">
                  {staffItems.map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-brand-gold" : "bg-slate-500"}`}></span>
                  ))}
                </span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-brand-blue mb-2">Connect With Us</h2>
          <p className="text-gray-500 text-sm mb-8">Follow us on social media for updates and new listings</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { label: "Facebook", icon: "facebook", url: facebookUrl },
              { label: "Instagram", icon: "instagram", url: instagramUrl },
              { label: "TikTok", icon: "tiktok", url: tiktokUrl },
              { label: "WhatsApp", icon: "whatsapp", url: whatsappUrl },
            ].map((s) => (
              <a
                key={s.label}
                href={s.url || "#"}
                target={s.url ? "_blank" : undefined}
                rel={s.url ? "noopener noreferrer" : undefined}
                className={`w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                  s.url
                    ? "text-brand-blue hover:bg-brand-blue hover:text-brand-gold hover:border-brand-blue cursor-pointer"
                    : "text-gray-300 cursor-default"
                }`}
                aria-label={s.label}
                onClick={s.url ? undefined : (e) => e.preventDefault()}
              >
                {SOCIAL_ICONS[s.icon] || s.label[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Flyer Lightbox Modal */}
      {flyerOpen && getSetting("flyer_image") && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setFlyerOpen(false)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setFlyerOpen(false)} className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-medium">
              Close ✕
            </button>
            <img src={getSetting("flyer_image")} alt="Promotional Flyer" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
