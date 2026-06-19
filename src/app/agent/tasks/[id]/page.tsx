"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";
import { api, getAccessToken } from "@/lib/api-client";
import { usePermissions } from "@/lib/use-permissions";

export default function AgentTaskDetail() {
  const perms = usePermissions();
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitDesc, setSubmitDesc] = useState("");
  const [submitPhotos, setSubmitPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const photoFileRef = useRef<HTMLInputElement>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    api.get<any>(`/api/tasks/${id}`).then(r => {
      if (r.data) setTask((r.data as any).task || r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
    // Load submissions
    api.get<any>(`/api/tasks/${id}/submissions`).then(r => {
      if ((r.data as any)?.submissions) setSubmissions((r.data as any).submissions);
    }).catch(() => {});
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const token = getAccessToken();
    for (const file of Array.from(files).slice(0, 10)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch(`https://mbpproperties.com/api/upload`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
        if (res.ok) { const { url } = await res.json(); setSubmitPhotos(prev => [...prev, url]); }
      } catch {}
    }
    setUploading(false);
    if (photoFileRef.current) photoFileRef.current.value = "";
  };

  const submitTask = async () => {
    if (!submitDesc.trim()) return;
    setSubmitting(true);
    try {
      const r = await api.post(`/api/tasks/${id}/submit`, {
        description: submitDesc,
        photos: submitPhotos,
      });
      if ((r.data as any)?.submission) {
        setSubmissions(prev => [(r.data as any).submission, ...prev]);
        setTask((prev: any) => ({ ...prev, status: "submitted" }));
        setShowSubmit(false);
        setSubmitDesc("");
        setSubmitPhotos([]);
      }
    } catch {}
    setSubmitting(false);
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

        {perms.canCreateTasks && <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" disabled={updating !== "" || task.status === "in_progress"} onClick={() => updateStatus("in_progress")}>{updating === "in_progress" ? "..." : task.status === "in_progress" ? "In Progress" : "Start Task"}</Button>
          {!showSubmit && task.status !== "submitted" && task.status !== "fulfilled" && task.status !== "closed" && (
            <Button size="sm" variant="primary" onClick={() => setShowSubmit(true)}>Submit Task</Button>
          )}
          <Button size="sm" variant="outline" disabled={updating !== "" || task.status === "closed"} onClick={() => updateStatus("closed")}>{updating === "closed" ? "..." : "Close Task"}</Button>
        </div>}

        {/* Task Submission Form */}
        {showSubmit && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Submit Task Completion</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                <textarea
                  value={submitDesc}
                  onChange={e => setSubmitDesc(e.target.value)}
                  placeholder="Describe what was done..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Photos</label>
                <input type="file" ref={photoFileRef} multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <div onClick={() => photoFileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition cursor-pointer">
                  <p className="text-sm font-medium text-gray-700">{uploading ? "Uploading..." : "Upload Photos"}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to browse</p>
                </div>
                {submitPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {submitPhotos.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => setSubmitPhotos(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowSubmit(false)}>Cancel</Button>
                <Button size="sm" onClick={submitTask} disabled={!submitDesc.trim() || submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submissions */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Submissions ({submissions.length})</h2>
          <div className="space-y-4">
            {submissions.map((s: any) => (
              <div key={s.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">{s.submittedBy?.name || "You"}</span>
                  <Badge variant={s.status === "approved" ? "success" : s.status === "rejected" ? "danger" : "warning"}>{s.status}</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{s.description}</p>
                {s.photos?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {s.photos.map((p: string, i: number) => (
                      <img key={i} src={p} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                )}
                {s.adminNotes && <p className="text-xs text-gray-500 mt-2">Admin: {s.adminNotes}</p>}
                <p className="text-[10px] text-gray-400 mt-2">{formatDate(s.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
