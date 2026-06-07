"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CompareItem {
  id: string;
  title: string;
  city: string;
  price: number;
  listingType: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  photo?: string;
}

interface CompareCtx {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const MAX = 3;
const STORAGE_KEY = "mbpp.compare";

const Ctx = createContext<CompareCtx | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const add = useCallback((item: CompareItem) => {
    setItems(prev => {
      if (prev.find(p => p.id === item.id)) return prev;
      if (prev.length >= MAX) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback((id: string) => items.some(p => p.id === id), [items]);

  return <Ctx.Provider value={{ items, add, remove, clear, has }}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) return { items: [], add: () => {}, remove: () => {}, clear: () => {}, has: () => false };
  return ctx;
}
