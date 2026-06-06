"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { User } from "@/lib/types";
import { api, setAccessToken } from "@/lib/api-client";
import type { ApiAuthResponse, ApiUser } from "@/lib/api-types";

interface RoleContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ role: string } | string>;
  logout: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false,
  role: null,
  loading: true,
  login: async () => "Not initialized",
  logout: async () => {},
});

function toUser(a: ApiUser): User {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    role: a.role,
    city: a.city || "",
    walletBalance: a.walletBalance,
    canCloseDeals: a.canCloseDeals,
    canCreateTasks: a.canCreateTasks,
    ambassadorId: a.ambassadorId ?? undefined,
  };
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem("mbpp-user");
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(!currentUser);

  useEffect(() => {
    let cancelled = false;
    const validate = async () => {
      try {
        const { data } = await api.get<{ user: ApiUser }>("/api/auth/me");
        if (!cancelled && data?.user) {
          const u = toUser(data.user);
          setCurrentUserState(u);
          localStorage.setItem("mbpp-user", JSON.stringify(u));
        } else if (!cancelled) {
          setCurrentUserState(null);
          localStorage.removeItem("mbpp-user");
        }
      } catch {
        setCurrentUserState(null);
        localStorage.removeItem("mbpp-user");
      }
      if (!cancelled) setLoading(false);
    };
    validate();
    return () => { cancelled = true; };
  }, []);

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    if (user) localStorage.setItem("mbpp-user", JSON.stringify(user));
    else localStorage.removeItem("mbpp-user");
    if (!user) setAccessToken(null);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ role: string } | string> => {
    const { data, status, error } = await api.post<ApiAuthResponse>("/api/auth/login", { email, password });
    if (status === 0 || error) {
      return error || "Network error. Check your connection.";
    }
    if (status !== 200 || !data) {
      return "Invalid email or password";
    }
    setAccessToken(data.accessToken);
    const user = toUser(data.user);
    setCurrentUserState(user);
    localStorage.setItem("mbpp-user", JSON.stringify(user));
    return { role: user.role };
  }, []);

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout");
    setAccessToken(null);
    setCurrentUserState(null);
    localStorage.removeItem("mbpp-user");
  }, []);

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role ?? null,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
