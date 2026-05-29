"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { tasks, users } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";

export default function AmbassadorTasks() {
  const { currentUser } = useRole();
  const city = currentUser?.city || "";
  const cityTasks = tasks.filter((t) => t.area === city);
  const canCreate = currentUser?.canCreateTasks;
  const [showForm, setShowForm] = useState(false);

  const myAgents = users.filter((u) => u.ambassadorId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Task Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {canCreate ? "You can create and assign tasks" : "View tasks in your city"}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Task"}
          </Button>
        )}
      </div>

      {!canCreate && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800">
            🔒 The Head of Operations has not granted you permission to create tasks yet. You can view existing tasks.
          </p>
        </div>
      )}

      {showForm && canCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Create New Task</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="e.g. Find 4-bedroom house in Kano Municipal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <option>House</option><option>Flat</option><option>Land</option><option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                {myAgents.map((a) => <option key={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₦)</label>
              <input type="number" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="1500000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="date" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea rows={2} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" placeholder="Special requirements..." />
            </div>
            <div className="col-span-2">
              <Button className="w-full" onClick={() => { alert("Task created! (Demo)"); setShowForm(false); }}>Create Task</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {cityTasks.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>Assigned to: <strong>{t.assignedTo.name}</strong></span>
                  <span>Budget: {formatNaira(t.budget)}</span>
                  <span>Due: {formatDate(t.deadline)}</span>
                </div>
              </div>
              <Badge variant={t.status === "open" ? "info" : t.status === "in_progress" ? "warning" : t.status === "fulfilled" ? "success" : "default"}>
                {t.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        ))}
        {cityTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-400">No tasks in your city yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
