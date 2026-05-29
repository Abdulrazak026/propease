"use client";
import { DragEvent, useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const columns: { status: TaskStatus; label: string; accent: string; bg: string }[] = [
  { status: "open", label: "Open", accent: "bg-blue-500", bg: "bg-blue-50/50" },
  { status: "in_progress", label: "In Progress", accent: "bg-amber-500", bg: "bg-amber-50/50" },
  { status: "fulfilled", label: "Fulfilled", accent: "bg-emerald-500", bg: "bg-emerald-50/50" },
  { status: "closed", label: "Closed", accent: "bg-gray-400", bg: "bg-gray-50/50" },
];

export default function TaskBoard({ tasks, onStatusChange }: TaskBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => setDraggedId(taskId);

  const handleDrop = (status: TaskStatus) => {
    if (draggedId) {
      onStatusChange(draggedId, status);
      setDraggedId(null);
    }
  };

  const handleDragOver = (e: DragEvent) => e.preventDefault();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.status)}
            className={`rounded-xl border border-gray-200/60 p-3 min-h-[200px] transition-colors ${draggedId ? col.bg : ""}`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.accent}`} />
                <h3 className="text-sm font-semibold text-gray-700">{col.label}</h3>
              </div>
              <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full font-medium text-gray-500">
                {colTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard task={task} />
                </div>
              ))}
              {colTasks.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">No tasks</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
