"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Post { id: string; title: string; excerpt: string | null; content: string; coverImage: string | null; publishedAt: string | null; author?: { name: string } | null; }

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";
    fetch(`${API}/api/blog`).then(r => r.json()).then(d => {
      setPosts(d.posts || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex-1 py-16 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">News & Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-100" />
            <div className="p-5 space-y-3"><div className="h-4 bg-gray-100 rounded w-1/4" /><div className="h-5 bg-gray-100 rounded w-3/4" /><div className="h-4 bg-gray-100 rounded w-full" /></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 py-16 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">News & Insights</h1>
      <p className="text-gray-500 mb-8">Latest updates from MBPP</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No articles published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.id} href={`/news`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-48 object-cover" />}
              <div className="p-5">
                <span className="text-[10px] font-medium text-[var(--color-primary)] uppercase">News</span>
                <h3 className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">{p.excerpt || p.content?.slice(0, 120)}</p>
                <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400">
                  <span>{p.author?.name || "MBPP"}</span>
                  <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
