"use client";
import { useState } from "react";
import { users } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function HeadUsers() {
  const [userList] = useState(users);
  const [showCreate, setShowCreate] = useState(false);

  const grouped = {
    head: userList.filter((u) => u.role === "head"),
    ambassador: userList.filter((u) => u.role === "ambassador"),
    agent: userList.filter((u) => u.role === "agent"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage roles, cities, and permissions</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "+ Add User"}
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Create New User</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="e.g. Nura Muhd" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="nura@propease.ng" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <option>Ambassador</option><option>Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <option>Kano Municipal</option><option>Fagge</option><option>Tarauni</option><option>Nassarawa</option>
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={() => { alert("User created! (Demo)"); setShowCreate(false); }}>Create User</Button>
        </div>
      )}

      {(["head", "ambassador", "agent"] as const).map((role) => (
        <div key={role}>
          <h2 className="text-sm font-semibold text-gray-900 capitalize mb-3">{role}s ({grouped[role].length})</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">City</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Permissions</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grouped[role].map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {u.canCreateTasks && <Badge variant="info">Can Create Tasks</Badge>}
                        {u.canCloseDeals && <Badge variant="success">Can Close Deals</Badge>}
                        {!u.canCreateTasks && !u.canCloseDeals && <span className="text-xs text-gray-400">Default</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost">Edit</Button>
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
