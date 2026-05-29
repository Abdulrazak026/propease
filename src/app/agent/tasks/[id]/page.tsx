"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { tasks } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate, propertyTypeLabels, statusColors } from "@/lib/utils";

export default function AgentTaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-gray-900">Task not found</h2>
        <Link href="/agent" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">← Back to tasks</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{task.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Created by {task.createdBy.name} • {formatDate(task.createdAt)}</p>
          </div>
          <Badge variant={task.status === "open" ? "info" : task.status === "in_progress" ? "warning" : task.status === "fulfilled" ? "success" : "default"}>
            {task.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-xs text-gray-500">Property Type</p>
            <p className="text-sm font-medium text-gray-900">{propertyTypeLabels[task.propertyType]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Area</p>
            <p className="text-sm font-medium text-gray-900">{task.area}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium text-[var(--color-primary)]">{formatNaira(task.budget)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(task.deadline)}</p>
          </div>
        </div>

        {task.notes && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Special Notes</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{task.notes}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => alert("Mark task as in progress (demo)")}>
            Start Task
          </Button>
          <Button size="sm" variant="outline" onClick={() => alert("Submit found property form (demo)")}>
            Submit Found Property
          </Button>
          <Button size="sm" variant="outline" onClick={() => alert("Mark as fulfilled (demo)")}>
            Mark Fulfilled
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 text-sm mb-4">Comments ({task.comments.length})</h2>

        {task.comments.length > 0 ? (
          <div className="space-y-3">
            {task.comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-[var(--color-primary)]">
                    {c.author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">{c.author.name}</span>
                    <span className="text-[10px] text-gray-400">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No comments yet</p>
        )}

        <div className="mt-4 flex gap-2">
          <input
            placeholder="Add a comment..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            onKeyDown={(e) => e.key === "Enter" && alert(`Comment sent (demo): ${(e.target as HTMLInputElement).value}`)}
          />
          <Button size="sm">Send</Button>
        </div>
      </div>
    </div>
  );
}
