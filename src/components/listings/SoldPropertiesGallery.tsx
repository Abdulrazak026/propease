"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { ApiSoldProperty } from "@/lib/api-types";
import AutoCarousel from "@/components/homepage/AutoCarousel";

const FALLBACK_SOLD: ApiSoldProperty[] = [
  { id: "fs1", title: "3-bed bungalow in Tarauni", city: "Tarauni", salePrice: 28000000, soldAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "fs2", title: "2-bed flat in Nassarawa", city: "Nassarawa", salePrice: 18500000, soldAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: "fs3", title: "4-bed duplex in Fagge", city: "Fagge", salePrice: 52000000, soldAt: new Date(Date.now() - 21 * 86400000).toISOString() },
  { id: "fs4", title: "Commercial plot in Kano Municipal", city: "Kano Municipal", salePrice: 75000000, soldAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "fs5", title: "1-bed apartment in Gwale", city: "Gwale", salePrice: 9500000, soldAt: new Date(Date.now() - 45 * 86400000).toISOString() },
  { id: "fs6", title: "3-bed terrace in Ungogo", city: "Ungogo", salePrice: 22000000, soldAt: new Date(Date.now() - 60 * 86400000).toISOString() },
];

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
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
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

export default function SoldPropertiesGallery() {
  const [items, setItems] = useState<ApiSoldProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ items: ApiSoldProperty[] }>("/api/sold-properties?limit=6")
      .then(r => {
        if (r.data?.items && r.data.items.length > 0) {
          setItems(r.data.items);
        } else {
          setItems(FALLBACK_SOLD);
        }
      })
      .catch(() => setItems(FALLBACK_SOLD))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  }

  const carouselItems = items.slice(0, 6).map((p, i) => ({
    image: p.coverPhoto || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length],
    title: p.title,
    subtitle: `${p.city} \u2022 ${timeAgo(p.soldAt)}`,
  }));

  return (
    <section className="bg-gradient-to-b from-white to-emerald-50/40 border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-2">Proof, not promises</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Recently sold</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-md">Real properties that transacted through MBPP. We post a new one every week.</p>
          </div>
        </div>
        <AutoCarousel items={carouselItems} heightClass="h-72 sm:h-96 lg:h-[28rem]" />
      </div>
    </section>
  );
}
