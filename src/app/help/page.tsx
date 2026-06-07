"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const API = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";

const topics = [
  {
    title: "Searching Properties",
    desc: "Learn how to find the perfect home using filters, maps, and saved searches.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "Booking a Viewing",
    desc: "Schedule property viewings with agents and get instant confirmations.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Making a Payment",
    desc: "How deposits, rent payments, and wallet transactions work on MBPP.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: "Tenant Applications",
    desc: "Step-by-step guide to applying for a rental property through our system.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Rent Agreements",
    desc: "Understanding your digital tenancy agreement and e-signature process.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
      </svg>
    ),
  },
  {
    title: "Wallet & Withdrawals",
    desc: "How to fund your wallet, track balance, and request withdrawals.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
  },
  {
    title: "Becoming an Agent",
    desc: "Requirements and process to join MBPP as a field agent or ambassador.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Commission Structure",
    desc: "How commissions are calculated, split, and paid out to agents.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/faqs`).then(r => r.json()).then(d => {
      if (d.faqs) setFaqs(d.faqs);
    }).catch(() => {}).finally(() => setFaqsLoading(false));
  }, []);

  const filtered = topics.filter(
    (t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1">
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">Help Center</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3 tracking-tight">How Can We Help You?</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">Search our help topics or browse the categories below.</p>
          <div className="relative max-w-xl mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search help topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] shadow-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {search && (
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} {filtered.length === 1 ? "topic" : "topics"} found
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {filtered.map((topic) => (
            <div key={topic.title} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 active:scale-[0.99] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                {topic.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{topic.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">FAQ</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2 tracking-tight">Frequently Asked Questions</h2>
          </div>
          {faqsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No FAQs available yet.</p>
          ) : (
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex items-center justify-between w-full px-6 py-4 text-left min-h-[56px]">
                    <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 border-t border-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-10 md:p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 tracking-tight">Still Need Help?</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              Our support team is available Monday — Saturday, 8:00 AM – 6:00 PM. We typically respond within 2 hours.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Chat on WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
