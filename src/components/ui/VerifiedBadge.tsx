"use client";

interface VerifiedBadgeProps {
 size?: "sm" | "md";
}

export default function VerifiedBadge({ size = "sm" }: VerifiedBadgeProps) {
 const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
 const textSize = size === "sm" ? "text-[10px]" : "text-xs";
 return (
 <span
 className={`inline-flex items-center gap-0.5 ${textSize} font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5`}
 title="Verified"
>
 <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
 </svg>
 Verified
 </span>
 );
}
