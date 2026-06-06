import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LayoutShell from "@/components/layout/LayoutShell";
import PwaRegister from "@/components/pwa/PwaRegister";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const API = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";

async function getPublicSettings() {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const data = await res.json();
    return data.settings || {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings();
  return {
    title: s.meta_title || "MBPP — Real Estate in Kano",
    description: s.meta_description || "Find properties for rent and sale in Kano.",
    manifest: "/manifest.webmanifest",
    openGraph: {
      title: s.meta_title || "MBPP — Real Estate in Kano",
      description: s.meta_description || "Find properties for rent and sale in Kano.",
      images: s.og_image ? [s.og_image] : [],
      siteName: s.site_name || "MBPP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: s.meta_title || "MBPP — Real Estate in Kano",
      description: s.meta_description || "",
      images: s.og_image ? [s.og_image] : [],
    },
    other: { "theme-color": s.primary_color || "#0D6B3D" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full antialiased">
        <SettingsProvider>
          <RoleProvider>
            <ErrorBoundary>
              <LayoutShell>
                <PwaRegister />
                {children}
              </LayoutShell>
            </ErrorBoundary>
          </RoleProvider>
          <AnalyticsInjector />
        </SettingsProvider>
      </body>
    </html>
  );
}

function AnalyticsInjector() {
  "use client";
  const { get } = useSettings();

  return (
    <>
      {get("ga_id") && get("ga_id") !== "G-XXXXX" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${get("ga_id")}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${get("ga_id")}');`}</Script>
        </>
      )}
      {get("gtm_id") && get("gtm_id") !== "GTM-XXXXX" && (
        <Script id="gtm-init" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=!0;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${get("gtm_id")}');`}</Script>
      )}
      {get("fb_pixel") && get("fb_pixel") !== "GTM-XXXXX" && (
        <Script id="fb-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${get("fb_pixel")}');fbq('track','PageView');`}</Script>
      )}
      {get("robots_txt") && (
        <meta name="robots" content={get("robots_txt").split("\n")[0] || "all"} />
      )}
    </>
  );
}
