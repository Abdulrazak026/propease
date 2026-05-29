"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "agent" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registration submitted! (Demo) A head/admin will review and approve your account.");
    router.push("/login");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Join PropEase</h1>
          <p className="text-sm text-gray-500 mt-1">Register as an agent or ambassador</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Sadiq Abdullahi" />
          <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com" />
          <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="0803 XXX XXXX" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">I want to join as</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="agent">Agent</option>
              <option value="ambassador">Ambassador</option>
            </select>
          </div>

          <Button type="submit" className="w-full">Submit Registration</Button>

          <p className="text-xs text-gray-400 text-center">
            Already have an account?{" "}
            <button type="button" onClick={() => router.push("/login")} className="text-[var(--color-primary)] hover:underline">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
