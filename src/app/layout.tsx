import type { Metadata } from "next";
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
    title: s.meta_title || "Mutual Benefit Premier Properties | Real Estate Marketplace, Kano",
    description: s.meta_description || "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria.",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/favicon.svg",
      apple: "/icons/icon-192x192.png",
    },
    openGraph: { title: s.meta_title || "MBPP", description: s.meta_description || "", images: s.og_image ? [s.og_image] : [], siteName: s.site_name || "MBPP", type: "website" },
    twitter: { card: "summary_large_image", title: s.meta_title || "MBPP", description: s.meta_description || "", images: s.og_image ? [s.og_image] : [] },
    other: {
      "theme-color": s.primary_color || "#0D6B3D",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": s.site_name || "MBPP",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
