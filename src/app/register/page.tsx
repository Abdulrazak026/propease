"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api-client";
import type { ApiUser } from "@/lib/api-types";

export default function RegisterPage() {
 const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" });
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);
 setSubmitting(true);

 const { status, data } = await api.post<{ user: ApiUser; message: string }>(
 "/api/auth/register",
 {
 name: form.name,
 email: form.email,
  password: form.password,
 role: form.role,
 }
 );

 setSubmitting(false);

 if (status === 201 && data) {
 setSuccess(true);
 setTimeout(() => router.push("/login"), 2000);
 } else if (status === 409) {
 setError("This email is already registered");
 } else {
 setError("Registration failed. Please try again.");
 }
 };

 if (success) {
 return (
 <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
 <div className="text-center max-w-md">
 <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <h2 className="text-xl font-bold text-gray-900">Registration submitted!</h2>
 <p className="text-sm text-gray-500 mt-2">A head/admin will review and approve your account.</p>
 </div>
 </div>
 );
 }

 return (
 <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
 <div className="w-full max-w-md-up">
 <div className="text-center mb-8">
 <div className="w-14 h-14 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--color-primary)]/20">
 <span className="text-white font-bold text-2xl">P</span>
 </div>
 <h1 className="text-2xl font-bold text-gray-900">Join MBPP</h1>
 <p className="text-sm text-gray-500 mt-1">Register as an agent or ambassador</p>
 </div>

 <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg space-y-4">
 <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Sadiq Abdullahi" />
 <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com" />
  <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Min. 8 characters" />

 <div className="space-y-1.5">
 <label className="block text-sm font-medium text-gray-700">I want to join as</label>
 <select
 value={form.role}
 onChange={(e) => setForm({ ...form, role: e.target.value })}
 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
>
 <option value="agent">Agent</option>
 <option value="ambassador">Ambassador</option>
 </select>
 </div>

 {error && (
 <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 border border-red-100">{error}</p>
 )}

 <Button type="submit" disabled={submitting} className="w-full">
 {submitting ? "Submitting..." : "Submit Registration"}
 </Button>

 <p className="text-xs text-gray-400 text-center mt-2">
 Already have an account?{" "}
 <button type="button" onClick={() => router.push("/login")} className="text-[var(--color-primary)] hover:underline font-medium">
 Sign in
 </button>
 </p>
 </form>
 </div>
 </div>
 );
}
