"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";

interface AdminTask { id: string; title: string; description: string; propertyType: string; area: string; budget: number; deadline: string; status: string; createdAt: string; createdBy: { id: string; name: string }; assignedTo: { id: string; name: string }; }
interface Agent { id: string; name: string; email: string; role: string; isApproved: boolean; }

const statusStyles: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-600",
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ title: "", description: "", area: "Kano Municipal", propertyType: "flat", budget: "", deadline: "", assignedToId: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<{ tasks: AdminTask[] }>("/api/tasks/all")
      .then(r => setTasks(r.data?.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const loadAgents = () => {
    api.get<{ users: Agent[] }>("/api/admin/users").then(r => {
      if (r.data?.users) setAgents(r.data.users.filter(u => u.role === "agent" && u.isApproved));
    }).catch(() => {});
  };

  useEffect(() => { loadAgents(); }, []);

  const createTask = async () => {
    if (!form.title || !form.assignedToId) return;
    setSaving(true);
    await api.post("/api/tasks", {
      title: form.title,
      description: form.description,
      area: form.area,
      propertyType: form.propertyType,
      budget: form.budget ? Number(form.budget) : 0,
      deadline: form.deadline || undefined,
      assignedToId: form.assignedToId,
    });
    setSaving(false);
    setShowCreate(false);
    setForm({ title: "", description: "", area: "Kano Municipal", propertyType: "flat", budget: "", deadline: "", assignedToId: "" });
    load();
  };

  const grouped = {
    open: tasks.filter(t => t.status === "open"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    fulfilled: tasks.filter(t => t.status === "fulfilled"),
    closed: tasks.filter(t => t.status === "closed"),
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-sm text-gray-500">Every task across the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCreate(!showCreate)} className="text-xs font-semibold px-3.5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90">+ Create Task</button>
          <Link href="/admin" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back to dashboard</Link>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Create New Task</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Task Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="e.g. Find 3-bed flat in Nassarawa" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assign To *</label>
              <select value={form.assignedToId} onChange={e => setForm({ ...form, assignedToId: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option value="">Select agent...</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Area</label>
              <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
              <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Budget (₦)</label>
              <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="Task details..." />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
            <Button disabled={saving || !form.title || !form.assignedToId} onClick={createTask}>{saving ? "Creating..." : "Create Task"}</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Open", v: grouped.open.length, c: "text-amber-600" },
          { l: "In progress", v: grouped.in_progress.length, c: "text-blue-600" },
          { l: "Done", v: grouped.fulfilled.length, c: "text-emerald-600" },
          { l: "Closed", v: grouped.closed.length, c: "text-gray-500" },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-3.5">
            <p className="text-xs text-gray-500">{s.l}</p>
            <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">No tasks</p>
          <p className="text-xs text-gray-500">Ambassadors can create tasks from the ambassador dashboard.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">City</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 50).map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[280px] truncate">{t.title}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{t.area}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{t.assignedTo?.name || "Unassigned"}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{t.budget.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[t.status] || "bg-gray-100 text-gray-700"}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
