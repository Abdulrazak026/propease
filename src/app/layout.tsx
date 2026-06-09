import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "@/components/layout/ClientBody";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const API = "https://propease-production.up.railway.app";

async function getPublicSettings() {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return (await res.json()).settings || {};
  } catch { return {}; }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings();
  return {
    title: s.meta_title || "MBPP Properties | Buy, Rent & Sell Houses in Kano | Gidan Siyarwa Kano",
    description: s.meta_description || "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria. Gidan siyarwa Kano, gidan haya, property for sale, house for rent.",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/favicon.svg",
      apple: "/icons/icon-192x192.png",
    },
    openGraph: {
      title: s.meta_title || "MBPP",
      description: s.meta_description || "",
      images: s.og_image ? [s.og_image] : [],
      siteName: s.site_name || "MBPP",
      type: "website",
      url: s.seo_canonical_url || "https://mbpproperties.com/",
      locale: s.seo_og_locale || "en_NG",
    },
    twitter: { card: "summary_large_image", title: s.meta_title || "MBPP", description: s.meta_description || "", images: s.og_image ? [s.og_image] : [] },
    alternates: { canonical: s.seo_canonical_url || "https://mbpproperties.com/" },
    other: {
      "theme-color": s.primary_color || "#0D6B3D",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": s.site_name || "MBPP",
      ...(s.seo_geo_region ? { "geo.region": s.seo_geo_region } : {}),
      ...(s.seo_geo_placename ? { "geo.placename": s.seo_geo_placename } : {}),
      ...(s.seo_geo_position ? { "geo.position": s.seo_geo_position } : {}),
      ...(s.seo_icbm ? { "ICBM": s.seo_icbm } : {}),
      ...(s.seo_content_language ? { "content-language": s.seo_content_language } : {}),
      ...(s.seo_robots ? { "robots": s.seo_robots } : {}),
      ...(s.seo_hausa_keywords ? { "keywords": s.seo_hausa_keywords } : {}),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.site_name || "Mutual Benefit Premier Properties Ltd",
    alternateName: "MBPP",
    url: settings.seo_canonical_url || "https://mbpproperties.com",
    logo: settings.site_logo ? `${API}/api/upload/file/${settings.site_logo}` : undefined,
    image: settings.og_image || undefined,
    description: settings.seo_schema_description || settings.meta_description || "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria. Gidan siyarwa Kano, gidan haya, property for sale.",
    telephone: settings.seo_schema_phone || undefined,
    email: settings.seo_schema_email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.seo_schema_street || settings.office_address || "Kano Municipal",
      addressLocality: settings.seo_schema_city || "Kano",
      addressRegion: settings.seo_schema_state || "Kano State",
      addressCountry: settings.seo_schema_country || "NG",
    },
    ...(settings.seo_schema_lat && settings.seo_schema_lng ? {
      geo: {
        "@type": "GeoCoordinates",
        latitude: parseFloat(settings.seo_schema_lat),
        longitude: parseFloat(settings.seo_schema_lng),
      },
    } : {}),
    ...(settings.seo_schema_opening_days && settings.seo_schema_open_time && settings.seo_schema_close_time ? {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: settings.seo_schema_opening_days.split(",").map((d: string) => d.trim()),
        opens: settings.seo_schema_open_time,
        closes: settings.seo_schema_close_time,
      },
    } : {}),
    ...(settings.seo_schema_area_served ? {
      areaServed: { "@type": "City", name: settings.seo_schema_area_served },
    } : {}),
    ...(settings.seo_schema_same_as ? {
      sameAs: settings.seo_schema_same_as.split(",").map((u: string) => u.trim()).filter(Boolean),
    } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: settings.seo_canonical_url || "https://mbpproperties.com",
    potentialAction: {
      "@type": "SearchAction",
      target: `${settings.seo_canonical_url || "https://mbpproperties.com"}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={settings.seo_content_language?.split("-")[0] || "en"} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {settings.seo_geo_region && <meta name="geo.region" content={settings.seo_geo_region} />}
        {settings.seo_geo_placename && <meta name="geo.placename" content={settings.seo_geo_placename} />}
        {settings.seo_geo_position && <meta name="geo.position" content={settings.seo_geo_position} />}
        {settings.seo_icbm && <meta name="ICBM" content={settings.seo_icbm} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      </head>
      <body className="h-full antialiased">
        {settings.ga_id && settings.ga_id !== "G-XXXXX" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga_id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.ga_id}');`}
            </Script>
          </>
        )}
        <ClientBody initialSettings={settings}>{children}</ClientBody>
      </body>
    </html>
  );
}
