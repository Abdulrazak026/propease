"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex-1 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Have questions about a property, partnership opportunities, or need support? We are here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-fade-in-up">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Message Sent!</h3>
                <p className="text-sm text-gray-500">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="+234 800 000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
                    <option>General Inquiry</option>
                    <option>Property Question</option>
                    <option>Partnership</option>
                    <option>Become an Agent</option>
                    <option>Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none" placeholder="How can we help you?" />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: "📍", label: "Address", value: "No. 15 Bompai Road, Kano Municipal, Kano State" },
                  { icon: "📞", label: "Phone", value: "+234 800 776 7327" },
                  { icon: "✉️", label: "Email", value: "hello@propease.ng" },
                  { icon: "🕐", label: "Hours", value: "Mon–Sat, 8:00 AM – 6:00 PM" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-primary)]/5 rounded-2xl p-6 border border-[var(--color-primary)]/10">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Want to become an agent?</h3>
              <p className="text-xs text-gray-500 mb-4">
                We are looking for motivated agents in Kano Municipal, Fagge, Tarauni, and Nassarawa. Earn commissions on every deal you close.
              </p>
              <Button size="sm" variant="outline">Apply as Agent</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
