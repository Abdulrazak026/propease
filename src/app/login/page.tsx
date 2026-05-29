"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { users } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  head: "bg-blue-100 text-blue-800",
  ambassador: "bg-amber-100 text-amber-800",
  agent: "bg-emerald-100 text-emerald-800",
};

export default function LoginPage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const { setCurrentUser } = useRole();
  const router = useRouter();

  const handleLogin = () => {
    if (!selectedUserId) return;
    const user = users.find((u) => u.id === selectedUserId);
    if (user) {
      setCurrentUser(user);
      router.push(user.role === "head" ? "/admin" : `/${user.role}`);
    }
  };

  const grouped = {
    admin: users.filter((u) => u.role === "admin"),
    head: users.filter((u) => u.role === "head"),
    ambassador: users.filter((u) => u.role === "ambassador"),
    agent: users.filter((u) => u.role === "agent"),
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

          <p className="text-xs text-gray-400 text-center mt-5">Demo mode — no password required</p>
        </div>

        <div className="mt-6 space-y-2">
          {(["admin", "head", "ambassador", "agent"] as const).map((role) => (
            <div key={role} className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className={roleColors[role]}>{role}</Badge>
                <span className="text-xs text-gray-500">{grouped[role].length} user{grouped[role].length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {grouped[role].map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setCurrentUser(u); router.push(u.role === "head" ? "/admin" : `/${u.role}`); }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-[var(--color-primary)] hover:text-white border border-gray-200 transition-all"
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
