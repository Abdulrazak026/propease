import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MBPP Properties",
  description: "Learn how MBPP Properties collects, uses, and protects your personal information.",
  alternates: { canonical: "https://mbpproperties.com/privacy" },
};

const API = "https://mbpproperties.com";

async function getSetting(key: string): Promise<string> {
  try {
    const res = await fetch(`${API}/api/settings`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.settings?.[key] || "";
  } catch {
    return "";
  }
}

function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:800;margin:1.5rem 0 0.75rem;color:#1a365d">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.25rem;font-weight:700;margin:1.25rem 0 0.5rem;color:#1a365d">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1rem;font-weight:600;margin:1rem 0 0.5rem;color:#1a365d">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#1a202c">$1</strong>')
    // List items
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.25rem;margin-bottom:0.5rem;list-style:disc;color:#4a5568">$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p style="margin-bottom:0.75rem;color:#4a5568;line-height:1.7">')
    // Single newlines within paragraphs
    .replace(/\n/g, "<br/>");
}

export default async function PrivacyPage() {
  const content = await getSetting("privacy_policy");
  const html = content ? markdownToHtml(content) : "";

  return (
    <div className="flex-1 bg-white pb-20 lg:pb-0">
      <section className="bg-gray-50 py-12 sm:py-16 px-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-medium text-brand-gold uppercase tracking-wider">Legal</span>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-blue mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: June 2026</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        {content ? (
          <div style={{ color: "#4a5568", lineHeight: 1.7, fontSize: "0.9375rem" }} dangerouslySetInnerHTML={{ __html: `<p style="margin-bottom:0.75rem;color:#4a5568;line-height:1.7">${html}</p>` }} />
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-lg">No content set. Configure in Admin → Settings → SEO & Legal.</div>
        )}
      </div>
    </div>
  );
}
