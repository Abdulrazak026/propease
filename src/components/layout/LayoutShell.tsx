"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { useSettings } from "@/context/SettingsContext";
import { useRole } from "@/context/RoleContext";

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];
const STAFF_PATHS = ["/admin", "/agent", "/ambassador"];
const CLIENT_DASHBOARD = ["/wallet", "/messages", "/notifications"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isStaffDashboard = STAFF_PATHS.some((p) => pathname.startsWith(p));
  const isClientDashboard = CLIENT_DASHBOARD.some((p) => pathname.startsWith(p));
  const { get } = useSettings();
  const { role, isAuthenticated } = useRole();
  const maintenance = get("maintenance_mode") === "true";
  const isAdmin = role === "head";
  const isStaff = isAuthenticated && ["head", "admin", "ambassador", "agent"].includes(role || "");

  if (maintenance && !isAdmin && !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L4.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Under Maintenance</h1>
          <p className="text-sm text-gray-500 mt-2">We&apos;re making improvements. Please check back shortly.</p>
        </div>
      </div>
    );
  }

  // Auth pages: no nav, clean layout
  if (isAuth) return <>{children}</>;

  // Staff dashboards: DashboardLayout handles its own sidebar nav — no BottomNav
  if (isStaffDashboard) {
    return <div className="flex h-full">{children}</div>;
  }

  // Client dashboards (wallet, messages, notifications): Navbar + BottomNav
  // Staff users on client dashboards: also get Navbar + BottomNav (BottomNav hides itself for staff)
  if (isClientDashboard) {
    return (
      <div className="flex flex-col min-h-full">
        <Navbar />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </div>
    );
  }

  // Homepage + public pages: Navbar on top + BottomNav at bottom
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
