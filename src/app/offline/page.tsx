import Link from "next/link";

export default function OfflinePage() {
 return (
 <div className="flex-1 flex items-center justify-center py-24">
 <div className="text-center max-w-sm mx-auto px-4">
 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
 </svg>
 </div>
 <h1 className="text-lg font-bold text-gray-900 mb-2">You&apos;re Offline</h1>
 <p className="text-sm text-gray-500 mb-6">Some content may not be available. Check your connection and try again.</p>
 <Link href="/" className="inline-flex px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg">
 Go Home
 </Link>
 </div>
 </div>
 );
}
