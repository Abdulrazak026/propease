"use client";
import { useRole } from "@/context/RoleContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && role !== "ambassador") {
      router.push(`/${role}`);
    }
  }, [role, isAuthenticated, router]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <OnboardingModal role={role} />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
