"use client";
import Script from "next/script";
import { RoleProvider } from "@/context/RoleContext";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LayoutShell from "@/components/layout/LayoutShell";
import PwaRegister from "@/components/pwa/PwaRegister";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieConsent from "@/components/ui/CookieConsent";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <RoleProvider>
        <ErrorBoundary>
          <LayoutShell>
            <PwaRegister />
            {children}
          </LayoutShell>
        </ErrorBoundary>
      </RoleProvider>
      <WhatsAppButton />
      <CookieConsent />
      <AnalyticsInjector />
    </SettingsProvider>
  );
}

function AnalyticsInjector() {
  const { get } = useSettings();
  return (
    <>
      {get("ga_id") && get("ga_id") !== "G-XXXXX" && (<>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${get("ga_id")}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${get("ga_id")}');`}</Script>
      </>)}
      {get("gtm_id") && get("gtm_id") !== "GTM-XXXXX" && (
        <Script id="gtm-init" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=!0;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${get("gtm_id")}');`}</Script>
      )}
      {get("fb_pixel") && get("fb_pixel") !== "GTM-XXXXX" && (
        <Script id="fb-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${get("fb_pixel")}');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
