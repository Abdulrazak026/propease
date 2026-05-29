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
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to PropEase</h1>
          <p className="text-sm text-gray-500 mt-1">Select a role to access the demo dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
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

          <p className="text-xs text-gray-400 text-center mt-4">
            This is a demo. No password required. Select a user to see their dashboard.
          </p>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-800">🎯 Demo Tips</h3>
          <ul className="text-xs text-amber-700 mt-2 space-y-1">
            <li>• <strong>Head</strong>: See the full system overview</li>
            <li>• <strong>Ambassador</strong>: Manage your city, post listings, create tasks</li>
            <li>• <strong>Agent</strong>: View your task board and inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
