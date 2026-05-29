"use client";
import { useRole } from "@/context/RoleContext";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = useRole();

  if (role && role !== "admin" && role !== "head") {
    redirect(`/${role}`);
  }

  if (!role) return null;

  return (
    <>
      <OnboardingModal role={role} />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
