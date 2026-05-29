"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/lib/types";
import { users } from "@/lib/mock-data";

interface RoleContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  role: string | null;
}

const RoleContext = createContext<RoleContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false,
  role: null,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role ?? null,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
