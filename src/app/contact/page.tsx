"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

const faqs = [
 { q: "How do I schedule a property viewing?", a: "Click 'Inquire' on the property page, fill in your details, and the assigned agent will contact you within 24 hours to arrange a viewing." },
 { q: "What is a holding deposit?", a: "A holding deposit secures the property for 48 hours while you finalize paperwork. It is deducted from your first payment and is fully refundable per our cancellation policy." },
 { q: "How do commissions work for agents?", a: "Each deal has a commission split visible to all parties. Agent rates are configured by the platform admin and paid into your wallet upon deal completion." },
 { q: "Can I withdraw my wallet balance?", a: "Yes. Go to your Wallet page, click Withdraw, enter the amount and bank details. The request is sent to admin for approval and processed within 1-2 business days." },
];

export default function ContactPage() {
 const [submitted, setSubmitted] = useState(false);
 const [openFaq, setOpenFaq] = useState<number | null>(null);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 setSubmitted(true);
 };

 return (
 <div className="flex-1">
 <section className="bg-gray-50 py-16 px-4 border-b border-gray-200">
 <div className="max-w-4xl mx-auto text-center">
 <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">Contact</span>
 <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Get in Touch</h1>
 <p className="text-gray-500 max-w-lg mx-auto">
 Have questions about a property, partnership opportunities, or need support? We are here to help.
 </p>
 </div>
 </section>

 <div className="max-w-5xl mx-auto px-4 py-12">
 <div className="grid md:grid-cols-2 gap-10">
 <div>
 {submitted ? (
 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center-up">
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
 <input required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="Your name" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
 <input type="email" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="you@example.com" />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
 <input className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="+234 800 000 0000" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
 <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
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
 <textarea rows={4} required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none" placeholder="How can we help you?" />
 </div>
 <Button type="submit" className="w-full">Send Message</Button>
 </form>
 </div>
 )}
 </div>

 <div className="space-y-6">
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
 <div className="space-y-4">
 {[
 { icon: "📍", label: "Office Address", value: "No. 15 Bompai Road, Kano Municipal, Kano State" },
 { icon: "📞", label: "Phone", value: "+234 800 000 0000" },
 { icon: "✉️", label: "Email", value: "hello@mbpp.ng" },
 { icon: "🕐", label: "Working Hours", value: "Monday – Saturday, 8:00 AM – 6:00 PM" },
 ].map((item) => (
 <div key={item.label} className="flex items-start gap-3">
 <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center shrink-0">
 <span className="text-base">{item.icon}</span>
 </div>
 <div>
 <p className="text-xs text-gray-500">{item.label}</p>
 <p className="text-sm font-medium text-gray-900">{item.value}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
 <div className="h-44 bg-gray-100 flex items-center justify-center">
 <div className="text-center text-gray-400">
 <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
 <p className="text-xs">Map loading — Google Maps integration</p>
 <p className="text-[10px] text-gray-300 mt-1">No. 15 Bompai Road, Kano</p>
 </div>
 </div>
 </div>

 <div className="bg-[var(--color-primary)]/5 rounded-lg p-6 border border-[var(--color-primary)]/10">
 <h3 className="text-sm font-semibold text-gray-900 mb-2">Want to become an agent?</h3>
 <p className="text-xs text-gray-500 mb-4">
 We are looking for motivated agents in Kano Municipal, Fagge, Tarauni, and Nassarawa. Earn commissions on every deal you close.
 </p>
 <Button size="sm" variant="outline">Apply as Agent</Button>
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
 </div>
 </div>
 );
}
