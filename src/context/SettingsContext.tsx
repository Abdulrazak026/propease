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
  { name: "Engr. Ahmad Abubakar, PhD", role: "CEO & Managing Director", bio: "Strategic leadership & final authority. Investment management & capital control. Enterprise growth & market expansion.", photo: "" },
  { name: "Sulaiman Usman (LLB, B.L, LLM)", role: "Legal Adviser", bio: "Contract management & compliance. Oversees all legal documentation, property contracts, and regulatory compliance.", photo: "" },
  { name: "Umar Nuhu Umar", role: "Admin Officer", bio: "Executive support & corporate services. Manages day-to-day administrative operations and corporate coordination.", photo: "" },
  { name: "Engr. Tasiu Sani", role: "Sales Manager", bio: "Property marketing & client relations. Leads property marketing strategies and maintains client relationships.", photo: "" },
  { name: "Engr. Salisu Mohd Nuhu", role: "Operations Manager", bio: "Property development & asset management. Oversees property development projects and asset portfolio management.", photo: "" },
  { name: "Abdulmalik Abubakar", role: "Finance Manager", bio: "Accounting & budget management. Handles financial records, budgeting, and fiscal planning.", photo: "" },
  { name: "Zahradden Aliyu", role: "Project Manager", bio: "Project planning, execution & delivery. Manages construction projects from planning to completion.", photo: "" },
  { name: "Engr. Sani Umar, PhD", role: "Technology Manager", bio: "Digital platform & IT support. Manages the MBPP digital platform and technical infrastructure.", photo: "" },
  { name: "Ahmad Abubakar Ali", role: "Media Manager", bio: "Corporate promotion & communications. Handles social media, marketing content, and public communications.", photo: "" },
]);

const defaults: SettingsMap = {
  site_name: "Mutual Benefit Premier Properties", site_tagline: "Find Your Dream Property in Kano & Northern States",
  support_email: "support@mbpproperties.com", support_phone: "", support_whatsapp: "",
  office_address: "", business_hours: "Mon-Fri 8AM-6PM",
  primary_color: "#0d6e4e", secondary_color: "#f97316", accent_color: "#facc15",
  heading_font: "Inter", body_font: "Inter",
  meta_title: "Mutual Benefit Premier Properties | Real Estate in Kano & Northern States", meta_description: "Verified properties for rent and sale in Kano & Northern States.",
  site_logo: "", site_favicon: "", about_hero_image: "", flyer_image: "",
  completed_projects: "",
  developments_in_progress: "",
  team_members: defaultTeam,
  research_reports: defaultResearch,
  available_cities: "Kano Municipal, Kano State; Fagge, Kano State; Tarauni, Kano State; Nasarawa, Kano State; Gwale, Kano State; Dala, Kano State; Kumbotso, Kano State; Ungogo, Kano State; Bichi, Kano State; Gwarzo, Kano State; Rano, Kano State; Wudil, Kano State; Dambatta, Kano State; Garki, FCT; Wuse, FCT; Gwarinpa, FCT; Maitama, FCT; Asokoro, FCT; Kubwa, FCT; Kaduna, Kaduna State; Zaria, Kaduna State; Kafanchan, Kaduna State; Zonkwa, Kaduna State; Saminaka, Kaduna State; Jos, Plateau State; Bukuru, Plateau State; Pankshin, Plateau State; Shendam, Plateau State; Ilorin, Kwara State; Offa, Kwara State; Lafiagi, Kwara State; Patigi, Kwara State; Lokoja, Kogi State; Okene, Kogi State; Kabba, Kogi State; Idah, Kogi State; Minna, Niger State; Bida, Niger State; Kontagora, Niger State; Suleja, Niger State; Sokoto, Sokoto State; Gwadabawa, Sokoto State; Wurno, Sokoto State; Gusau, Zamfara State; Kaura Namoda, Zamfara State; Talata Mafara, Zamfara State; Katsina, Katsina State; Daura, Katsina State; Funtua, Katsina State; Malumfashi, Katsina State; Birnin Kebbi, Kebbi State; Argungu, Kebbi State; Yauri, Kebbi State; Zuru, Kebbi State; Dutse, Jigawa State; Hadejia, Jigawa State; Gumel, Jigawa State; Kazaure, Jigawa State; Lafia, Nasarawa State; Akwanga, Nasarawa State; Keffi, Nasarawa State; Karu, Nasarawa State; Yola, Adamawa State; Mubi, Adamawa State; Jimeta, Adamawa State; Numan, Adamawa State; Bauchi, Bauchi State; Azare, Bauchi State; Jama'are, Bauchi State; Misau, Bauchi State; Maiduguri, Borno State; Biu, Borno State; Bama, Borno State; Monguno, Borno State; Gombe, Gombe State; Kaltungo, Gombe State; Billiri, Gombe State; Dukku, Gombe State; Makurdi, Benue State; Gboko, Benue State; Otukpo, Benue State; Katsina-Ala, Benue State; Jalingo, Taraba State; Wukari, Taraba State; Bali, Taraba State; Takum, Taraba State; Damaturu, Yobe State; Potiskum, Yobe State; Gashua, Yobe State; Nguru, Yobe State",
  terms_of_service: "", privacy_policy: "", cookie_text: "",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaults, get: () => "", loading: true,
});

export function SettingsProvider({ children, initialSettings }: { children: ReactNode; initialSettings?: SettingsMap }) {
  const mergedInit = { ...defaults, ...initialSettings };
  // For available_cities, prefer the longer (more comprehensive) value
  if (defaults.available_cities && initialSettings?.available_cities && defaults.available_cities.length > initialSettings.available_cities.length) {
    mergedInit.available_cities = defaults.available_cities;
  }
  const [settings, setSettings] = useState<SettingsMap>(mergedInit);
  const [loading, setLoading] = useState(!initialSettings);

  useEffect(() => {
    api.get<{ settings: SettingsMap }>("/api/settings").then((r) => {
      if (r.data?.settings) {
        setSettings((p) => {
          const merged = { ...p, ...r.data!.settings };
          // For available_cities, prefer the longer (more comprehensive) value
          if (p.available_cities && r.data!.settings.available_cities && p.available_cities.length > r.data!.settings.available_cities.length) {
            merged.available_cities = p.available_cities;
          }
          return merged;
        });
      }
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
