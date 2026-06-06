"use client";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export default function TermsPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";
    fetch(`${apiBase}/api/settings`).then(r => r.json()).then(d => {
      setContent(d.settings?.terms_of_service || "No content set.");
    }).catch(() => setContent("Failed to load content."));
  }, []);

  return (
    <div className="flex-1 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>
        {content ? (
          <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.replace(/\n/g, "<br/>")) }} />
        ) : (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-4 bg-gray-100 rounded w-1/2" /><div className="h-4 bg-gray-100 rounded w-5/6" />
          </div>
        )}
      </div>
    </div>
  );
}
