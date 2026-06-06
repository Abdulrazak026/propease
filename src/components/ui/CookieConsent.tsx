"use client";
import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function CookieConsent() {
  const { get } = useSettings();
  const text = get("cookie_text") || "We use cookies to improve your experience.";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 pb-safe">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-600">{text}</p>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => { localStorage.setItem("cookies_accepted", "true"); setVisible(false); }}
            className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Accept All
          </button>
          <button
            onClick={() => { localStorage.setItem("cookies_accepted", "essential_only"); setVisible(false); }}
            className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
