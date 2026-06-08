"use client";
import { useRole } from "@/context/RoleContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/ambassador");
    } else if (!loading && isAuthenticated && role !== "ambassador") {
      const roleRoutes: Record<string, string> = { head: "/admin", client: "/", agent: "/agent", ambassador: "/ambassador" };
      router.push(roleRoutes[role || "client"] || "/");
    }
  }, [loading, isAuthenticated, role, router]);

  if (!isAuthenticated) {
    return (
      <DashboardLayout>{children}</DashboardLayout>
    );
  }

  return (
    <>
      <OnboardingModal role={role} />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
