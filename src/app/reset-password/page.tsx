"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setSubmitting(true);
    setError(null);
    const { status, data } = await api.post<{ message: string }>("/api/auth/reset-password", { token, password });
    setSubmitting(false);
    if (status === 200) {
      setDone(true);
    } else {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  };

  if (done) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Password reset</h1>
          <p className="text-sm text-gray-500 mt-2">Your password has been updated. You can now sign in.</p>
          <a href="/login" className="inline-block mt-6 text-sm text-[var(--color-primary)] hover:underline font-medium">Sign in</a>
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
          <h1 className="text-2xl font-bold text-gray-900">Create new password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 border border-red-100">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Resetting..." : "Reset Password"}</Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <ResetForm />
    </Suspense>
  );
}
