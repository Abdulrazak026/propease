"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";

const demoUsers = [
 { label: "Admin", role: "admin", city: "Kano Municipal", email: "sani@propease.ng" },
 { label: "Ambassador", role: "ambassador", city: "Kano Municipal", email: "aisha@propease.ng" },
 { label: "Agent", role: "agent", city: "Kano Municipal", email: "fatima@propease.ng" },
];

function LoginForm() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState<string | null>(null);
 const [submitting, setSubmitting] = useState(false);
 const { login } = useRole();
 const router = useRouter();
 const searchParams = useSearchParams();
 const redirect = searchParams.get("redirect");

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);
 setSubmitting(true);
 const err = await login(email, password);
 setSubmitting(false);
 if (err) {
 setError(err);
 return;
 }
 router.push(redirect || "/");
 };

 const handleDemoLogin = async (demo: typeof demoUsers[number]) => {
 setSubmitting(true);
 setError(null);
 const err = await login(demo.email, "password123");
 setSubmitting(false);
 if (err) {
 setError("Demo login failed. Is the backend running?");
 return;
 }
 router.push(redirect || `/${demo.role}`);
 };

 return (
 <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
 <div className="w-full max-w-md-up">
 <div className="text-center mb-8">
 <div className="w-14 h-14 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--color-primary)]/20">
 <span className="text-white font-bold text-2xl">P</span>
 </div>
 <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
 <p className="text-sm text-gray-500 mt-1">Sign in to your MBPP dashboard</p>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-gray-700">Email</label>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="you@email.com"
 required
 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
 />
 </div>
 <div className="space-y-2">
 <label className="block text-sm font-medium text-gray-700">Password</label>
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Enter your password"
 required
 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
 />
 </div>

 {error && (
 <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2 border border-red-100">{error}</p>
 )}

 <Button type="submit" disabled={submitting} className="w-full">
 {submitting ? "Signing in..." : "Sign In"}
 </Button>
 </form>
 </div>

 <div className="mt-6">
 <p className="text-xs text-gray-400 text-center mb-3">Or use a demo account (backend required):</p>
 <div className="grid grid-cols-3 gap-2">
 {demoUsers.map((u) => {
 const roleStyles: Record<string, string> = {
 admin: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-600 hover:text-white",
 ambassador: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-600 hover:text-white",
 agent: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-600 hover:text-white",
 };
 return (
 <button
 key={u.role}
 type="button"
 disabled={submitting}
 onClick={() => handleDemoLogin(u)}
 className={`flex flex-col items-center gap-1.5 p-4 rounded-lg border transition-all text-center ${roleStyles[u.role]}`}
>
 <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
 {u.label[0]}
 </div>
 <div>
 <p className="text-xs font-semibold leading-tight">{u.label}</p>
 <p className="text-[10px] opacity-80">{u.city}</p>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 );
}

export default function LoginPage() {
 return (
 <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
 <LoginForm />
 </Suspense>
 );
}
