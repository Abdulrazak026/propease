"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api-client";

const faqs = [
  { q: "How do I schedule a property viewing?", a: "Click 'Inquire' on the property page, fill in your details, and the assigned agent will contact you within 24 hours to arrange a viewing." },
  { q: "What is a holding deposit?", a: "A holding deposit secures the property for 48 hours while you finalize paperwork. It is deducted from your first payment and is fully refundable per our cancellation policy." },
  { q: "How do commissions work for agents?", a: "Each deal has a commission split visible to all parties. Agent rates are configured by the platform admin and paid into your wallet upon deal completion." },
  { q: "Can I withdraw my wallet balance?", a: "Yes. Go to your Wallet page, click Withdraw, enter the amount and bank details. The request is sent to admin for approval and processed within 1-2 business days." },
];

export default function ContactPage() {
  const { get: g } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const { status, data, error: apiError } = await api.post("/api/contact", form);
      if (status === 200 || status === 201) {
        setSubmitted(true);
      } else {
        setError((data as any)?.error || apiError || "Failed to send message");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
    setSending(false);
  };

  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div className="flex-1">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>
      <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Contact</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Get in Touch</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Have questions about a property, partnership opportunities, or need support? We are here to help.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Message Sent!</h3>
                <p className="text-sm text-gray-500">We will get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>Send Another</Button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Send us a Message</h2>
                <p className="text-sm text-gray-500 mb-6">Fill in the form and we will respond promptly.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input required value={form.name} onChange={e => update("name", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" required value={form.email} onChange={e => update("email", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="+234 800 000 0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select value={form.subject} onChange={e => update("subject", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
                      <option>General Inquiry</option><option>Property Question</option><option>Partnership</option><option>Become an Agent</option><option>Support</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={4} required value={form.message} onChange={e => update("message", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none" placeholder="How can we help you?" />
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>}
                  <Button type="submit" disabled={sending} className="w-full">{sending ? "Sending..." : "Send Message"}</Button>
                </form>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: "A", label: "Office Address", value: g("office_address", "No. 15 Bompai Road, Kano Municipal, Kano State") },
                  { icon: "B", label: "Phone", value: g("support_phone", "+234 800 000 0000") },
                  { icon: "C", label: "Email", value: g("support_email", "hello@mbpp.ng") },
                  { icon: "D", label: "Working Hours", value: g("business_hours", "Monday \u2013 Saturday, 8:00 AM \u2013 6:00 PM") },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center shrink-0">
                      {item.icon === "A" && <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                      {item.icon === "B" && <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                      {item.icon === "C" && <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                      {item.icon === "D" && <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </div>
                    <div><p className="text-xs text-gray-500">{item.label}</p><p className="text-sm font-medium text-gray-900">{item.value}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-44 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <p className="text-xs">Map loading. Google Maps integration</p>
                  <p className="text-[10px] text-gray-300 mt-1">No. 15 Bompai Road, Kano</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-primary)]/5 rounded-lg p-6 border border-[var(--color-primary)]/10">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Want to become an agent?</h3>
              <p className="text-xs text-gray-500 mb-4">We are looking for motivated agents in Kano Municipal, Fagge, Tarauni, and Nassarawa. Earn commissions on every deal you close.</p>
              <a href="/apply-as-agent"><Button size="sm" variant="outline">Apply as Agent</Button></a>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center mb-8">
            <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">FAQ</span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex items-center justify-between w-full px-5 py-4 text-left">
                  <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openFaq === i && <div className="px-5 pb-4"><p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
