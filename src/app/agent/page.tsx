"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { tasks as allTasks, commissions, inquiries } from "@/lib/mock-data";
import { TaskStatus } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import TaskBoard from "@/components/tasks/TaskBoard";

export default function AgentTaskBoard() {
  const { currentUser } = useRole();
  const [tasks, setTasks] = useState(allTasks.filter((t) => t.assignedTo.id === currentUser?.id));

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const myCommissions = commissions.filter((c) => c.agent.id === currentUser?.id);
  const myInquiries = inquiries.filter((i) => i.assignedAgent?.id === currentUser?.id);
  const fulfilledTasks = tasks.filter((t) => t.status === "fulfilled");

  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "open").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    fulfilled: fulfilledTasks.length,
  };

  const metrics = [
    { label: "Tasks Completed", value: fulfilledTasks.length, sub: `${stats.total} total assigned`, accent: "bg-emerald-100", color: "text-emerald-600" },
    { label: "Commissions Earned", value: formatNaira(myCommissions.reduce((s, c) => s + c.agentCut, 0)), sub: `${myCommissions.length} deals`, accent: "bg-[var(--color-primary)]/10", color: "text-[var(--color-primary)]" },
    { label: "Inquiries Received", value: myInquiries.length, sub: `${myInquiries.filter(i => i.status === "new").length} new`, accent: "bg-blue-100", color: "text-blue-600" },
    { label: "Avg. Completion", value: stats.total > 0 ? Math.round((fulfilledTasks.length / stats.total) * 100) + "%" : "0%", sub: "of all tasks", accent: "bg-amber-100", color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Performance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your activity and earnings overview</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
                <span className={`text-sm font-bold ${s.color}`}>{typeof s.value === "string" && s.value.startsWith("₦") ? "₦" : s.value.toString().replace("%", "")}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Task Board</h2>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Open: {stats.open}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress: {stats.inProgress}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Done: {stats.fulfilled}</span>
          </div>
        </div>
        <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}
