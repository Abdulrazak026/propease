"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

const NO_SIDEBAR_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];
const DASHBOARD_PATHS = ["/admin", "/agent", "/ambassador"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = NO_SIDEBAR_PATHS.some((p) => pathname.startsWith(p));
  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.startsWith(p));

  if (isAuth) return <>{children}</>;

  if (isDashboard) {
    return (
      <>
        <div className="flex h-full">{children}</div>
        <BottomNav />
      </>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
