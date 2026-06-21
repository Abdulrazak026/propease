"use client";
import { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { usePermissions } from "@/lib/use-permissions";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";

interface Task {
  id: string; title: string; description: string; status: string;
  propertyType: string; area: string; budget: number; deadline: string;
  createdBy?: { id: string; name: string } | null;
  assignedTo?: { id: string; name: string } | null;
}

interface Agent { id: string; name: string; email?: string; }

export default function AmbassadorTasksPage() {
  const { currentUser } = useRole();
  const perms = usePermissions();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [saving, setSaving] = useState(false);
  const [reassigning, setReassigning] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", propertyType: "flat", budget: "", deadline: "", assignedToId: "",
  });

  const load = () => {
    setLoading(true);
    api.get<{ tasks: Task[] }>("/api/ambassador/tasks")
      .then(r => setTasks(r.data?.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    if (!perms.canCreateTasks) return;
    api.get<{ agents: Agent[] }>("/api/ambassador/agents")
      .then(r => setAgents(r.data?.agents || []))
      .catch(() => {});
  }, [perms.canCreateTasks]);

  const createTask = async () => {
    if (!form.title) return;
    setSaving(true);
    const res = await api.post<{ task: Task }>("/api/tasks", {
      title: form.title,
      description: form.description,
      area: currentUser?.city || "",
      propertyType: form.propertyType,
      budget: form.budget ? Number(form.budget) : 0,
      deadline: form.deadline || undefined,
      assignedToId: form.assignedToId || undefined,
    });
    setSaving(false);
    if (res.error || (res.status >= 400)) {
      alert(res.data && (res.data as any).error ? (res.data as any).error : "Failed to create task");
      return;
    }
    setShowCreate(false);
    setForm({ title: "", description: "", propertyType: "flat", budget: "", deadline: "", assignedToId: "" });
    load();
  };

  const reassign = async (taskId: string, agentId: string) => {
    setReassigning(taskId);
    const res = await api.patch(`/api/tasks/${taskId}`, { assignedToId: agentId || null });
    setReassigning(null);
    if (res.error || (res.status >= 400)) {
      alert(res.data && (res.data as any).error ? (res.data as any).error : "Failed to reassign task");
      return;
    }
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <a href="/ambassador" className="text-gray-400 hover:text-[var(--color-primary)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </a>
          <div><h1 className="text-xl font-bold text-gray-900">Tasks</h1><p className="text-xs text-gray-500">Manage city assignments</p></div>
        </div>
        {perms.canCreateTasks && (
          <button onClick={() => setShowCreate(!showCreate)} className="text-xs font-semibold px-3.5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90">+ Create Task</button>
        )}
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Assign To</label>
              <select value={form.assignedToId} onChange={e => setForm({ ...form, assignedToId: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option value="">Open — Any agent can take it</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
              <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option value="flat">Flat</option><option value="house">House</option><option value="land">Land</option><option value="office">Office</option><option value="shop">Shop</option>
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
            <button disabled={saving || !form.title} onClick={createTask} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 disabled:opacity-50">
              {saving ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
                <Badge variant={t.status === "open" ? "warning" : t.status === "in_progress" ? "default" : "success"}>{t.status}</Badge>
              </div>
              <p className="text-xs text-gray-500 mb-3">{t.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><span className="text-gray-400">Area</span><p className="font-medium">{t.area}</p></div>
                <div><span className="text-gray-400">Budget</span><p className="font-medium">₦{t.budget.toLocaleString()}</p></div>
                <div><span className="text-gray-400">Deadline</span><p className="font-medium">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</p></div>
                <div>
                  <span className="text-gray-400">Assignee</span>
                  <div className="flex items-center gap-1">
                    {reassigning === t.id ? (
                      <select
                        value={t.assignedTo?.id || ""}
                        onChange={e => reassign(t.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
                        autoFocus
                        onBlur={() => setReassigning(null)}
                      >
                        <option value="">Unassigned</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    ) : (
                      <>
                        <p className="font-medium">{t.assignedTo?.name || "Unassigned"}</p>
                        {perms.canCreateTasks && (
                          <button onClick={() => setReassigning(t.id)} className="ml-1 text-[10px] text-[var(--color-primary)] hover:underline">Reassign</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No tasks in your cities yet.</div>}
        </div>
      )}
    </div>
  );
}
