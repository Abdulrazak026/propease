"use client";
import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";

export default function CookieConsent() {
  const { get } = useSettings();
  const text = get("cookie_text") || "We use cookies to improve your experience on MBPP.";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mbpp_cookie_consent");
    if (consent) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accept" | "decline") => {
    localStorage.setItem("mbpp_cookie_consent", choice);
    setVisible(false);
    if (choice === "accept" && typeof window !== "undefined") {
      const w = window as any;
      if (typeof w.gtag !== "undefined") {
        w.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
        });
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between flex-wrap gap-3 shadow-[0_-2px_12px_rgba(0,0,0,0.2)] font-sans text-sm">
      <p className="flex-1 min-w-[200px] m-0">
        {text}{" "}
        See our <Link href="/privacy" className="text-green-400 underline">Privacy Policy</Link> and{" "}
        <Link href="/terms" className="text-green-400 underline">Terms of Use</Link>.
        By clicking Accept, you agree to our use of cookies.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleChoice("decline")}
          className="px-[18px] py-2 rounded-md border border-gray-500 bg-transparent text-gray-300 text-[13px] font-semibold cursor-pointer hover:text-white hover:border-gray-400 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={() => handleChoice("accept")}
          className="px-[18px] py-2 rounded-md bg-[#0d6e4e] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
