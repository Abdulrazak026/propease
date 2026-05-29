"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { users } from "@/lib/mock-data";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const { setCurrentUser } = useRole();
  const router = useRouter();

  const handleLogin = () => {
    if (!selectedUserId) return;
    const user = users.find((u) => u.id === selectedUserId);
    if (user) {
      setCurrentUser(user);
      router.push(`/${user.role}`);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--color-primary)]/20">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your PropEase dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
              >
                <option value="">Choose a demo user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role} ({u.city})
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={handleLogin} disabled={!selectedUserId} className="w-full">
              Enter Dashboard
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-5">
            Demo mode — no password required
          </p>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Quick Guide
          </h3>
          <ul className="text-xs text-amber-700 mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span><strong>Head</strong>: Full system overview, user & commission management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span><strong>Ambassador</strong>: City management, listings, tasks, commissions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span><strong>Agent</strong>: Task board, inquiries, commission tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
