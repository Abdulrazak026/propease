"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export interface CarouselItem {
  image: string;
  title?: string;
  subtitle?: string;
}

interface AutoCarouselProps {
  items: CarouselItem[];
  interval?: number;
  className?: string;
  heightClass?: string;
  imageFit?: "cover" | "contain";
  showOverlay?: boolean;
}

export default function AutoCarousel({ items, interval = 4000, className = "", heightClass = "h-72 sm:h-96 lg:h-[28rem]", imageFit = "cover", showOverlay = true }: AutoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % items.length) + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    timerRef.current = setInterval(() => goTo(current + 1), interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, goTo, interval, items.length, current]);

  if (!items.length) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className={`min-w-full relative ${heightClass}`}>
            <img src={item.image} alt={item.title || ""} className="w-full h-full" style={{ objectFit: imageFit }} />
            {showOverlay && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />}
            {!showOverlay && (item.title || item.subtitle) && <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />}
            {(item.title || item.subtitle) && (
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                {item.title && <h3 className={showOverlay ? "text-white text-xl sm:text-2xl font-bold" : "text-white text-xl sm:text-2xl font-bold drop-shadow-lg"}>{item.title}</h3>}
                {item.subtitle && <p className={showOverlay ? "text-white/80 text-sm sm:text-base mt-1" : "text-white/90 text-sm sm:text-base mt-1 drop-shadow"}>{item.subtitle}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
