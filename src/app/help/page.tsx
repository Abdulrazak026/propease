"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const topics = [
  { title: "Searching Properties", icon: "🔍", desc: "Learn how to find the perfect home using filters, maps, and saved searches." },
  { title: "Booking a Viewing", icon: "📅", desc: "Schedule property viewings with agents and get instant confirmations." },
  { title: "Making a Payment", icon: "💳", desc: "How deposits, rent payments, and wallet transactions work on MBPP." },
  { title: "Tenant Applications", icon: "📋", desc: "Step-by-step guide to applying for a rental property through our system." },
  { title: "Rent Agreements", icon: "📄", desc: "Understanding your digital tenancy agreement and e-signature process." },
  { title: "Wallet & Withdrawals", icon: "💰", desc: "How to fund your wallet, track balance, and request withdrawals." },
  { title: "Becoming an Agent", icon: "🤝", desc: "Requirements and process to join MBPP as a field agent or ambassador." },
  { title: "Commission Structure", icon: "📊", desc: "How commissions are calculated, split, and paid out to agents." },
];

const faqs = [
  { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. A reset link will be sent to your registered email address." },
  { q: "Can I cancel a viewing?", a: "Yes, go to your messages and inform the agent. We recommend cancelling at least 2 hours before the scheduled time." },
  { q: "What happens after I sign a rent agreement?", a: "The agreement is digitally stored and accessible from your account. You will receive a confirmation via email and WhatsApp." },
  { q: "How long does a withdrawal take?", a: "Withdrawal requests are processed within 1-2 business days after admin approval." },
  { q: "Is my personal data safe?", a: "Yes. We use encryption, access controls, and regular security audits. We never share your data without consent." },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = topics.filter(
    (t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1">
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Help Center</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">How Can We Help You?</h1>
          <div className="relative max-w-xl mx-auto mt-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search help topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {search && (
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} {filtered.length === 1 ? "topic" : "topics"} found
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {filtered.map((topic) => (
            <div key={topic.title} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-[var(--color-primary)]/20 hover:shadow-sm transition-all">
              <span className="text-2xl mb-3 block">{topic.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{topic.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">FAQ</span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex items-center justify-between w-full px-5 py-4 text-left">
                  <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-primary)]/5 rounded-lg border border-[var(--color-primary)]/10 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Still Need Help?</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
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
  );
}
