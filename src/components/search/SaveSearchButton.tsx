"use client";
import { useState } from "react";
import type { FilterState } from "@/components/listings/PropertyFilters";

interface SaveSearchButtonProps {
 currentFilters: FilterState;
}

export default function SaveSearchButton({ currentFilters }: SaveSearchButtonProps) {
 const [saved, setSaved] = useState(false);
 const [showName, setShowName] = useState(false);
 const [name, setName] = useState("");

 const handleSave = () => {
 if (!showName) {
 setShowName(true);
 return;
 }
 const searches = JSON.parse(localStorage.getItem("savedSearches") || "[]");
 const searchParams = { ...currentFilters } as Record<string, string>;
 for (const k of Object.keys(searchParams)) {
 if (!searchParams[k]) delete searchParams[k];
 }
 searches.unshift({
 id: crypto.randomUUID(),
 name: name || Object.values(searchParams).filter(Boolean).join(" · ") || "Untitled search",
 searchParams,
 createdAt: new Date().toISOString(),
 });
 localStorage.setItem("savedSearches", JSON.stringify(searches));
 setSaved(true);
 setShowName(false);
 setName("");
 setTimeout(() => setSaved(false), 2000);
 };

 const hasFilters = Object.values(currentFilters).some((v) => v);

 if (!hasFilters) return null;

 return (
 <div className="relative">
 {saved ? (
 <span className="text-xs text-emerald-600 font-medium">Saved!</span>
 ) : showName ? (
 <div className="flex gap-2">
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Name this search"
 className="w-36 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
 autoFocus
 onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
 />
 <button onClick={handleSave} className="text-xs text-white bg-[var(--color-primary)] px-2 py-1 rounded-lg hover:bg-[var(--color-primary-light)]">
 Save
 </button>
 <button onClick={() => setShowName(false)} className="text-xs text-gray-400 hover:text-gray-600">&times;</button>
 </div>
 ) : (
 <button onClick={handleSave} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--color-primary)] transition-colors">
 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
 </svg>
 Save this search
 </button>
 )}
 </div>
 );
}
