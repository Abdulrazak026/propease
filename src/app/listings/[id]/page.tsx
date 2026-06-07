import type { Metadata } from "next";

const API = "https://propease-production.up.railway.app";
const SITE_URL = "https://mbpproperties.com";
const BACKEND = "https://propease-production.up.railway.app";

function resolveImg(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND}${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(`${API}/api/listings/${id}`);
    if (!res.ok) return { title: "Property | MBPP" };
    const data = await res.json();
    const l = data.listing || data;
    const imageUrl = l.photos?.[0]?.url ? [resolveImg(l.photos[0].url)] : [];
    return {
      title: `${l.title} | MBPP`,
      description: l.description?.slice(0, 160) || "Property listing on MBPP",
      alternates: { canonical: `${SITE_URL}/listings/${id}` },
      openGraph: {
        title: l.title,
        description: l.description?.slice(0, 160),
        images: imageUrl,
        type: "website",
        url: `${SITE_URL}/listings/${id}`,
      },
      twitter: { card: "summary_large_image", title: l.title, description: l.description?.slice(0, 160), images: imageUrl },
    };
  } catch {
    return { title: "Property | MBPP" };
  }
}

import ListingDetail from "./ListingDetail";

export default function Page() {
  return <ListingDetail />;
}