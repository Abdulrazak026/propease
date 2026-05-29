import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropEase — Real Estate in Kano",
  description: "Find properties for rent and sale in Kano. PropEase connects you with verified listings across Kano Municipal, Fagge, Tarauni, and Nassarawa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <RoleProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="bg-[var(--color-primary-dark)] text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xs">P</span>
                  </div>
                  <span className="font-bold text-sm">PropEase</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-white/50">
                  <span>© 2026 PropEase</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span>Real estate for Kano</span>
                </div>
              </div>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
