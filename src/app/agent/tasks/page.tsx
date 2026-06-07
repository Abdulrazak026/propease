"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface MyTask { id: string; title: string; description: string; propertyType: string; area: string; budget: number; deadline: string; status: string; createdAt: string; }

const statusStyles: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-600",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  fulfilled: "Done",
  closed: "Closed",
};

export default function AgentTasksPage() {
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    api.get<{ tasks: MyTask[] }>("/api/tasks/my")
      .then(r => setTasks(r.data?.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const counts = {
    all: tasks.length,
    open: tasks.filter(t => t.status === "open").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    fulfilled: tasks.filter(t => t.status === "fulfilled").length,
  };

  const filters = [
    { v: "all", l: "All" },
    { v: "open", l: "Open" },
    { v: "in_progress", l: "In progress" },
    { v: "fulfilled", l: "Done" },
  ];

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500">Work assigned to you by your ambassador</p>
        </div>
        <Link href="/agent" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back to dashboard</Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${filter === f.v ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            {f.l} <span className="opacity-60 ml-1">{f.v === "all" ? counts.all : counts[f.v as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75M10.5 16.875h3.75M10.5 11.25h3.75M10.5 14.0625h3.75" /></svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">No tasks</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Your ambassador will assign tasks here. They'll show up automatically.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <Link
              key={t.id}
              href={`/agent/tasks/${t.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{t.propertyType}</span>
                    <span className="text-[10px] text-gray-500">📍 {t.area}</span>
                    <span className="text-[10px] text-gray-500">💰 ₦{t.budget.toLocaleString()}</span>
                    {t.deadline && (
                      <span className="text-[10px] text-gray-500">⏱ {new Date(t.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[t.status] || "bg-gray-100 text-gray-700"}`}>
                  {statusLabel[t.status] || t.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
