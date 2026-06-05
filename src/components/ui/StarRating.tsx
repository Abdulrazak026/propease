"use client";

interface StarRatingProps {
 rating: number;
 onChange?: (rating: number) => void;
 size?: "sm" | "md";
 interactive?: boolean;
}

export default function StarRating({ rating, onChange, size = "sm", interactive = false }: StarRatingProps) {
 const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

 return (
 <div className="flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 disabled={!interactive}
 onClick={() => onChange?.(star)}
 className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
>
 <svg className={`${starSize} ${star <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
 </svg>
 </button>
 ))}
 </div>
 );
}
