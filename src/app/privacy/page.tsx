import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MBPP Properties",
  description: "Learn how MBPP Properties collects, uses, and protects your personal information.",
  alternates: { canonical: "https://mbpproperties.com/privacy" },
};

const API = "https://propease-production.up.railway.app";

async function getSetting(key: string): Promise<string> {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.settings?.[key] || "";
  } catch {
    return "";
  }
}

export default async function PrivacyPage() {
  const content = await getSetting("privacy_policy");

  const html = content
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n## (.+)/g, '\n<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/\n# (.+)/g, '\n<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- (.+)/g, '\n<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, "<br/>");

  return (
    <div className="flex-1 bg-white">
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Legal</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: June 2026</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {content ? (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-lg">No content set. Configure in Admin &rarr; Settings &rarr; SEO &amp; Legal.</div>
        )}
      </div>
    </div>
  );
}
