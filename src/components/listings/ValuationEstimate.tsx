"use client";
import { useMemo } from "react";
import { Listing } from "@/lib/types";
import { listings } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

interface ValuationEstimateProps {
 listing: Listing;
}

interface ValuationResult {
 estimatedValue: number;
 lowEstimate: number;
 highEstimate: number;
 confidence: "high" | "medium" | "low";
 comps: Listing[];
 avgPricePerSqft: number | null;
}

function computeValuation(listing: Listing): ValuationResult {
 const cityComps = listings.filter(
 (l) =>
 l.id !== listing.id &&
 l.city === listing.city &&
 l.propertyType === listing.propertyType &&
 l.status !== "taken"
 );

 const avgPricePerSqft =
 cityComps.filter((c) => c.sqft).length> 1
 ? cityComps
 .filter((c) => c.sqft)
 .reduce((sum, c) => sum + c.price / c.sqft!, 0) /
 cityComps.filter((c) => c.sqft).length
 : null;

 let estimatedValue = listing.price;
 let lowEstimate = listing.price * 0.85;
 let highEstimate = listing.price * 1.15;

 if (cityComps.length> 0) {
 const compPrices = cityComps.map((c) => c.price);
 const avgPrice = compPrices.reduce((a, b) => a + b, 0) / compPrices.length;

 if (avgPricePerSqft && listing.sqft) {
 estimatedValue = Math.round(avgPricePerSqft * listing.sqft);
 } else {
 estimatedValue = Math.round(avgPrice);
 }

 const stdDev = Math.sqrt(
 compPrices.reduce((sum, p) => sum + (p - avgPrice) ** 2, 0) / compPrices.length
 );
 lowEstimate = Math.round(Math.max(estimatedValue - stdDev, estimatedValue * 0.7));
 highEstimate = Math.round(Math.min(estimatedValue + stdDev, estimatedValue * 1.3));
 }

 const confidence =
 cityComps.length>= 5
 ? "high"
 : cityComps.length>= 2
 ? "medium"
 : "low";

 return {
 estimatedValue,
 lowEstimate,
 highEstimate,
 confidence,
 comps: cityComps.slice(0, 3),
 avgPricePerSqft: avgPricePerSqft ? Math.round(avgPricePerSqft) : null,
 };
}

const confidenceConfig = {
 high: { label: "High Confidence", color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
 medium: { label: "Medium Confidence", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
 low: { label: "Low Confidence", color: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-400" },
};

export default function ValuationEstimate({ listing }: ValuationEstimateProps) {
 const valuation = useMemo(() => computeValuation(listing), [listing]);
 const cfg = confidenceConfig[valuation.confidence];
 const diff = listing.price - valuation.estimatedValue;
 const percentDiff = listing.price> 0 ? Math.round((diff / valuation.estimatedValue) * 100) : 0;

 return (
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <h3 className="font-semibold text-gray-900 text-sm mb-4">Market Valuation</h3>

 <div className="flex items-center gap-2 mb-4">
 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
 {cfg.label}
 </span>
 {valuation.comps.length> 0 && (
 <span className="text-[10px] text-gray-400">{valuation.comps.length} comparable{valuation.comps.length !== 1 ? "s" : ""}</span>
 )}
 </div>

 <div className="space-y-3 mb-4">
 <div className="flex items-baseline justify-between">
 <span className="text-xs text-gray-500">Estimated Value</span>
 <span className="text-lg font-bold text-gray-900">{formatNaira(valuation.estimatedValue)}</span>
 </div>
 <div className="flex items-baseline justify-between">
 <span className="text-xs text-gray-500">Price Range</span>
 <span className="text-sm text-gray-700">
 {formatNaira(valuation.lowEstimate)} — {formatNaira(valuation.highEstimate)}
 </span>
 </div>
 {valuation.avgPricePerSqft && (
 <div className="flex items-baseline justify-between">
 <span className="text-xs text-gray-500">Avg Price / sqft</span>
 <span className="text-sm text-gray-700">{formatNaira(valuation.avgPricePerSqft)}</span>
 </div>
 )}
 <div className="pt-2 border-t border-gray-100">
 <div className="flex items-baseline justify-between">
 <span className="text-xs text-gray-500">Listed Price</span>
 <span className="text-sm font-semibold text-gray-900">{formatNaira(listing.price)}</span>
 </div>
 {valuation.comps.length> 0 && (
 <div className="mt-1 text-right">
 <span className={`text-xs font-medium ${diff <= 0 ? "text-emerald-600" : "text-red-500"}`}>
 {diff <= 0 ? "Below market" : "Above market"} by {Math.abs(percentDiff)}%
 </span>
 </div>
 )}
 </div>
 </div>

 {valuation.comps.length> 0 && (
 <div className="pt-3 border-t border-gray-100">
 <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Comparable Properties</p>
 <div className="space-y-1.5">
 {valuation.comps.map((comp) => (
 <div key={comp.id} className="flex items-center justify-between text-xs text-gray-600">
 <span className="truncate max-w-[180px]">{comp.title}</span>
 <span className="font-medium">{formatNaira(comp.price)}</span>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
