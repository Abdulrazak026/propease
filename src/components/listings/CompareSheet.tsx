"use client";
import Link from "next/link";
import { useCompare } from "@/lib/compare-context";
import { useState } from "react";

function fmt(n: number) { return n.toLocaleString("en-NG"); }

export default function CompareSheet() {
  const { items, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-20 sm:bottom-28 sm:right-28 z-40 inline-flex items-center gap-2 bg-gray-950 text-white text-xs font-semibold px-3.5 py-2.5 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
        aria-label={`Compare ${items.length} properties`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-9L16.5 3m0 0L12 7.5m4.5-4.5v13.5" /></svg>
        Compare ({items.length})
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-4xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between gap-3 z-10">
              <div>
                <h2 className="text-base font-bold text-gray-900">Compare properties</h2>
                <p className="text-xs text-gray-500">{items.length} of 3 selected</p>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clear} className="text-xs font-semibold text-gray-500 hover:text-gray-900 px-3 py-1.5">Clear</button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider p-3 sticky left-0 bg-white">Feature</th>
                    {items.map(item => (
                      <th key={item.id} className="text-left p-3 min-w-[200px]">
                        <div className="relative">
                          {item.photo && (
                            <img src={item.photo} alt={item.title} className="w-full h-28 object-cover rounded-lg mb-2" />
                          )}
                          <Link href={`/listings/${item.id}`} onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-900 hover:text-[var(--color-primary)] line-clamp-2">{item.title}</Link>
                          <button onClick={() => remove(item.id)} className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-gray-500 hover:text-red-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { l: "Price", r: (i: any) => `₦${fmt(i.price)}`, best: (a: any, b: any) => a.price - b.price },
                    { l: "Type", r: (i: any) => <span className="capitalize">{i.listingType} · {i.propertyType}</span> },
                    { l: "City", r: (i: any) => i.city },
                    { l: "Bedrooms", r: (i: any) => i.bedrooms ?? "—" },
                    { l: "Bathrooms", r: (i: any) => i.bathrooms ?? "—" },
                    { l: "Size", r: (i: any) => i.sqft ? `${i.sqft.toLocaleString()} sqft` : "—" },
                  ].map(row => (
                    <tr key={row.l}>
                      <td className="text-xs text-gray-500 p-3 sticky left-0 bg-white">{row.l}</td>
                      {items.map((item, idx) => {
                        const allValues = items.map(i => typeof row.r(i) === "string" ? parseFloat((row.r(i) as string).replace(/[^0-9.]/g, "")) || 0 : 0);
                        const isBest = row.best && items.length > 1 && idx === allValues.indexOf(Math.min(...allValues.filter(v => v > 0)));
                        return (
                          <td key={item.id} className={`p-3 text-sm text-gray-900 ${isBest ? "bg-emerald-50 font-semibold" : ""}`}>
                            {row.r(item)}
                            {isBest && <span className="ml-1.5 text-[10px] text-emerald-600 font-medium">best</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
