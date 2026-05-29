"use client";
import { useRole } from "@/context/RoleContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HeadRedirectLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useRole();

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/admin");
    }
  }, [role, isAuthenticated]);

  return null;
}
