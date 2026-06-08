import type { Metadata } from "next";

const SITE_URL = "https://mbpproperties.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Property | MBPP",
    description: "Property listing details",
    alternates: { canonical: `${SITE_URL}/listings/${id}` },
    openGraph: {
      title: "Property | MBPP",
      description: "Property listing details",
      type: "website",
      url: `${SITE_URL}/listings/${id}`,
    },
  };
}

import ListingDetail from "./ListingDetail";

export default function Page() {
  return <ListingDetail />;
}