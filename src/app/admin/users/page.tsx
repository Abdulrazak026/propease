"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { users } from "@/lib/mock-data";

const ROLE_TABS = ["all", "head", "ambassador", "agent"] as const;

export default function UsersPage() {
  const [tab, setTab] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = tab === "all" ? users : users.filter((u) => u.role === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage platform users, approvals, and roles</p>
          </div>
        </div>
        <Button onClick={() => setShowAdd(true)} className="shrink-0">+ Add User</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {ROLE_TABS.map((r) => (
          <button
            key={r}
            onClick={() => setTab(r)}
            className={`px-4 py-2 text-xs font-medium rounded-lg border capitalize transition-all whitespace-nowrap ${
              tab === r ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">User</th>
                <th className="px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="px-4 py-3 font-medium text-gray-600">City</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Wallet</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge>{user.role}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{user.city || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isApproved ? "success" : "warning"}>{user.isApproved ? "Approved" : "Pending"}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">₦{user.walletBalance.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <button onClick={() => setSelected(selected === user.id ? null : user.id)} className="text-xs text-[var(--color-primary)] font-medium hover:underline">
                        {selected === user.id ? "Hide" : "View"}
                      </button>
                      {user.role !== "head" && (
                        <button className="text-xs text-amber-600 font-medium hover:underline">
                          {user.isApproved ? "Revoke" : "Approve"}
                        </button>
                      )}
                    </div>
                    {selected === user.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div><span className="text-gray-400">Verified:</span> <span>{user.isVerified ? "Yes" : "No"}</span></div>
                          <div><span className="text-gray-400">Deals:</span> <span>{user.canCloseDeals ? "Yes" : "No"}</span></div>
                          <div><span className="text-gray-400">Tasks:</span> <span>{user.canCreateTasks ? "Yes" : "No"}</span></div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs bg-[var(--color-primary)] text-white px-2 py-1 rounded">View Details</button>
                          <button className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Edit</button>
                          <button className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Suspend</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New User</h3>
            <div className="space-y-3">
              <input placeholder="Full Name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <input type="email" placeholder="Email" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option>head</option><option>ambassador</option><option>agent</option>
              </select>
              <input type="password" placeholder="Password" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" onClick={() => setShowAdd(false)}>Create User</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
