"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Post { id: string; title: string; slug: string; excerpt: string | null; content: string; coverImage: string | null; published: boolean; publishedAt: string | null; createdAt: string; author?: { name: string } | null; }

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", coverImage: "", published: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = () => {
    setLoading(true);
    api.get<{ posts: Post[] }>("/api/blog/all").then(r => {
      if (r.data?.posts) setPosts(r.data.posts);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const openEdit = (p: Post) => {
    setEditId(p.id);
    setForm({ title: p.title, content: p.content, excerpt: p.excerpt || "", coverImage: p.coverImage || "", published: p.published });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ title: "", content: "", excerpt: "", coverImage: "", published: false });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    if (editId) {
      await api.patch(`/api/blog/${editId}`, form);
    } else {
      await api.post("/api/blog", form);
    }
    setSaving(false);
    setShowForm(false);
    fetchPosts();
  };

  const togglePublish = async (p: Post) => {
    await api.patch(`/api/blog/${p.id}`, { published: !p.published });
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await api.delete(`/api/blog/${id}`);
    fetchPosts();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
          <div><h1 className="text-xl font-bold text-gray-900">Blog</h1><p className="text-xs text-gray-500">Manage news and articles</p></div>
        </div>
        <Button size="sm" onClick={openCreate}>+ New Post</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">{editId ? "Edit Post" : "New Post"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt (optional)" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="Cover image URL (optional)" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Content (Markdown supported)" rows={6} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Published</label>
          <div className="flex gap-2"><Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button><Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Title</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[200px] truncate">{p.title}</td>
                  <td className="px-4 py-3"><Badge variant={p.published ? "success" : "warning"}>{p.published ? "Published" : "Draft"}</Badge></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => togglePublish(p)}>{p.published ? "Unpublish" : "Publish"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => deletePost(p.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No posts yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
