"use client";
import { formatNaira, formatDate } from "@/lib/utils";

interface PricePoint {
 date: string;
 price: number;
 reason?: string;
}

interface PriceHistoryProps {
 currentPrice: number;
 history: PricePoint[];
 priceLabel: string;
}

const mockHistory: PricePoint[] = [
 { date: "2026-04-15", price: 2_200_000, reason: "Initial listing" },
 { date: "2026-05-01", price: 2_000_000, reason: "Market adjustment" },
 { date: "2026-05-20", price: 1_800_000, reason: "Price reduction for quick rent" },
];

export default function PriceHistory({ currentPrice, history, priceLabel }: PriceHistoryProps) {
 const allPoints = [...history, { date: new Date().toISOString().split("T")[0], price: currentPrice }];
 const minPrice = Math.min(...allPoints.map((p) => p.price));
 const maxPrice = Math.max(...allPoints.map((p) => p.price));
 const range = maxPrice - minPrice || 1;
 const priceChange = history.length> 0 ? currentPrice - history[0].price : 0;
 const percentChange = history.length> 0 && history[0].price> 0 ? Math.round((priceChange / history[0].price) * 100) : 0;

 if (history.length === 0) return null;

 return (
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="font-semibold text-gray-900 text-sm">Price History</h3>
 <p className="text-xs text-gray-500 mt-0.5">{history.length} change{history.length !== 1 ? "s" : ""} recorded</p>
 </div>
 <div className={`text-right ${priceChange <= 0 ? "text-emerald-600" : "text-red-500"}`}>
 <p className="text-sm font-bold">{priceChange <= 0 ? "↓" : "↑"} {formatNaira(Math.abs(priceChange))}</p>
 <p className="text-[10px]">{priceChange <= 0 ? "Decrease" : "Increase"}</p>
 </div>
 </div>

 {/* Simple chart bars */}
 <div className="flex items-end gap-2 mb-4 h-20">
 {allPoints.map((p, i) => {
 const height = ((p.price - minPrice) / range) * 100;
 return (
 <div key={i} className="flex-1 flex flex-col items-center gap-1">
 <span className="text-[9px] text-gray-400 font-medium">{formatNaira(p.price)}</span>
 <div
 className={`w-full rounded-t-lg transition-all ${
 i === allPoints.length - 1 ? "bg-[var(--color-primary)]" : "bg-gray-200"
 }`}
 style={{ height: `${Math.max(height, 8)}%` }}
 />
 </div>
 );
 })}
 </div>

 {/* Timeline */}
 <div className="space-y-2">
 {[...history].reverse().map((p, i) => (
 <div key={i} className="flex items-center gap-3 text-xs">
 <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
 <span className="text-gray-400 w-16">{formatDate(p.date)}</span>
 <span className="font-medium text-gray-900">{formatNaira(p.price)}</span>
 {p.reason && <span className="text-gray-400">— {p.reason}</span>}
 </div>
 ))}
 <div className="flex items-center gap-3 text-xs">
 <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
 <span className="text-gray-400 w-16">Today</span>
 <span className="font-medium text-gray-900">{formatNaira(currentPrice)}</span>
 <span className="text-gray-400">— Current {priceLabel}</span>
 </div>
 </div>
 </div>
 );
}
