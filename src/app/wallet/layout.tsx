"use client";
import { useRole } from "@/context/RoleContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
 const { role, isAuthenticated } = useRole();
 const router = useRouter();

 useEffect(() => {
 if (!isAuthenticated) {
 router.push("/login");
 }
 }, [isAuthenticated, router]);

 if (!isAuthenticated) {
 return <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading...</div>;
 }

 return <DashboardLayout>{children}</DashboardLayout>;
}
