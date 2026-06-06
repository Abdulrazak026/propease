"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";
import { api } from "@/lib/api-client";

export default function AgentTaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get<any>(`/api/tasks/${id}`).then(r => {
      if (r.data) setTask((r.data as any).task || r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(status);
    try {
      const r = await api.patch(`/api/tasks/${id}/status`, { status });
      if (r.data) setTask((r.data as any).task || r.data);
    } catch {}
    setUpdating("");
  };

  const sendComment = async () => {
    if (!commentText.trim()) return;
    setSendingComment(true);
    try {
      const r = await api.post(`/api/tasks/${id}/comments`, { text: commentText.trim() });
      if ((r.data as any)?.comment) {
        setTask((prev: any) => ({ ...prev, comments: [...(prev.comments || []), (r.data as any).comment] }));
      }
      setCommentText("");
      commentRef.current?.focus();
    } catch {}
    setSendingComment(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!task) return <div className="text-center py-24"><div className="text-5xl mb-4">&#x1F50D;</div><h2 className="text-lg font-semibold text-gray-900">Task not found</h2><Link href="/agent" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">&#x2190; Back to tasks</Link></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Back
      </button>

      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div><h1 className="text-lg font-bold text-gray-900">{task.title}</h1><p className="text-sm text-gray-500 mt-1">Created by {task.createdBy?.name || "unknown"} &#x2022; {formatDate(task.createdAt)}</p></div>
          <Badge variant={task.status === "open" ? "info" : task.status === "in_progress" ? "warning" : task.status === "fulfilled" ? "success" : "default"}>{task.status.replace("_", " ")}</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div><p className="text-xs text-gray-500">Property Type</p><p className="text-sm font-medium text-gray-900">{propertyTypeLabels[task.propertyType] || task.propertyType}</p></div>
          <div><p className="text-xs text-gray-500">Area</p><p className="text-sm font-medium text-gray-900">{task.area}</p></div>
          <div><p className="text-xs text-gray-500">Budget</p><p className="text-sm font-medium text-[var(--color-primary)]">{formatNaira(task.budget)}</p></div>
          <div><p className="text-xs text-gray-500">Deadline</p><p className="text-sm font-medium text-gray-900">{formatDate(task.deadline)}</p></div>
        </div>

        {task.notes && <div className="mt-4"><p className="text-xs text-gray-500 mb-1">Special Notes</p><p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{task.notes}</p></div>}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" disabled={updating !== "" || task.status === "in_progress"} onClick={() => updateStatus("in_progress")}>{updating === "in_progress" ? "..." : task.status === "in_progress" ? "In Progress" : "Start Task"}</Button>
          <Button size="sm" variant="outline" disabled={updating !== "" || task.status === "fulfilled"} onClick={() => updateStatus("fulfilled")}>{updating === "fulfilled" ? "..." : "Mark Fulfilled"}</Button>
          <Button size="sm" variant="outline" disabled={updating !== "" || task.status === "closed"} onClick={() => updateStatus("closed")}>{updating === "closed" ? "..." : "Close Task"}</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 text-sm mb-4">Comments ({task.comments?.length || 0})</h2>
        {task.comments?.length > 0 ? (
          <div className="space-y-3">
            {task.comments.map((c: any) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0"><span className="text-xs font-medium text-[var(--color-primary)]">{c.author?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</span></div>
                <div><div className="flex items-center gap-2"><span className="text-xs font-medium text-gray-900">{c.author?.name}</span><span className="text-[10px] text-gray-400">{formatDate(c.createdAt)}</span></div><p className="text-sm text-gray-600 mt-0.5">{c.text}</p></div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400">No comments yet</p>}

        <div className="mt-4 flex gap-2">
          <input ref={commentRef} value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" onKeyDown={e => e.key === "Enter" && sendComment()} />
          <Button size="sm" onClick={sendComment} disabled={sendingComment || !commentText.trim()}>{sendingComment ? "..." : "Send"}</Button>
        </div>
      </div>
    </div>
  );
}
