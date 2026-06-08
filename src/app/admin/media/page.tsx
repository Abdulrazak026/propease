"use client";
import { useState, useRef, useEffect } from "react";
import { api, getAccessToken } from "@/lib/api-client";
import { resolveImageUrl } from "@/lib/utils";
import { usePermissions } from "@/lib/use-permissions";

const API_URL = "https://propease-production.up.railway.app";

interface MediaItem {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const perms = usePermissions();
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = () => {
    api.get<{ files: MediaItem[] }>("/api/upload")
      .then(r => { if (r.data) setFiles(r.data.files); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const token = getAccessToken();
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Upload failed");
      }
      loadFiles();
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await api.delete(`/api/upload/${id}`);
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="flex-1">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
            <p className="text-xs text-gray-500">Upload and manage images, videos, and documents</p>
          </div>
          <div>
            <input
              type="file"
              ref={fileRef}
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            {perms.canManageContent && <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload New"}
            </button>}
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No files uploaded yet</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {files.map(f => (
              <div key={f.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-50">
                  {f.mimeType.startsWith("image/") ? (
                    <img src={resolveImageUrl(f.url) || f.url} alt={f.filename} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📄</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-gray-600 truncate mb-0.5" title={f.filename}>{f.filename}</p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => navigator.clipboard.writeText(resolveImageUrl(f.url) || f.url)} className="text-[10px] text-[var(--color-primary)] hover:underline">Copy</button>
                    {perms.canManageContent && <button onClick={() => handleDelete(f.id)} className="text-[10px] text-red-500 hover:underline">Del</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
