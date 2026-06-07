"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";

interface Task { id: string; title: string; description: string; status: string; propertyType: string; area: string; budget: number; deadline: string; assignedTo?: { name: string } | null; }

export default function AmbassadorTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get<{ tasks: Task[] }>("/api/tasks/my"),
    ]).then(([tasksR]) => {
      if (!cancelled && tasksR.data?.tasks) setTasks(tasksR.data.tasks);
      if (!cancelled) setLoading(false);
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/ambassador" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
          <div><h1 className="text-xl font-bold text-gray-900">Tasks</h1><p className="text-xs text-gray-500">Manage city assignments</p></div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
              <Badge variant={t.status === "open" ? "warning" : t.status === "in_progress" ? "default" : "success"}>{t.status}</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-3">{t.description}</p>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div><span className="text-gray-400">Area</span><p className="font-medium">{t.area}</p></div>
              <div><span className="text-gray-400">Budget</span><p className="font-medium">₦{t.budget.toLocaleString()}</p></div>
              <div><span className="text-gray-400">Deadline</span><p className="font-medium">{new Date(t.deadline).toLocaleDateString()}</p></div>
              <div><span className="text-gray-400">Assignee</span><p className="font-medium">{t.assignedTo?.name || "Unassigned"}</p></div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No tasks yet</div>}
      </div>
    </div>
  );
}
