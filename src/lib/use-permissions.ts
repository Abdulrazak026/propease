"use client";
import { useRole } from "@/context/RoleContext";

export function usePermissions() {
  const { role, currentUser } = useRole();
  const isHead = role === "head";

  const has = (perm: string) => {
    if (isHead) return true;
    return !!(currentUser as any)?.[perm];
  };

  return {
    isHead,
    canCreateTasks: has("canCreateTasks"),
    canCloseDeals: has("canCloseDeals"),
    canCreateListings: has("canCreateListings"),
    canManageUsers: has("canManageUsers"),
    canManageContent: has("canManageContent"),
    canViewAnalytics: has("canViewAnalytics"),
    canManageAgreements: has("canManageAgreements"),
  };
}
