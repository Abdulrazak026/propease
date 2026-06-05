"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface OnboardingModalProps {
 role: string | null;
}

const roleContent: Record<string, { title: string; steps: { icon: string; text: string }[] }> = {
 admin: {
 title: "Welcome to your Admin Dashboard",
 steps: [
 { icon: "📊", text: "Dashboard shows platform stats — users, listings, tasks, and revenue" },
 { icon: "👥", text: "Users page to manage all accounts across the platform" },
 { icon: "💰", text: "Commissions page to configure rate splits and view earnings" },
 { icon: "⚙️", text: "Settings for API keys, preview mode, and security" },
 { icon: "📋", text: "Audit Log to approve withdrawals and review activity" },
 ],
 },
 agent: {
 title: "Welcome to your Agent Dashboard",
 steps: [
 { icon: "📈", text: "Performance metrics show your tasks completed and commissions earned" },
 { icon: "📋", text: "Task Board lists assignments from your ambassador — drag to update status" },
 { icon: "💬", text: "Inquiries section to respond to interested clients" },
 { icon: "💰", text: "Commissions page shows what you've earned on each deal" },
 { icon: "👛", text: "Wallet page to top up funds and request withdrawals" },
 ],
 },
 ambassador: {
 title: "Welcome to your Ambassador Dashboard",
 steps: [
 { icon: "🏙️", text: "City Overview shows your listings and agents at a glance" },
 { icon: "➕", text: "Post Listings to add new properties for your city" },
 { icon: "📌", text: "Create Tasks to assign work to your agents" },
 { icon: "💰", text: "Commissions page tracks earnings from your city's deals" },
 { icon: "⚙️", text: "Settings for notifications and city profile" },
 ],
 },
 head: {
 title: "Welcome to your Dashboard",
 steps: [
 { icon: "📊", text: "Full platform visibility across all cities and roles" },
 { icon: "👥", text: "User management to add and manage ambassadors and agents" },
 { icon: "💰", text: "Commission oversight and rate configuration" },
 { icon: "⚙️", text: "Platform settings and API configuration" },
 ],
 },
};

export default function OnboardingModal({ role }: OnboardingModalProps) {
 const [visible, setVisible] = useState(false);
 const [step, setStep] = useState(0);

 useEffect(() => {
 if (!role) return;
 const seen = localStorage.getItem(`mbpp-onboarding-${role}`);
 if (!seen) {
 setVisible(true);
 }
 }, [role]);

 const dismiss = () => {
 if (role) localStorage.setItem(`mbpp-onboarding-${role}`, "1");
 setVisible(false);
 };

 if (!visible || !role) return null;

 const content = role === "head" ? roleContent.head : roleContent[role] || roleContent.agent;
 const steps = content.steps;
 const current = steps[step];

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={dismiss}>
 <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
 <div className="flex items-center gap-3 mb-5">
 <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
 <span className="text-lg">👋</span>
 </div>
 <div>
 <h3 className="text-base font-semibold text-gray-900">{content.title}</h3>
 <p className="text-xs text-gray-500">Quick tour — {step + 1} of {steps.length}</p>
 </div>
 </div>

 <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 mb-5 min-h-[120px] flex flex-col justify-center">
 <div className="text-center">
 <span className="text-3xl mb-3 block">{current.icon}</span>
 <p className="text-sm text-gray-700 leading-relaxed">{current.text}</p>
 </div>
 </div>

 <div className="flex items-center justify-center gap-1.5 mb-5">
 {steps.map((_, i) => (
 <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-[var(--color-primary)] w-4" : "bg-gray-300"}`} />
 ))}
 </div>

 <div className="flex gap-3">
 {step> 0 ? (
 <Button variant="ghost" onClick={() => setStep(step - 1)}>Previous</Button>
 ) : (
 <Button variant="ghost" onClick={dismiss}>Skip</Button>
 )}
 <div className="flex-1" />
 {step < steps.length - 1 ? (
 <Button onClick={() => setStep(step + 1)}>Next</Button>
 ) : (
 <Button onClick={dismiss}>Get Started</Button>
 )}
 </div>
 </div>
 </div>
 );
}
