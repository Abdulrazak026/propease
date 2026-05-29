"use client";
import { useRole } from "@/context/RoleContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && role !== "agent") {
      router.push(`/${role}`);
    }
  }, [role, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}
