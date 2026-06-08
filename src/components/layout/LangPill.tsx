"use client";
import { useState } from "react";
import { useLang, LANG_LABELS, LANG_FULL, Lang } from "@/lib/i18n/LangContext";

const ORDER: Lang[] = ["en", "ha", "pi"];

export default function LangPill() {
  const { lang, setLang, isClient } = useLang();
  const [open, setOpen] = useState(false);

  if (!isClient) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Change language"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
        {LANG_LABELS[lang]}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 z-[70] min-w-[120px] overflow-hidden">
            {ORDER.map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`w-full text-left text-sm px-3 py-2 hover:bg-gray-50 flex items-center justify-between gap-3 ${lang === l ? "bg-gray-50" : ""}`}
              >
                <span className="text-gray-900">{LANG_FULL[l]}</span>
                <span className="text-[10px] font-semibold text-gray-400">{LANG_LABELS[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
