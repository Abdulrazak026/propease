"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api } from "@/lib/api-client";

type SettingsMap = Record<string, string>;

interface SettingsContextType {
  settings: SettingsMap;
  get: (key: string, fallback?: string) => string;
  loading: boolean;
}

const defaultTeam = JSON.stringify([
  { name: "Ahmad Abubakar", role: "MD \u2014 Managing Director", bio: "Overall leadership, final approvals, capital management, investor relations, and strategic direction.", photo: "" },
  { name: "Barr. Sulaiman Usman", role: "Legal Adviser", bio: "Handles land titles, contracts, legal agreements, compliance, and dispute resolution.", photo: "" },
  { name: "Umar Nuhu", role: "Admin Officer", bio: "Manages sales records, expense tracking, compliance files, and media coordination.", photo: "" },
  { name: "Tasiu Sani", role: "Source & Procurement", bio: "Responsible for property sourcing, market research, negotiations, and acquisitions.", photo: "" },
  { name: "Engr. Salisu Muhammad", role: "Operations Manager", bio: "Oversees daily field operations, client relations, and on-site coordination.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance & IT", bio: "Handles financial records, accounting support, IT systems, data management, and documentation.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Supervises construction projects, ensures quality control, monitors progress, and timely delivery.", photo: "" },
  { name: "Engr. Sani Umar", role: "Platform Manager", bio: "Manages digital platforms, online systems, and all technical/virtual operations.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Office Secretary", bio: "Administrative support, documentation, scheduling, internal coordination, and social media management.", photo: "" },
]);

const defaults: SettingsMap = {
  site_name: "Mutual Benefit Premier Properties", site_tagline: "Find Your Dream Property in Kano",
  support_email: "support@mbpproperties.com", support_phone: "", support_whatsapp: "",
  office_address: "", business_hours: "Mon-Fri 8AM-6PM",
  primary_color: "#0d6e4e", secondary_color: "#f97316", accent_color: "#facc15",
  heading_font: "Inter", body_font: "Inter",
  meta_title: "Mutual Benefit Premier Properties \u2014 Real Estate in Kano", meta_description: "Verified properties for rent and sale in Kano.",
  site_logo: "", site_favicon: "",
  team_members: defaultTeam,
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
