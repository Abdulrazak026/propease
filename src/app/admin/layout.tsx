"use client";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/admin");
    } else if (!loading && isAuthenticated && role !== "admin" && role !== "head") {
      router.push(`/${role}`);
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
