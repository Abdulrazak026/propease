"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useSettings } from "@/context/SettingsContext";
import Button from "@/components/ui/Button";
import { api, setAccessToken } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useRole();
  const { get: getSetting } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError(null);
    setSubmitting(true);
    const { status, data } = await api.post<{ accessToken: string; user: { role: string } }>("/api/auth/register", {
      name: form.name, email: form.email, password: form.password, role: "client",
    });
    setSubmitting(false);
    if (status === 201 && data) {
      setSuccess(true);
      // Auto-login
      setAccessToken(data.accessToken);
      await login(form.email, form.password);
      setTimeout(() => router.push("/"), 1500);
    } else if (status === 409) {
      setError("This email is already registered");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome aboard!</h2>
          <p className="text-sm text-gray-500 mt-2">Your account is ready. Redirecting you to the homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gray-900">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1200&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/90 to-gray-900/80" />
        <div className="relative flex flex-col justify-center p-16 text-white">
          <div className="max-w-md">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">Find Your Perfect Home</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Join {getSetting("site_name", "MBPP")} to browse verified properties, connect with trusted agents, and find your dream property in Kano.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{getSetting("site_name", "MBPP")}</h2>
          </div>

          <div className="mb-8">
            <a href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Back to Home
            </a>
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500 mt-1">Join for free and start exploring properties</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sadiq Abdullahi" required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] focus:bg-white transition-all" />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full py-3 text-base rounded-xl">
              {submitting ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating account...</span> : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-8">
            Already have an account?{" "}
            <a href="/login" className="text-[var(--color-primary)] hover:underline font-semibold">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
