import type { Metadata } from "next";

const SITE_URL = "https://mbpproperties.com";
const API = "https://propease-production.up.railway.app";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let title = "Property | MBPP";
  let description = "Property listing details";
  let image: string | undefined;

  try {
    const res = await fetch(`${API}/api/listings/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const listing = data.listing || data;
      if (listing) {
        title = `${listing.title} | MBPP`;
        description = listing.description?.slice(0, 200) || `${listing.propertyType} in ${listing.city || "Kano"}`;
        image = listing.photos?.[0]?.url;
      }
    }
  } catch {}

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/listings/${id}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/listings/${id}`,
      images: image ? [image.startsWith("http") ? image : `${API}/uploads/${image}`] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image.startsWith("http") ? image : `${API}/uploads/${image}`] : [],
    },
  };
}

import ListingDetail from "./ListingDetail";

export default function Page() {
  return <ListingDetail />;
}
