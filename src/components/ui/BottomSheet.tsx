"use client";
import { useEffect, useRef, type ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentY.current = Math.max(0, e.clientY - startY.current);
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${currentY.current}px)`;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    if (currentY.current > 100) onClose();
    else if (sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0)";
      sheetRef.current.style.transition = "transform 0.25s ease-out";
      setTimeout(() => { if (sheetRef.current) sheetRef.current.style.transition = ""; }, 250);
    }
    currentY.current = 0;
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl lg:hidden animate-slide-up-bottom max-h-[85vh] flex flex-col"
        style={{ touchAction: "none" }}
      >
        <div
          className="flex items-center justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>
        {title && (
          <div className="px-5 pb-3 shrink-0">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="overflow-y-auto px-5 pb-8 flex-1">{children}</div>
      </div>
      <style>{`
        @keyframes slideUpBottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up-bottom {
          animation: slideUpBottom 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </>
  );
}
