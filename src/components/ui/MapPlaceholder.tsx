export default function MapPlaceholder({ lat, lng, label }: { lat: number; lng: number; label?: string }) {
  return (
    <div className="relative bg-gray-200 rounded-xl overflow-hidden h-48 w-full">
      <div className="absolute inset-0" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%23e0e0e0' stroke-width='0.5'/%3E%3C/svg%3E\")",
        backgroundSize: "40px 40px"
      }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <svg className="w-10 h-10 text-red-500 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <p className="text-xs text-gray-500 mt-1 bg-white/80 px-2 py-0.5 rounded">
          {label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
        </p>
      </div>
      <div className="absolute bottom-2 left-2 bg-white/90 text-[10px] px-2 py-1 rounded shadow-sm text-gray-500">
        📍 Google Maps
      </div>
    </div>
  );
}
