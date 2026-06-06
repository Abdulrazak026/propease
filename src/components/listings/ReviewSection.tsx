"use client";
import { useState, useEffect } from "react";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api-client";

interface Review {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

interface ReviewSectionProps {
  agentId?: string;
  agentName?: string;
  listingId: string;
  currentUserId?: string;
}

export default function ReviewSection({ agentId, agentName, listingId, currentUserId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!agentId) { setLoading(false); return; }
    api.get<{ reviews: any[] }>(`/api/reviews/agent/${agentId}`).then(r => {
      if (r.data?.reviews) {
        setReviews(r.data.reviews.map((rv: any) => ({
          id: rv.id,
          rating: rv.rating,
          comment: rv.comment || "",
          authorName: rv.author?.name || "Anonymous",
          createdAt: rv.createdAt,
        })));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [agentId]);

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => ratingCounts[r.rating - 1]++);

  const handleSubmit = async () => {
    if (newRating === 0) return;
    setSending(true);
    setError("");
    try {
      await api.post("/api/reviews", {
        agentId,
        listingId,
        rating: newRating,
        comment: newComment,
      });
      setSubmitted(true);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    }
    setSending(false);
  };

  if (!agentId) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Agent Reviews</h3>
          <p className="text-xs text-gray-500 mt-0.5">Reviews for {agentName || "this agent"}</p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            <div>
              <StarRating rating={Math.round(avgRating)} />
              <p className="text-[10px] text-gray-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-400 text-xs">Loading reviews...</div>
      ) : (
        <>
          {reviews.length > 0 && (
            <div className="space-y-1.5 mb-5 pb-5 border-b border-gray-100">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-3 text-right font-medium">{star}</span>
                  <svg className="w-3 h-3 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${(ratingCounts[star - 1] / reviews.length) * 100}%` }} /></div>
                  <span className="w-4 text-center text-gray-400">{ratingCounts[star - 1]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 mb-5">
            {reviews.map((r) => (
              <div key={r.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">{r.authorName.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                    <span className="text-sm font-medium text-gray-900">{r.authorName}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{formatDate(r.createdAt)}</span>
                </div>
                <StarRating rating={r.rating} />
                {r.comment && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {!submitted && !showForm && currentUserId && (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          Write a Review
        </Button>
      )}

      {showForm && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">Rate your experience with {agentName}</p>
          <StarRating rating={newRating} onChange={setNewRating} size="md" interactive />
          <textarea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your experience (optional)" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm resize-none" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="flex-1" disabled={newRating === 0 || sending} onClick={handleSubmit}>{sending ? "Submitting..." : "Submit Review"}</Button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-emerald-800">Review submitted!</p>
          <p className="text-xs text-emerald-600 mt-0.5">Your review will appear after moderation.</p>
        </div>
      )}
    </div>
  );
}
