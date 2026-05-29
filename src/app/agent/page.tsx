"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { tasks as allTasks } from "@/lib/mock-data";
import { TaskStatus } from "@/lib/types";
import TaskBoard from "@/components/tasks/TaskBoard";
import Button from "@/components/ui/Button";
import { formatNaira } from "@/lib/utils";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tasks assigned to you — drag cards between columns to update status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Tasks", value: stats.total, color: "text-gray-900" },
          { label: "Open", value: stats.open, color: "text-blue-600" },
          { label: "In Progress", value: stats.inProgress, color: "text-amber-600" },
          { label: "Fulfilled", value: stats.fulfilled, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
}
