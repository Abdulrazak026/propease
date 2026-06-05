"use client";
import { listings, users } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function OutsourcingPage() {
 const outsourced = listings.filter((l) => l.listingType === "outsourcing" || l.category === "partnership");

 return (
 <div className="space-y-6-up">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Outsourcing</h1>
 <p className="text-sm text-gray-500 mt-0.5">Partner listings and outsourced properties</p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {[
 { label: "Total Outsourced", value: outsourced.length, color: "text-[var(--color-primary)]" },
 { label: "Active Partners", value: [...new Set(outsourced.map((l) => l.partnerCompany).filter(Boolean))].length, color: "text-emerald-600" },
 { label: "Total Value", value: formatNaira(outsourced.reduce((s, l) => s + l.price, 0)), color: "text-amber-600" },
 ].map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
 <p className="text-xs text-gray-500">{s.label}</p>
 <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
 </div>
 ))}
 </div>

 <div className="bg-white rounded-lg border border-gray-200">
 <div className="px-5 pt-5 pb-2">
 <h2 className="text-sm font-semibold text-gray-900">Outsourced Properties</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/50">
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
 <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 </tr>
 </thead>
 <tbody>
 {outsourced.map((l) => (
 <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
 <td className="px-4 py-3.5 text-sm text-gray-900">{l.title}</td>
 <td className="px-4 py-3.5 text-sm text-gray-700">{l.partnerCompany || "-"}</td>
 <td className="px-4 py-3.5 text-sm text-gray-500">{l.city}</td>
 <td className="px-4 py-3.5 text-sm text-right font-medium">{formatNaira(l.price)}</td>
 <td className="px-4 py-3.5">
 <Badge variant={l.status === "available" ? "success" : l.status === "reserved" ? "warning" : "danger"}>{l.status}</Badge>
 </td>
 </tr>
 ))}
 {outsourced.length === 0 && (
 <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No outsourced properties yet</td></tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
