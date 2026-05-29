import type { Metadata } from "next";
import Link from "next/link";
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="font-bold text-sm">PropEase</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">Real estate simplified. Find, rent, and buy properties across Kano with confidence.</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">Platform</h4>
                  <div className="space-y-2">
                    <Link href="/about" className="block text-xs text-white/50 hover:text-white transition-colors">About</Link>
                    <Link href="/contact" className="block text-xs text-white/50 hover:text-white transition-colors">Contact</Link>
                    <Link href="/custom-order" className="block text-xs text-white/50 hover:text-white transition-colors">Custom Order</Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">Legal</h4>
                  <div className="space-y-2">
                    <Link href="/terms" className="block text-xs text-white/50 hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="block text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">Contact</h4>
                  <div className="space-y-2 text-xs text-white/50">
                    <p>Kano Municipal, Nigeria</p>
                    <p>+234 800 PROPEASE</p>
                    <p>hello@propease.ng</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xs text-white/40">© 2026 PropEase. All rights reserved.</span>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
              </div>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
