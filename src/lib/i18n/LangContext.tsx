"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ha" | "pi";

const STORAGE_KEY = "mbpp.lang";

type Dict = Record<string, { en: string; ha: string; pi: string }>;

const dictionary: Dict = {
  "hero.heading.line1": { en: "Find Your Home", ha: "Nemo Gidanku", pi: "Find Your House" },
  "hero.heading.line2": { en: "in Kano.", ha: "a Kano.", pi: "for Kano." },
  "hero.tagline": { en: "Find Your Dream Property in Kano", ha: "Nemo Gidanka da Kake So a Kano", pi: "Find the house wey you want for Kano" },
  "hero.cta.search": { en: "Search", ha: "Bincike", pi: "Search" },
  "hero.cta.browse": { en: "Browse all", ha: "Duba Duka", pi: "See all" },
  "search.placeholder": { en: "Search by location, type, or keyword…", ha: "Nemo wurin, iri, ko kalma…", pi: "Search place, type, or word…" },
  "search.heading": { en: "Properties for you", ha: "Gidaje a gare ka", pi: "Houses for you" },
  "search.results": { en: "Search results", ha: "Sakamakon Bincike", pi: "Wetin you find" },
  "search.empty": { en: "Nothing matches. Try changing your filters.", ha: "Babu abin da ya dace. Canza filters.", pi: "Nothing dey match. Change your filters." },
  "list.heading": { en: "Recently sold", ha: "An sayar", pi: "Dem don sell am" },
  "nav.browse": { en: "Browse", ha: "Duba", pi: "See" },
  "nav.sell": { en: "Sell", ha: "Sayar", pi: "Sell" },
  "nav.help": { en: "Help", ha: "Taimako", pi: "Help" },
  "nav.signin": { en: "Sign in", ha: "Shiga", pi: "Enter" },
  "nav.signup": { en: "Sign up", ha: "Yi Account", pi: "Make account" },
  "cta.contact": { en: "Contact", ha: "Tuntuɓi", pi: "Call us" },
  "cta.apply": { en: "Apply", ha: "Nema", pi: "Apply" },
  "cta.view": { en: "View", ha: "Dubi", pi: "See am" },
  "filter.city": { en: "City", ha: "Birni", pi: "City" },
  "filter.type": { en: "Type", ha: "Iri", pi: "Type" },
  "filter.beds": { en: "Bedrooms", ha: "Kwanaki", pi: "Rooms" },
  "filter.price": { en: "Price", ha: "Farashi", pi: "Price" },
  "footer.subscribe": { en: "Get new properties by email", ha: "Samu gidaje ta email", pi: "Get houses by email" },
  "footer.subscribe.desc": { en: "We send fresh listings every Friday. No spam.", ha: "Muna aiko da sabon gidaje. Babu spam.", pi: "We dey send new houses. No spam." },
  "footer.subscribe.cta": { en: "Subscribe", ha: "Biya", pi: "Join" },
  "footer.headOffice": { en: "Head Office", ha: "Babban Ofishi", pi: "Main Office" },
  "footer.explore": { en: "Explore", ha: "Duba", pi: "See" },
  "footer.services": { en: "Services", ha: "Ayyuka", pi: "Services" },
  "footer.company": { en: "Company", ha: "Kampani", pi: "Company" },
  "footer.legal": { en: "Legal", ha: "Doka", pi: "Legal" },
  "common.loading": { en: "Loading…", ha: "Ana loda…", pi: "Loading…" },
  "common.tryAgain": { en: "Try again", ha: "Sake gwadawa", pi: "Try again" },
  "common.viewAll": { en: "View all", ha: "Duba duka", pi: "See all" },
  "common.showMore": { en: "Show more", ha: "Nuna ƙari", pi: "Show more" },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  isClient: boolean;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && ["en", "ha", "pi"].includes(stored)) {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "en" ? "en" : l === "ha" ? "ha" : "pcm";
    }
  };

  const t = (key: string, fallback?: string): string => {
    const entry = dictionary[key];
    if (!entry) return fallback ?? key;
    return entry[lang] || entry.en || fallback || key;
  };

  return <LangContext.Provider value={{ lang, setLang, t, isClient }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string, fb?: string) => fb || k, isClient: false };
  return ctx;
}

export const LANG_LABELS: Record<Lang, string> = { en: "EN", ha: "HA", pi: "PI" };
export const LANG_FULL: Record<Lang, string> = { en: "English", ha: "Hausa", pi: "Pidgin" };
