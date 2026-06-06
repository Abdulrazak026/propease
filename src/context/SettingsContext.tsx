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
  heading_font: "Inter", body_font: "Inter",
  meta_title: "MBPP — Real Estate in Kano", meta_description: "Verified properties for rent and sale in Kano.",
  site_logo: "", site_favicon: "",
  available_cities: "Kano Municipal, Kano State; Bichi, Kano State; Rano, Kano State; Wudil, Kano State; Gwarzo, Kano State; Dambatta, Kano State; Karaye, Kano State; Tudun Wada, Kano State; Doguwa, Kano State; Dawakin Tofa, Kano State; Dawakin Kudu, Kano State; Kura, Kano State; Madobi, Kano State; Gezawa, Kano State; Minjibir, Kano State; Fagge, Kano State; Dala, Kano State; Gwale, Kano State; Nasarawa, Kano State; Tarauni, Kano State; Ungogo, Kano State; Kumbotso, Kano State; Bebeji, Kano State; Bunkure, Kano State; Garko, Kano State; Garun Mallam, Kano State; Kibiya, Kano State; Kiru, Kano State; Rogo, Kano State; Sumaila, Kano State; Takai, Kano State; Ajingi, Kano State; Bagwai, Kano State; Gabasawa, Kano State; Kunchi, Kano State; Makoda, Kano State; Rimin Gado, Kano State; Shanono, Kano State; Tofa, Kano State; Tsanyawa, Kano State; Gaya, Kano State; Albasu, Kano State; Babura, Kano State",
  terms_of_service: "", privacy_policy: "", cookie_text: "",
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
    <style suppressHydrationWarning>{`
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
