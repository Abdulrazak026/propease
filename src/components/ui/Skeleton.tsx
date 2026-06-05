export function SkeletonCard() {
 return (
 <div className="rounded-lg border border-gray-100 overflow-hidden bg-white animate-pulse">
 <div className="h-48 bg-gray-100" />
 <div className="p-4 space-y-3">
 <div className="h-4 bg-gray-100 rounded w-3/4" />
 <div className="h-3 bg-gray-100 rounded w-1/2" />
 <div className="h-5 bg-gray-100 rounded w-1/3" />
 <div className="flex gap-2">
 <div className="h-6 bg-gray-100 rounded-lg w-16" />
 <div className="h-6 bg-gray-100 rounded-lg w-20" />
 </div>
 </div>
 </div>
 );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
 {Array.from({ length: count }).map((_, i) => (
 <SkeletonCard key={i} />
 ))}
 </div>
 );
}

export function SkeletonDetail() {
 return (
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
 <div className="h-4 bg-gray-100 rounded w-32 mb-6" />
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
 <div className="lg:col-span-3 space-y-5">
 <div className="h-96 bg-gray-100 rounded-lg" />
 <div className="h-40 bg-gray-100 rounded-lg" />
 <div className="h-48 bg-gray-100 rounded-lg" />
 </div>
 <div className="lg:col-span-2 space-y-5">
 <div className="h-64 bg-gray-100 rounded-lg" />
 <div className="h-32 bg-gray-100 rounded-lg" />
 </div>
 </div>
 </div>
 );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
 return (
 <div className="space-y-3 animate-pulse">
 {Array.from({ length: rows }).map((_, i) => (
 <div key={i} className="flex gap-4">
 <div className="h-10 bg-gray-100 rounded-lg flex-1" />
 <div className="h-10 bg-gray-100 rounded-lg w-24" />
 <div className="h-10 bg-gray-100 rounded-lg w-32" />
 </div>
 ))}
 </div>
 );
}

export function EmptyState({
 title,
 description,
 action,
}: {
 title: string;
 description?: string;
 action?: React.ReactNode;
}) {
 return (
 <div className="text-center py-20">
 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
 {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
 {action && <div className="mt-4">{action}</div>}
 </div>
 );
}

export function ErrorState({
 message,
 onRetry,
}: {
 message?: string;
 onRetry?: () => void;
}) {
 return (
 <div className="text-center py-20">
 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold text-gray-900">Failed to load</h3>
 <p className="text-sm text-gray-500 mt-1">{message || "Something went wrong. Please try again."}</p>
 {onRetry && (
 <button
 onClick={onRetry}
 className="mt-4 text-sm text-[var(--color-primary)] hover:underline font-medium"
>
 Try again
 </button>
 )}
 </div>
 );
}
