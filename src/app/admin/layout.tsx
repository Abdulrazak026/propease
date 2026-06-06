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
    } else if (!loading && isAuthenticated && !["admin", "head", "supervisor", "manager"].includes(role || "")) {
      router.push(`/${role}`);
    }
  }, [loading, isAuthenticated, role, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-2xl animate-pulse" />
            <div className="absolute inset-2 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading your dashboard...</p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingModal role={role} />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
