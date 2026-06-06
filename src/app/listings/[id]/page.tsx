import type { Metadata } from "next";

const API = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(`${API}/api/listings/${id}`);
    if (!res.ok) return { title: "Property — MBPP" };
    const data = await res.json();
    const l = data.listing || data;
    return {
      title: `${l.title} — MBPP`,
      description: l.description?.slice(0, 160) || "Property listing on MBPP",
      openGraph: {
        title: l.title,
        description: l.description?.slice(0, 160),
        images: l.photos?.[0]?.url ? [l.photos[0].url] : [],
        type: "website",
      },
      twitter: { card: "summary_large_image", title: l.title, description: l.description?.slice(0, 160), images: l.photos?.[0]?.url ? [l.photos[0].url] : [] },
    };
  } catch {
    return { title: "Property — MBPP" };
  }
}

import ListingDetail from "./ListingDetail";

export default function Page() {
  return <ListingDetail />;
}