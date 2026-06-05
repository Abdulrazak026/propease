"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { tasks, users } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate } from "@/lib/utils";

export default function AmbassadorTasks() {
 const { currentUser } = useRole();
 const city = currentUser?.city || "";
 const cityTasks = tasks.filter((t) => t.area === city);
 const canCreate = currentUser?.canCreateTasks;
 const [showForm, setShowForm] = useState(false);

 const myAgents = users.filter((u) => u.ambassadorId === currentUser?.id);

 return (
 <div className="space-y-6-up">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Task Management</h1>
 <p className="text-sm text-gray-500 mt-0.5">
 {canCreate ? "Create and assign tasks to your agents" : "View tasks in your city"}
 </p>
 </div>
 {canCreate && (
 <Button onClick={() => setShowForm(!showForm)}>
 {showForm ? "Cancel" : "+ New Task"}
 </Button>
 )}
 </div>

 {!canCreate && (
 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
 <div className="flex items-start gap-2">
 <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
 <p className="text-xs text-amber-800">
 The Head of Operations has not granted you permission to create tasks yet. You can view existing tasks.
 </p>
 </div>
 </div>
 )}

 {showForm && canCreate && (
 <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4-up">
 <h2 className="text-sm font-semibold text-gray-900">Create New Task</h2>
 <div className="grid grid-cols-2 gap-4">
 <div className="col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
 <input className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" placeholder="e.g. Find 4-bedroom house in Kano Municipal" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
 <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all">
 <option>House</option><option>Flat</option><option>Land</option><option>Commercial</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
 <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all">
 {myAgents.map((a) => <option key={a.id}>{a.name}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₦)</label>
 <input type="number" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" placeholder="1500000" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
 <input type="date" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" />
 </div>
 <div className="col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
 <textarea rows={2} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none" placeholder="Special requirements..." />
 </div>
 <div className="col-span-2">
 <Button className="w-full" onClick={() => { alert("Task created! (Demo)"); setShowForm(false); }}>Create Task</Button>
 </div>
 </div>
 </div>
 )}

 <div className="space-y-3">
 {cityTasks.map((t) => (
 <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-5 card-hover">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
 <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
 <span>Assigned to: <strong className="text-gray-700">{t.assignedTo.name}</strong></span>
 <span className="w-px h-3 bg-gray-200" />
 <span>Budget: <strong className="text-gray-700">{formatNaira(t.budget)}</strong></span>
 <span className="w-px h-3 bg-gray-200" />
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
 <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
 <p className="text-sm text-gray-400">No tasks in your city yet</p>
 </div>
 )}
 </div>
 </div>
 );
}
