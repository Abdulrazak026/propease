"use client";
import { useState } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post("/api/auth/forgot-password", { email });
    setSent(true);
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
          <p className="text-sm text-gray-500 mt-2">If an account exists for {email}, we&apos;ve sent a password reset link.</p>
          <a href="/login" className="inline-block mt-6 text-sm text-[var(--color-primary)] hover:underline font-medium">Back to sign in</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--color-primary)]/20">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Sending..." : "Send Reset Link"}</Button>
          <a href="/login" className="block text-center text-xs text-gray-400 hover:text-[var(--color-primary)]">Back to sign in</a>
        </form>
      </div>
    </div>
  );
}
