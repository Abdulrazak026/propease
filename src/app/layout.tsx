import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { SettingsProvider, SiteStyle } from "@/context/SettingsContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LayoutShell from "@/components/layout/LayoutShell";
import PwaRegister from "@/components/pwa/PwaRegister";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBPP — Real Estate in Kano",
  description: "Find properties for rent and sale in Kano.",
  manifest: "/manifest.webmanifest",
  other: { "theme-color": "#0D6B3D" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen overflow-hidden">
        <SettingsProvider>
          <SiteStyle />
          <RoleProvider>
            <ErrorBoundary>
              <LayoutShell>
                <PwaRegister />
                {children}
              </LayoutShell>
            </ErrorBoundary>
          </RoleProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
