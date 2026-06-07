"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { ApiJob, ApiJobApplication } from "@/lib/api-types";

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiJob | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<Record<string, ApiJobApplication[]>>({});

  const emptyForm = { title: "", department: "", location: "Kano", type: "Full-time", description: "", isPublished: false };
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    api.get<{ jobs: ApiJob[] }>("/api/careers?includeAll=true")
      .then(r => setJobs(r.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (job: ApiJob) => {
    setEditing(job);
    setForm({ title: job.title, department: job.department, location: job.location, type: job.type, description: job.description, isPublished: job.isPublished });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.department || !form.description) return;
    if (editing) {
      await api.patch<{ job: ApiJob }>(`/api/careers/${editing.id}`, form);
    } else {
      await api.post<{ job: ApiJob }>("/api/careers", form);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    await api.delete(`/api/careers/${id}`);
    load();
  };

  const togglePublish = async (job: ApiJob) => {
    await api.patch(`/api/careers/${job.id}`, { isPublished: !job.isPublished });
    load();
  };

  const loadApplications = async (jobId: string) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    const r = await api.get<{ applications: ApiJobApplication[] }>(`/api/careers/${jobId}/applications`);
    setApplications(prev => ({ ...prev, [jobId]: r.data?.applications || [] }));
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Careers</h1>
          <p className="text-sm text-gray-500">Post jobs and review applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back</Link>
          <button onClick={openCreate} className="text-xs font-semibold px-3.5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90">+ New Job</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">{editing ? "Edit Job" : "New Job"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="Senior Property Manager" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="Operations" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="What the role is, what we're looking for, what we offer." />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="rounded" />
            <span className="text-gray-700">Publish (visible on /careers)</span>
          </label>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={save} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">{editing ? "Save" : "Create"}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">No jobs yet</p>
          <p className="text-xs text-gray-500">Post your first role to start receiving applications.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map(j => (
            <div key={j.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{j.title}</p>
                    {j.isPublished ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Live</span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Draft</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{j.department} · {j.location} · {j.type}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => loadApplications(j.id)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                    {expandedJob === j.id ? "Hide" : "Apps"}
                  </button>
                  <button onClick={() => togglePublish(j)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                    {j.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => openEdit(j)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Edit</button>
                  <button onClick={() => remove(j.id)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50">Delete</button>
                </div>
              </div>
              {expandedJob === j.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Applications</p>
                  {(applications[j.id] || []).length === 0 ? (
                    <p className="text-xs text-gray-500">No applications yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {applications[j.id].map(a => (
                        <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{a.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{a.email} · {a.phone}</p>
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0">{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
