"use client";
import { useRole } from "@/context/RoleContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useRole();
  const router = useRouter();
  const isStaff = ["head", "admin", "ambassador", "agent"].includes(role || "");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading...</div>;
  }

  if (isStaff) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <div className="flex-1 p-6 bg-gray-50">{children}</div>;
}
