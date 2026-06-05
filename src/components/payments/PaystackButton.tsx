"use client";
import { useState } from "react";

declare global {
 interface Window {
 PaystackPop: {
 setup: (config: {
 key: string;
 email: string;
 amount: number;
 currency?: string;
 ref?: string;
 metadata?: Record<string, unknown>;
 callback?: (response: { reference: string }) => void;
 onClose?: () => void;
 }) => { openIframe: () => void };
 };
 }
}

interface PaystackButtonProps {
 email: string;
 amount: number;
 label?: string;
 metadata?: Record<string, unknown>;
 onSuccess?: (reference: string) => void;
 onClose?: () => void;
 disabled?: boolean;
 className?: string;
}

export default function PaystackButton({
 email,
 amount,
 label = "Pay Now",
 metadata,
 onSuccess,
 onClose,
 disabled = false,
 className = "",
}: PaystackButtonProps) {
 const [loading, setLoading] = useState(false);

 const loadScript = (): Promise<boolean> => {
 return new Promise((resolve) => {
 if (typeof window.PaystackPop !== "undefined") return resolve(true);
 const script = document.createElement("script");
 script.src = "https://js.paystack.co/v1/inline.js";
 script.onload = () => resolve(true);
 script.onerror = () => resolve(false);
 document.head.appendChild(script);
 });
 };

 const handlePay = async () => {
 setLoading(true);
 const loaded = await loadScript();
 if (!loaded) {
 setLoading(false);
 return;
 }

 const ref = "MBPP-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);

 const handler = window.PaystackPop.setup({
 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxx",
 email,
 amount: Math.round(amount * 100),
 currency: "NGN",
 ref,
 metadata,
 callback: (response) => {
 setLoading(false);
 onSuccess?.(response.reference);
 },
 onClose: () => {
 setLoading(false);
 onClose?.();
 },
 });
 handler.openIframe();
 };

 return (
 <button
 onClick={handlePay}
 disabled={disabled || loading}
 className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
>
 {loading ? (
 <>
 <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
 </svg>
 Processing...
 </>
 ) : (
 <>
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
 </svg>
 {label}
 </>
 )}
 </button>
 );
}
