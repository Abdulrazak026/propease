import type { Metadata } from "next";

const SITE_URL = "https://mbpproperties.com";
const API = "https://propease-production.up.railway.app";

async function getPublicSettings() {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return (await res.json()).settings || {};
  } catch { return {}; }
}

async function getListing(id: string) {
  try {
    const res = await fetch(`${API}/api/listings/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.listing || data;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  const title = listing ? `${listing.title} | MBPP` : "Property | MBPP";
  const description = listing ? (listing.description?.slice(0, 200) || `${listing.propertyType} in ${listing.city || "Kano"}`) : "Property listing details";
  const image = listing?.photos?.[0]?.url;

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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, settings] = await Promise.all([getListing(id), getPublicSettings()]);

  const schema = listing && settings.seo_property_schema_enabled !== "false" ? {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    url: `${SITE_URL}/listings/${id}`,
    description: listing.description?.slice(0, 500) || `${listing.propertyType} in ${listing.city || "Kano"}`,
    offers: {
      "@type": "Offer",
      price: listing.price?.toString() || "0",
      priceCurrency: settings.currency || "NGN",
      availability: listing.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address || listing.city || "Kano",
      addressLocality: listing.city || "Kano",
      addressRegion: settings.seo_schema_state || "Kano State",
      addressCountry: settings.seo_schema_country || "NG",
    },
  } : null;

  return (
    <>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <ListingDetail />
    </>
  );
}
