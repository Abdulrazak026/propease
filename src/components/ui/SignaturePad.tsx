"use client";
import { useRef, useState, useEffect } from "react";

interface SignaturePadProps {
 onSave: (dataUrl: string) => void;
 onClear?: () => void;
 label?: string;
}

export default function SignaturePad({ onSave, onClear, label = "Sign above" }: SignaturePadProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [isDrawing, setIsDrawing] = useState(false);
 const [hasContent, setHasContent] = useState(false);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext("2d");
 if (!ctx) return;
 ctx.strokeStyle = "#1f2937";
 ctx.lineWidth = 2;
 ctx.lineCap = "round";
 ctx.lineJoin = "round";
 }, []);

 const getPos = (e: React.MouseEvent | React.TouchEvent) => {
 const canvas = canvasRef.current;
 if (!canvas) return { x: 0, y: 0 };
 const rect = canvas.getBoundingClientRect();
 if ("touches" in e) {
 const touch = e.touches[0];
 return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
 }
 return { x: e.clientX - rect.left, y: e.clientY - rect.top };
 };

 const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
 e.preventDefault();
 const ctx = canvasRef.current?.getContext("2d");
 if (!ctx) return;
 const pos = getPos(e);
 ctx.beginPath();
 ctx.moveTo(pos.x, pos.y);
 setIsDrawing(true);
 setHasContent(true);
 };

 const draw = (e: React.MouseEvent | React.TouchEvent) => {
 e.preventDefault();
 if (!isDrawing) return;
 const ctx = canvasRef.current?.getContext("2d");
 if (!ctx) return;
 const pos = getPos(e);
 ctx.lineTo(pos.x, pos.y);
 ctx.stroke();
 };

 const endDraw = () => {
 setIsDrawing(false);
 };

 const clear = () => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext("2d");
 if (!ctx) return;
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 setHasContent(false);
 onClear?.();
 };

 const save = () => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 onSave(canvas.toDataURL("image/png"));
 };

 return (
 <div className="space-y-2">
 <p className="text-xs font-medium text-gray-700">{label}</p>
 <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
 <canvas
 ref={canvasRef}
 width={500}
 height={150}
 className="w-full h-36 touch-none cursor-crosshair"
 onMouseDown={startDraw}
 onMouseMove={draw}
 onMouseUp={endDraw}
 onMouseLeave={endDraw}
 onTouchStart={startDraw}
 onTouchMove={draw}
 onTouchEnd={endDraw}
 />
 {!hasContent && (
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <span className="text-xs text-gray-300">Draw your signature here</span>
 </div>
 )}
 </div>
 <div className="flex items-center justify-between">
 <button
 onClick={clear}
 className="text-xs text-gray-500 hover:text-red-500 transition px-2 py-1"
>
 Clear
 </button>
 {hasContent && (
 <button
 onClick={save}
 className="text-xs font-medium text-white bg-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary-light)] transition"
>
 Accept & Sign
 </button>
 )}
 </div>
 </div>
 );
}
