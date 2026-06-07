"use client";
import { useEffect, useRef } from "react";
import { Listing } from "@/lib/types";

interface MapViewProps {
  listings: Listing[];
  height?: string;
}

function priceBucket(p: number): { fill: string } {
  if (p < 5_000_000) return { fill: "#0d6b3d" };
  if (p < 15_000_000) return { fill: "#2563eb" };
  if (p < 30_000_000) return { fill: "#f59e0b" };
  return { fill: "#dc2626" };
}

function makeIcon(price: number): { html: string; className: string; iconSize: [number, number]; iconAnchor: [number, number] } {
  const { fill } = priceBucket(price);
  const label = price >= 1_000_000 ? `₦${(price / 1_000_000).toFixed(price >= 10_000_000 ? 0 : 1)}M` : `₦${(price / 1_000).toFixed(0)}K`;
  const html = `<div style="display:inline-block;position:relative;">
    <div style="background:${fill};color:#fff;border-radius:9999px;padding:6px 12px;font-weight:700;font-size:11px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25);border:2px solid #fff;font-family:system-ui;">${label}</div>
    <div style="position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid ${fill};"></div>
  </div>`;
  return { html, className: "mbpp-pin", iconSize: [50, 30], iconAnchor: [25, 30] };
}

export default function MapView({ listings, height = "calc(100vh - 12rem)" }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      await import("leaflet/dist/leaflet.css");
      const leaflet = await import("leaflet");
      const L = (leaflet as any).default || leaflet;
      LRef.current = L;
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, { scrollWheelZoom: true, zoomControl: true }).setView([12.0, 8.5167], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      updateMarkers();
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  function updateMarkers() {
    if (!mapRef.current || !LRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const L = LRef.current;
    const bounds: [number, number][] = [];
    listings.forEach(l => {
      const lat = l.lat;
      const lng = l.lng;
      if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) return;
      const iconDef = makeIcon(l.price);
      const m = L.marker([lat, lng], { icon: L.divIcon(iconDef) }).addTo(mapRef.current);
      const photo = (l.photos && l.photos[0] && l.photos[0].url) || "";
      const popup = `<div style="min-width:200px;font-family:system-ui">
        ${photo ? `<img src="${photo}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />` : ""}
        <a href="/listings/${l.id}" style="font-weight:600;font-size:13px;color:#0d6b3d;text-decoration:none;display:block;margin-bottom:2px;">${l.title}</a>
        <p style="font-size:11px;color:#6b7280;margin:0 0 4px;">${l.city}</p>
        <p style="font-size:13px;font-weight:700;color:#111;margin:0;">₦${l.price.toLocaleString()}</p>
      </div>`;
      m.bindPopup(popup);
      markersRef.current.push(m);
      bounds.push([lat, lng]);
    });
    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }
  }

  useEffect(() => {
    if (mapRef.current) updateMarkers();
  }, [listings]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className="rounded-2xl overflow-hidden border border-gray-200 z-0"
    />
  );
}
