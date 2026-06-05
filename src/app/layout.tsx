import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LayoutShell from "@/components/layout/LayoutShell";
import PwaRegister from "@/components/pwa/PwaRegister";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBPP — Real Estate in Kano",
  description: "Find properties for rent and sale in Kano. MBPP connects you with verified listings across Kano Municipal, Fagge, Tarauni, and Nassarawa.",
  manifest: "/manifest.webmanifest",
  other: { "theme-color": "#0D6B3D" },
};

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen overflow-hidden">
        <RoleProvider>
          <ErrorBoundary>
            <LayoutShell authPages={AUTH_PAGES}>
              <PwaRegister />
              {children}
            </LayoutShell>
          </ErrorBoundary>
        </RoleProvider>
      </body>
    </html>
  );
}
