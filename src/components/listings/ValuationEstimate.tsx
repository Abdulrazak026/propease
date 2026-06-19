"use client";
import { useMemo, useEffect, useState } from "react";
import { Listing } from "@/lib/types";
import { api } from "@/lib/api-client";
import { formatNaira } from "@/lib/utils";

interface ValuationEstimateProps {
 listing: Listing;
}

interface ValuationResult {
  rangeLow: number; rangeHigh: number; estimatedValue: number;
  confidence: "high" | "medium" | "low";
}

function computeValuation(listing: Listing, cityComps: Listing[]): ValuationResult {
  const avgPrice = cityComps.length > 0 ? cityComps.reduce((s, c) => s + c.price, 0) / cityComps.length : listing.price;
  const estimatedValue = avgPrice;
  const rangeLow = Math.round(estimatedValue * 0.85);
  const rangeHigh = Math.round(estimatedValue * 1.15);
  const confidence = cityComps.length >= 5 ? "high" : cityComps.length >= 2 ? "medium" : "low";

  return { rangeLow, rangeHigh, estimatedValue: Math.round(estimatedValue), confidence };
}

export default function ValuationEstimate({ listing }: ValuationEstimateProps) {
  const [comps, setComps] = useState<Listing[]>([]);

  useEffect(() => {
    api.get<{ listings: Listing[] }>(`/api/listings?city=${listing.city}&propertyType=${listing.propertyType}`).then(r => {
      if (r.data?.listings) setComps(r.data.listings.filter(l => l.id !== listing.id));
    }).catch(() => {});
  }, [listing.city, listing.propertyType, listing.id]);

  const result = useMemo(() => computeValuation(listing, comps), [listing, comps]);

  if (!result) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Valuation Estimate</h3>
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500">Estimated Value</p>
        <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">{formatNaira(result.estimatedValue)}</p>
        <p className="text-xs text-gray-400 mt-1">
          Range: {formatNaira(result.rangeLow)} – {formatNaira(result.rangeHigh)}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Confidence</span>
        <span className={`font-medium capitalize ${result.confidence === "high" ? "text-emerald-600" : result.confidence === "medium" ? "text-amber-600" : "text-red-500"}`}>
          {result.confidence} ({comps.length} comparable{comps.length !== 1 ? "s" : ""})
        </span>
      </div>

    </div>
  );
}
