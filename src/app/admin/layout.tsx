"use client";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && role !== "admin" && role !== "head") {
      router.push(`/${role}`);
    }
  }, [role, isAuthenticated, router]);

  return (
    <>
      <OnboardingModal role={role} />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
