"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";
import { api } from "@/lib/api-client";

export default function AdminTaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState<string | null>(null);

  useEffect(() => {
    api.get<any>(`/api/tasks/${id}`).then(r => {
      if (r.data) setTask((r.data as any).task || r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
    api.get<any>(`/api/tasks/${id}/submissions`).then(r => {
      if ((r.data as any)?.submissions) setSubmissions((r.data as any).submissions);
    }).catch(() => {});
  }, [id]);

  const sendComment = async () => {
    if (!commentText.trim()) return;
    setSendingComment(true);
    try {
      const r = await api.post(`/api/tasks/${id}/comments`, { text: commentText.trim() });
      if ((r.data as any)?.comment) {
        setTask((prev: any) => ({ ...prev, comments: [...(prev.comments || []), (r.data as any).comment] }));
      }
      setCommentText("");
    } catch {}
    setSendingComment(false);
  };

  const reviewSubmission = async (submissionId: string, status: string) => {
    setReviewing(submissionId);
    try {
      await api.patch(`/api/tasks/${id}/submissions/${submissionId}`, { status });
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status } : s));
      if (status === "approved") {
        setTask((prev: any) => ({ ...prev, status: "fulfilled" }));
      } else {
        setTask((prev: any) => ({ ...prev, status: "in_progress" }));
      }
    } catch {}
    setReviewing(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!task) return <div className="text-center py-24"><h2 className="text-lg font-semibold text-gray-900">Task not found</h2><Link href="/admin/tasks" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">← Back to tasks</Link></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Back
      </button>

      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{task.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Created by {task.createdBy?.name || "unknown"} • {formatDate(task.createdAt)}</p>
          </div>
          <Badge variant={task.status === "open" ? "info" : task.status === "in_progress" ? "warning" : task.status === "fulfilled" ? "success" : "default"}>{task.status.replace("_", " ")}</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div><p className="text-xs text-gray-500">Property Type</p><p className="text-sm font-medium text-gray-900">{propertyTypeLabels[task.propertyType] || task.propertyType}</p></div>
          <div><p className="text-xs text-gray-500">Area</p><p className="text-sm font-medium text-gray-900">{task.area}</p></div>
          <div><p className="text-xs text-gray-500">Budget</p><p className="text-sm font-medium text-[var(--color-primary)]">{formatNaira(task.budget)}</p></div>
          <div><p className="text-xs text-gray-500">Deadline</p><p className="text-sm font-medium text-gray-900">{formatDate(task.deadline)}</p></div>
        </div>

        {task.notes && <div className="mt-4"><p className="text-xs text-gray-500 mb-1">Special Notes</p><p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{task.notes}</p></div>}

        {task.assignedTo && <div className="mt-4 flex items-center gap-2 text-sm text-gray-600"><span className="font-medium">Assigned to:</span> {task.assignedTo.name}</div>}
      </div>

      {/* Submissions */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Submissions ({submissions.length})</h2>
          <div className="space-y-4">
            {submissions.map((s: any) => (
              <div key={s.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">{s.submittedBy?.name}</span>
                  <Badge variant={s.status === "approved" ? "success" : s.status === "rejected" ? "danger" : "warning"}>{s.status}</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{s.description}</p>
                {s.photos?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto mb-3">
                    {s.photos.map((p: string, i: number) => (
                      <img key={i} src={p} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                )}
                {s.adminNotes && <p className="text-xs text-gray-500 mt-2">Admin: {s.adminNotes}</p>}
                <p className="text-[10px] text-gray-400 mt-2">{formatDate(s.createdAt)}</p>
                {s.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="primary" onClick={() => reviewSubmission(s.id, "approved")} disabled={reviewing === s.id}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => reviewSubmission(s.id, "rejected")} disabled={reviewing === s.id}>Reject</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
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
          <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" onKeyDown={e => e.key === "Enter" && sendComment()} />
          <Button size="sm" onClick={sendComment} disabled={sendingComment || !commentText.trim()}>{sendingComment ? "..." : "Send"}</Button>
        </div>
      </div>
    </div>
  );
}