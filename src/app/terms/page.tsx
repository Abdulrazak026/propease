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

export default async function TermsPage() {
  const content = await getSetting("terms_of_service");

  const html = content
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n## (.+)/g, '\n<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/\n# (.+)/g, '\n<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- (.+)/g, '\n<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, "<br/>");

  return (
    <div className="flex-1 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>
        {content ? (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center">No content set. Configure in Admin → Settings → SEO & Legal.</div>
        )}
      </div>
    </div>
  );
}
