"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api } from "@/lib/api-client";

type SettingsMap = Record<string, string>;

interface SettingsContextType {
  settings: SettingsMap;
  get: (key: string, fallback?: string) => string;
  loading: boolean;
}

const defaults: SettingsMap = {
  site_name: "MBPP", site_tagline: "Find Your Dream Property in Kano",
  support_email: "support@mbpproperties.com", support_phone: "", support_whatsapp: "",
  office_address: "", business_hours: "Mon-Fri 8AM-6PM",
  primary_color: "#0d6e4e", secondary_color: "#f97316", accent_color: "#facc15",
  meta_title: "MBPP — Real Estate in Kano", meta_description: "Verified properties for rent and sale in Kano.",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaults, get: () => "", loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsMap>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ settings: SettingsMap }>("/api/settings").then((r) => {
      if (r.data?.settings) setSettings((p) => ({ ...p, ...r.data!.settings }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const get = useCallback((key: string, fallback = "") => settings[key] || fallback, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, get, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function SiteStyle() {
  const { get } = useSettings();
  const primary = get("primary_color", "#0d6e4e");
  return (
    <style>{`
      :root {
        --color-primary: ${primary};
        --color-primary-light: ${adjustColor(primary, 15)};
        --color-primary-dark: ${adjustColor(primary, -15)};
      }
    `}</style>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
