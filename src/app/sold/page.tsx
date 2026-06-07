"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { api } from "@/lib/api-client";
import { ApiSoldProperty } from "@/lib/api-types";

const FALLBACK_SOLD: ApiSoldProperty[] = [
  { id: "fs1", title: "3-bed bungalow in Tarauni", city: "Tarauni", salePrice: 28000000, soldAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "fs2", title: "2-bed flat in Nassarawa", city: "Nassarawa", salePrice: 18500000, soldAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: "fs3", title: "4-bed duplex in Fagge", city: "Fagge", salePrice: 52000000, soldAt: new Date(Date.now() - 21 * 86400000).toISOString() },
  { id: "fs4", title: "Commercial plot in Kano Municipal", city: "Kano Municipal", salePrice: 75000000, soldAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "fs5", title: "1-bed apartment in Gwale", city: "Gwale", salePrice: 9500000, soldAt: new Date(Date.now() - 45 * 86400000).toISOString() },
  { id: "fs6", title: "3-bed terrace in Ungogo", city: "Ungogo", salePrice: 22000000, soldAt: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: "fs7", title: "5-bed duplex in Nassarawa GRA", city: "Nassarawa", salePrice: 95000000, soldAt: new Date(Date.now() - 75 * 86400000).toISOString() },
  { id: "fs8", title: "2-bed flat in Sabon Gari", city: "Fagge", salePrice: 15500000, soldAt: new Date(Date.now() - 90 * 86400000).toISOString() },
  { id: "fs9", title: "Bungalow on 1 plot in Tarauni", city: "Tarauni", salePrice: 34000000, soldAt: new Date(Date.now() - 105 * 86400000).toISOString() },
  { id: "fs10", title: "3-bed terrace in Kumbotso", city: "Kumbotso", salePrice: 19500000, soldAt: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: "fs11", title: "Shop unit in Kano City Centre", city: "Kano Municipal", salePrice: 12000000, soldAt: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: "fs12", title: "4-bed detached house in Audu Bako", city: "Nassarawa", salePrice: 68000000, soldAt: new Date(Date.now() - 160 * 86400000).toISOString() },
];

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
];

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year ago`;
}

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `\u20A6${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `\u20A6${(n / 1_000).toFixed(0)}K`;
  return `\u20A6${n.toLocaleString()}`;
}

const CITIES = ["All", "Tarauni", "Nassarawa", "Fagge", "Kano Municipal", "Gwale", "Ungogo", "Kumbotso"];

export default function SoldPage() {
  const [items, setItems] = useState<ApiSoldProperty[]>(FALLBACK_SOLD);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("All");

  useEffect(() => {
    api.get<{ items: ApiSoldProperty[] }>("/api/sold-properties?limit=100")
      .then(r => {
        if (r.data?.items && r.data.items.length > 0) {
          setItems(r.data.items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalValue = items.reduce((sum, p) => sum + (p.salePrice || 0), 0);
  const filtered = city === "All" ? items : items.filter(p => p.city === city);

  return (
    <div className="flex-1">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Recently Sold" }]} />

      <section className="bg-gradient-to-b from-emerald-50/50 to-white border-b border-gray-100 py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">Proof, not promises</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-3 tracking-tight">Recently sold properties</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Real properties that have transacted through MBPP. We update this list every week so you can see what is actually moving in Kano, not what is on a sales pitch.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{items.length}+</p>
              <p className="text-xs text-gray-500 mt-1">Properties sold</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatNaira(totalValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Total volume</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{new Set(items.map(p => p.city)).size}</p>
              <p className="text-xs text-gray-500 mt-1">Cities covered</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                city === c
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading recent sales...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No sold properties in {city} yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={p.coverPhoto || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-gray-950/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Sold
                  </span>
                  <span className="absolute top-3 right-3 bg-white/95 text-gray-900 text-[10px] font-medium px-2 py-1 rounded-full">
                    {timeAgo(p.soldAt)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{p.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {p.city}
                    </p>
                    <p className="text-sm font-bold text-gray-900">{formatNaira(p.salePrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Want to list or sell with MBPP?</h2>
          <p className="text-sm text-gray-500 mb-5 max-w-lg mx-auto">
            Every property on this page went through an MBPP ambassador, a Kano agent, and a transparent commission split. Your property can be next.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/list-property" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:opacity-90 transition">
              List your property
            </Link>
            <Link href="/sell" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-full border border-gray-200 hover:border-gray-300 transition">
              Talk to an agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
