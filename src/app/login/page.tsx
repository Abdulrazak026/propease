"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { useSettings } from "@/context/SettingsContext";
import Button from "@/components/ui/Button";

const rolePath = (role: string) => role === "head" ? "/admin" : role === "client" ? "/" : `/${role}`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useRole();
  const { get: getSetting } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    if (typeof result === "string") {
      setError(result);
      setSubmitting(false);
    } else {
      router.push(redirect || rolePath(result.role));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — visual panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=1200&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/90 to-gray-900/80" />
        <div className="relative flex flex-col justify-center p-16 text-white">
          <div className="max-w-md">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Your Property,<br />Your Future
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10">
              {getSetting("site_tagline", "Find verified properties in Kano. Rent, buy, or sell with trusted agents.")}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { v: "500+", l: "Properties" },
                { v: "50+", l: "Verified Agents" },
                { v: "24/7", l: "Support" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold">{s.v}</div>
                  <div className="text-sm text-white/60 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
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
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your details to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] focus:bg-white transition-all" />
              <div className="text-right mt-1.5">
                <a href="/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline font-medium">Forgot password?</a>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
            <Button type="submit" disabled={submitting} className="w-full py-3 text-base rounded-xl">
              {submitting ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</span> : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-8">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-[var(--color-primary)] hover:underline font-semibold">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
