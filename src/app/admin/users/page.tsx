"use client";
import { useState } from "react";
import { users } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatNaira } from "@/lib/utils";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  head: "bg-blue-100 text-blue-800",
  ambassador: "bg-amber-100 text-amber-800",
  agent: "bg-emerald-100 text-emerald-800",
};

export default function AdminUsers() {
  const [showCreate, setShowCreate] = useState(false);

  const grouped = {
    admin: users.filter((u) => u.role === "admin"),
    head: users.filter((u) => u.role === "head"),
    ambassador: users.filter((u) => u.role === "ambassador"),
    agent: users.filter((u) => u.role === "agent"),
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all accounts across the platform</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "+ Add User"}
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm space-y-4 animate-fade-in-up">
          <h2 className="text-sm font-semibold text-gray-900">Create New User</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="Full name" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="email@propease.ng" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
                <option>Admin</option><option>Head</option><option>Ambassador</option><option>Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
                <option>Kano Municipal</option><option>Fagge</option><option>Tarauni</option><option>Nassarawa</option>
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={() => { alert("User created! (Demo)"); setShowCreate(false); }}>Create User</Button>
        </div>
      )}

      {(["admin", "head", "ambassador", "agent"] as const).map((role) => (
        <div key={role}>
          <h2 className="text-sm font-semibold text-gray-900 capitalize mb-3">{role}s ({grouped[role].length})</h2>
          <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {grouped[role].map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <Badge variant={role === "admin" ? "info" : "default"} className={roleColors[role]}>{role}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{u.email}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{u.city}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-900">{formatNaira(u.walletBalance)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        {u.canCreateTasks && <Badge variant="info">Can Create Tasks</Badge>}
                        {u.canCloseDeals && <Badge variant="success">Can Close Deals</Badge>}
                        {(role === "admin" || role === "head") && <Badge variant="default">Full Access</Badge>}
                        {!u.canCreateTasks && !u.canCloseDeals && role === "agent" && <span className="text-xs text-gray-400">Standard</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
