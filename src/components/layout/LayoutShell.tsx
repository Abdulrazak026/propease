"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function LayoutShell({
  children,
  authPages,
}: {
  children: React.ReactNode;
  authPages: string[];
}) {
  const pathname = usePathname();
  const isAuth = authPages.some((p) => pathname.startsWith(p));

  if (isAuth) {
    return <>{children}</>;
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
