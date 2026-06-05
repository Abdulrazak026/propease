import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import PwaRegister from "@/components/pwa/PwaRegister";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBPP — Real Estate in Kano",
  description: "Find properties for rent and sale in Kano. MBPP connects you with verified listings across Kano Municipal, Fagge, Tarauni, and Nassarawa.",
  manifest: "/manifest.webmanifest",
  other: { "theme-color": "#0D6B3D" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen overflow-hidden">
        <RoleProvider>
          <ErrorBoundary>
            <div className="flex h-full">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <PwaRegister />
                <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
              </div>
            </div>
            <BottomNav />
          </ErrorBoundary>
        </RoleProvider>
      </body>
    </html>
  );
}
