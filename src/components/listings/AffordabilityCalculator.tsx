"use client";
import { useState } from "react";
import Link from "next/link";

const PRESETS = [
  { l: "₦100K", v: 100000 },
  { l: "₦300K", v: 300000 },
  { l: "₦500K", v: 500000 },
  { l: "₦1M", v: 1000000 },
];

function formatNaira(n: number): string {
  return n.toLocaleString("en-NG");
}

export default function AffordabilityCalculator() {
  const [salary, setSalary] = useState(300000);
  const maxRent = Math.floor(salary * 0.33);
  const totalAnnual = maxRent * 12;
  const affordable = salary > 0;

  return (
    <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/20 rounded-full blur-3xl" />
      <div className="relative grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Affordability calculator
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">What can you afford?</h2>
          <p className="text-sm text-white/60 mt-2 leading-relaxed max-w-md">Tell us your monthly salary. We&apos;ll show you the kind of place you can rent in Kano.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-2">Monthly salary</label>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm">₦</span>
              <input
                type="number"
                inputMode="numeric"
                value={salary}
                onChange={e => setSalary(Math.max(0, parseInt(e.target.value) || 0))}
                min={0}
                step={10000}
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESETS.map(p => (
                <button
                  key={p.v}
                  onClick={() => setSalary(p.v)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 transition-colors"
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>
          {affordable && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-white/60">Max rent (33% rule)</span>
                <span className="text-2xl font-bold">₦{formatNaira(maxRent)}<span className="text-xs text-white/40 font-normal">/yr</span></span>
              </div>
              <p className="text-[11px] text-white/40 mt-1.5">Most landlords want annual rent upfront. Total: ₦{formatNaira(totalAnnual)}</p>
              <Link
                href={`/?listingType=rent&maxPrice=${maxRent}`}
                className="mt-3 inline-flex items-center justify-center w-full min-h-[40px] px-4 py-2 bg-white text-gray-950 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Show me places under ₦{formatNaira(maxRent)}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
