"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api } from "@/lib/api-client";

type SettingsMap = Record<string, string>;

interface SettingsContextType {
  settings: SettingsMap;
  get: (key: string, fallback?: string) => string;
  loading: boolean;
}

const defaultResearch = JSON.stringify([
  { title: "Kano Residential Market Report: Q1 2026", date: "April 2026", summary: "Average rents rose 12% year-on-year across Kano Municipal. Tarauni and Nassarawa saw the highest demand for 2-bedroom flats.", metrics: ["12% YoY rent increase", "340 active listings", "4.2 avg days on market", "₦850K avg annual rent"] },
  { title: "Northern Nigeria Real Estate Outlook 2026", date: "January 2026", summary: "Comprehensive analysis of property trends across Kano, Kaduna, and Katsina states including urban migration patterns and infrastructure impact.", metrics: ["6 states covered", "2,100+ data points", "15 city districts", "3-year forecast"] },
  { title: "Rental Affordability Index: Kano State", date: "March 2026", summary: "How rent-to-income ratios vary across Kano's eight local government areas. Fagge remains the most affordable district for young professionals.", metrics: ["28% avg rent-to-income", "₦180K median salary", "8 LGAs analysed", "5 property types"] },
  { title: "Commercial Property Trends in Kano", date: "February 2026", summary: "Demand for retail and office space is shifting toward the new Kano City Centre development. Industrial space in Fagge remains undersupplied.", metrics: ["22% vacancy rate", "₦2.1M avg annual rent", "3 new developments", "+8% commercial growth"] },
]);

const defaultTeam = JSON.stringify([
  { name: "Ahmad Abubakar", role: "MD, Managing Director", bio: "Started MBPP in 2017 after buying and selling three properties the hard way. Now he focuses on capital, partnerships, and making sure the company does not lose its soul as it grows.", photo: "" },
  { name: "Barr. Sulaiman Usman", role: "Legal Adviser", bio: "Twenty years in Kano property law. He reads the contracts the rest of us skip, and he is the reason our agreements have held up in every dispute we have seen.", photo: "" },
  { name: "Engr. Salisu Muhammad", role: "Operations Manager", bio: "Runs the ambassador network. Every field agent, every photographer, every viewing, coordinated from his desk or in person.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance & IT", bio: "Keeps the books honest and the servers up. If you have ever gotten a payout on time, you have Abdulmalik to thank.", photo: "" },
  { name: "Tasiu Sani", role: "Source & Procurement", bio: "Walks neighborhoods we have not listed in yet. If a property is about to come up for sale, Tasiu usually knows before the sign goes up.", photo: "" },
  { name: "Engr. Sani Umar", role: "Platform Manager", bio: "Built the search, the filters, the owner dashboard. If something on the site works well, Sani probably wrote it. If it does not, he is already on it.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Our newest construction and renovation lead. If you are buying off-plan through us, Zahradden is the one making sure they actually build it.", photo: "" },
  { name: "Umar Nuhu", role: "Admin Officer", bio: "The person who actually keeps the lights on. Sales records, expense tracking, the filing cabinet nobody else wants to touch. That is Umar.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Office Secretary", bio: "The first voice you hear when you call. Ahmad runs scheduling, internal coordination, and our social media. He does the latter better than any of us expected.", photo: "" },
]);

const defaults: SettingsMap = {
  site_name: "Mutual Benefit Premier Properties", site_tagline: "Find Your Dream Property in Kano",
  support_email: "support@mbpproperties.com", support_phone: "", support_whatsapp: "",
  office_address: "", business_hours: "Mon-Fri 8AM-6PM",
  primary_color: "#0d6e4e", secondary_color: "#f97316", accent_color: "#facc15",
  heading_font: "Inter", body_font: "Inter",
  meta_title: "Mutual Benefit Premier Properties | Real Estate in Kano", meta_description: "Verified properties for rent and sale in Kano.",
  site_logo: "", site_favicon: "", about_hero_image: "",
  team_members: defaultTeam,
  research_reports: defaultResearch,
  available_cities: "Kano Municipal, Kano State; Bichi, Kano State; Rano, Kano State; Wudil, Kano State; Gwarzo, Kano State; Dambatta, Kano State; Karaye, Kano State; Tudun Wada, Kano State; Doguwa, Kano State; Dawakin Tofa, Kano State; Dawakin Kudu, Kano State; Kura, Kano State; Madobi, Kano State; Gezawa, Kano State; Minjibir, Kano State; Fagge, Kano State; Dala, Kano State; Gwale, Kano State; Nasarawa, Kano State; Tarauni, Kano State; Ungogo, Kano State; Kumbotso, Kano State; Bebeji, Kano State; Bunkure, Kano State; Garko, Kano State; Garun Mallam, Kano State; Kibiya, Kano State; Kiru, Kano State; Rogo, Kano State; Sumaila, Kano State; Takai, Kano State; Ajingi, Kano State; Bagwai, Kano State; Gabasawa, Kano State; Kunchi, Kano State; Makoda, Kano State; Rimin Gado, Kano State; Shanono, Kano State; Tofa, Kano State; Tsanyawa, Kano State; Gaya, Kano State; Albasu, Kano State; Babura, Kano State",
  terms_of_service: "", privacy_policy: "", cookie_text: "",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaults, get: () => "", loading: true,
});

export function SettingsProvider({ children, initialSettings }: { children: ReactNode; initialSettings?: SettingsMap }) {
  const [settings, setSettings] = useState<SettingsMap>({ ...defaults, ...initialSettings });
  const [loading, setLoading] = useState(!initialSettings);

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
