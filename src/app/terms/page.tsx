"use client";
import { useSettings } from "@/context/SettingsContext";
import DOMPurify from "dompurify";

export default function TermsPage() {
  const { get } = useSettings();
  const content = get("terms_of_service") || "No content set. Please configure Terms of Service in Admin Settings.";
  return (
    <div className="flex-1 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>
        <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.replace(/\n/g, "<br/>")) }} />
      </div>
    </div>
  );
}
