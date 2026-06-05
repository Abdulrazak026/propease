"use client";
import { useRole } from "@/context/RoleContext";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const { role } = useRole();

 if (!role) {
 return <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading...</div>;
 }

 if (role !== "admin" && role !== "head") {
 redirect(`/${role}`);
 }

 return (
 <>
 <OnboardingModal role={role} />
 <DashboardLayout>{children}</DashboardLayout>
 </>
 );
}
