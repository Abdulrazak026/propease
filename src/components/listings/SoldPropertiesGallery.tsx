"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { ApiSoldProperty } from "@/lib/api-types";
import AutoCarousel from "@/components/homepage/AutoCarousel";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year ago`;
}

export default function SoldPropertiesGallery() {
  const [items, setItems] = useState<ApiSoldProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ items: ApiSoldProperty[] }>("/api/sold-properties?limit=6")
      .then(r => {
        if (r.data?.items && r.data.items.length > 0) {
          setItems(r.data.items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) {
    return null;
  }

  const carouselItems = items.slice(0, 6).map((p) => ({
    image: p.coverPhoto || "",
    title: p.title,
    subtitle: `${p.city} \u2022 ${timeAgo(p.soldAt)}`,
  }));

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-[0.15em] mb-2">Proof, not promises</p>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-blue tracking-tight">Recently sold</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-md">Real properties that transacted through MBPP.</p>
          </div>
        </div>
        <AutoCarousel items={carouselItems} heightClass="h-72 sm:h-96 lg:h-[28rem]" />
      </div>
    </section>
  );
}
