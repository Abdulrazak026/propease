export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-emerald-600 opacity-20 animate-pulse" />
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-emerald-600 flex items-center justify-center animate-bounce shadow-lg shadow-[var(--color-primary)]/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
            <span className="block h-full w-1/2 bg-[var(--color-primary)] rounded-full animate-[shimmer_1.4s_ease-in-out_infinite]" />
          </span>
        </div>
        <p className="text-sm font-medium text-gray-500 tracking-wide">Loading…</p>
        <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
      </div>
    </div>
  );
}
