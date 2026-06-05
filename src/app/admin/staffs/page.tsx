"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { users } from "@/lib/mock-data";

export default function StaffsPage() {
  const [view, setView] = useState<"ambassadors" | "agents">("ambassadors");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [roleEdit, setRoleEdit] = useState<string | null>(null);

  const ambassadors = users.filter((u) => u.role === "ambassador");
  const agents = users.filter((u) => u.role === "agent");
  const list = view === "ambassadors" ? ambassadors : agents;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage ambassadors, agents, roles and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setView("ambassadors")} className={`p-4 rounded-lg border text-left transition-all ${view === "ambassadors" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
          <div className="text-2xl font-bold text-gray-900">{ambassadors.length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Ambassadors</div>
        </button>
        <button onClick={() => setView("agents")} className={`p-4 rounded-lg border text-left transition-all ${view === "agents" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
          <div className="text-2xl font-bold text-gray-900">{agents.length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Agents</div>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">City</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Permissions</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((user) => (
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
                  <td className="px-4 py-3 text-gray-600">{user.city}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isApproved ? "success" : "warning"}>{user.isApproved ? "Active" : "Pending"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.canCreateTasks && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Create Tasks</span>}
                      {user.canCloseDeals && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Close Deals</span>}
                      {!user.canCreateTasks && !user.canCloseDeals && <span className="text-[10px] text-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {roleEdit === user.id ? (
                        <div className="flex items-center gap-2">
                          <select className="text-xs rounded border border-gray-200 px-2 py-1" defaultValue={user.role}>
                            <option value="ambassador">Ambassador</option>
                            <option value="agent">Agent</option>
                          </select>
                          <button className="text-xs text-[var(--color-primary)] font-medium" onClick={() => setRoleEdit(null)}>Save</button>
                          <button className="text-xs text-gray-400" onClick={() => setRoleEdit(null)}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <button className="text-xs text-[var(--color-primary)] font-medium hover:underline" onClick={() => setRoleEdit(user.id)}>
                            Edit Role
                          </button>
                          <button className="text-xs text-gray-400 font-medium hover:text-gray-600" onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}>
                            {selectedUser === user.id ? "Hide" : "View"}
                          </button>
                        </>
                      )}
                    </div>
                    {selectedUser === user.id && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-gray-400">Wallet:</span> <span className="font-medium">₦{user.walletBalance.toLocaleString()}</span></div>
                          <div><span className="text-gray-400">Commission Rate:</span> <span className="font-medium">5%</span></div>
                          <div><span className="text-gray-400">Tasks:</span> <span className="font-medium">—</span></div>
                          <div><span className="text-gray-400">Deals:</span> <span className="font-medium">—</span></div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <label className="flex items-center gap-1 text-xs">
                            <input type="checkbox" defaultChecked={user.canCreateTasks} className="rounded" /> Create Tasks
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input type="checkbox" defaultChecked={user.canCloseDeals} className="rounded" /> Close Deals
                          </label>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded font-medium">Save Permissions</button>
                          <button className="text-xs bg-red-500 text-white px-3 py-1 rounded font-medium">{user.isApproved ? "Revoke" : "Approve"}</button>
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
    </div>
  );
}
