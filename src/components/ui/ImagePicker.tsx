"use client";
import { useState } from "react";
import { api, getAccessToken } from "@/lib/api-client";
import { resolveImageUrl } from "@/lib/utils";

const API_URL = "https://mbpproperties.com";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<{ id: string; url: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadImages = () => {
    setLoading(true);
    api.get<{ files: { id: string; url: string; filename: string; mimeType: string }[] }>("/api/upload")
      .then(r => {
        if (r.data?.files) setImages(r.data.files.filter(f => f.mimeType?.startsWith("image/")));
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken() || ""}` },
        body: fd,
      });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
        setOpen(false);
      }
    } catch {}
    setUploading(false);
    if (e.target) e.target.value = "";
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
      <div className="flex gap-2">
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="Paste URL or pick from media" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <button type="button" onClick={() => { setOpen(true); loadImages(); }} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">Browse</button>
        <label className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
          {uploading ? "Uploading..." : "Upload"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className="px-2 py-2 text-xs text-red-500 hover:text-red-700">x</button>}
      </div>
      {value && <img src={resolveImageUrl(value) || value} alt="" className="h-10 mt-1 rounded border border-gray-200 object-contain" />}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Media Library</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {loading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              : images.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No images uploaded yet. Upload from <a href="/admin/media" className="text-[var(--color-primary)] underline">Media</a>.</div>
              : <div className="grid grid-cols-4 gap-3">
                {images.map(img => (
                  <button key={img.id} onClick={() => { onChange(img.url); setOpen(false); }}
                    className={`border-2 rounded-lg overflow-hidden hover:border-[var(--color-primary)] transition-colors ${value === img.url ? "border-[var(--color-primary)]" : "border-gray-200"}`}>
                    <img src={resolveImageUrl(img.url)!} alt={img.filename} className="w-full h-24 object-cover" />
                    <p className="text-[10px] text-gray-500 p-1 truncate">{img.filename}</p>
                  </button>
                ))}
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
