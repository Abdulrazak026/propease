"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { tasks as allTasks } from "@/lib/mock-data";
import { TaskStatus } from "@/lib/types";
import TaskBoard from "@/components/tasks/TaskBoard";

export default function AgentTaskBoard() {
  const { currentUser } = useRole();
  const [tasks, setTasks] = useState(allTasks.filter((t) => t.assignedTo.id === currentUser?.id));

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "open").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    fulfilled: tasks.filter((t) => t.status === "fulfilled").length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Drag cards between columns to update status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Tasks", value: stats.total, color: "text-gray-900", accent: "bg-gray-100" },
          { label: "Open", value: stats.open, color: "text-blue-600", accent: "bg-blue-100" },
          { label: "In Progress", value: stats.inProgress, color: "text-amber-600", accent: "bg-amber-100" },
          { label: "Fulfilled", value: stats.fulfilled, color: "text-emerald-600", accent: "bg-emerald-100" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
                <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
              </div>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
}
