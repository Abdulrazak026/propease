"use client";
import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { formatDate, formatNaira } from "@/lib/utils";

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

const mockReviews: Review[] = [
 { id: "r1", rating: 5, comment: "Very professional and helpful. Showed us several properties and found the perfect one for our family. Highly recommend!", authorName: "Dr. Amina Yusuf", createdAt: "2026-05-28" },
 { id: "r2", rating: 4, comment: "Good agent, responsive on WhatsApp. Only issue was the viewing was rescheduled twice.", authorName: "Alh. Kabir Danjuma", createdAt: "2026-05-20" },
 { id: "r3", rating: 5, comment: "Best real estate experience in Kano. Knows the market very well and negotiated a good price for us.", authorName: "Barr. Safiya Ibrahim", createdAt: "2026-05-15" },
];

export default function ReviewSection({ agentId, agentName, listingId, currentUserId }: ReviewSectionProps) {
 const [reviews] = useState(mockReviews);
 const [showForm, setShowForm] = useState(false);
 const [newRating, setNewRating] = useState(0);
 const [newComment, setNewComment] = useState("");
 const [submitted, setSubmitted] = useState(false);

 const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
 const ratingCounts = [0, 0, 0, 0, 0];
 reviews.forEach((r) => ratingCounts[r.rating - 1]++);

 const handleSubmit = () => {
 if (newRating === 0) return;
 setSubmitted(true);
 setShowForm(false);
 };

 if (!agentId) return null;

 return (
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <div className="flex items-start justify-between mb-5">
 <div>
 <h3 className="font-semibold text-gray-900 text-sm">Agent Reviews</h3>
 <p className="text-xs text-gray-500 mt-0.5">Reviews for {agentName || "this agent"}</p>
 </div>
 {reviews.length> 0 && (
 <div className="flex items-center gap-2">
 <span className="text-lg font-bold text-gray-900">{avgRating.toFixed(1)}</span>
 <div>
 <StarRating rating={Math.round(avgRating)} />
 <p className="text-[10px] text-gray-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
 </div>
 </div>
 )}
 </div>

  {/* Rating breakdown */}
  {reviews.length> 0 && (
  <div className="space-y-1.5 mb-5 pb-5 border-b border-gray-100">
  {[5, 4, 3, 2, 1].map((star) => (
  <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
  <span className="w-3 text-right font-medium">{star}</span>
  <svg className="w-3 h-3 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(ratingCounts[star - 1] / reviews.length) * 100}%` }} />
  </div>
  <span className="w-4 text-center text-gray-400">{ratingCounts[star - 1]}</span>
  </div>
  ))}
  </div>
  )}

 {/* Reviews list */}
 <div className="space-y-4 mb-5">
 {reviews.map((r) => (
 <div key={r.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
 {r.authorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
 </div>
 <span className="text-sm font-medium text-gray-900">{r.authorName}</span>
 </div>
 <span className="text-[10px] text-gray-400">{formatDate(r.createdAt)}</span>
 </div>
 <StarRating rating={r.rating} />
 {r.comment && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{r.comment}</p>}
 </div>
 ))}
 </div>

 {!submitted && !showForm && currentUserId && (
 <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
 </svg>
 Write a Review
 </Button>
 )}

 {showForm && (
 <div className="space-y-3">
 <p className="text-sm font-medium text-gray-900">Rate your experience with {agentName}</p>
 <StarRating rating={newRating} onChange={setNewRating} size="md" interactive />
 <textarea
 rows={3}
 value={newComment}
 onChange={(e) => setNewComment(e.target.value)}
 placeholder="Share your experience (optional)"
 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm resize-none"
 />
 <div className="flex gap-2">
 <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
 <Button className="flex-1" disabled={newRating === 0} onClick={handleSubmit}>Submit Review</Button>
 </div>
 </div>
 )}

 {submitted && (
 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
 <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-1">
 <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <p className="text-sm font-medium text-emerald-800">Review submitted!</p>
 <p className="text-xs text-emerald-600 mt-0.5">Your review will appear after moderation.</p>
 </div>
 )}
 </div>
 );
}
