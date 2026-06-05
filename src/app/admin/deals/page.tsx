"use client";
import { listings, commissions } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function DealsPage() {
 const successful = listings.filter((l) => l.dealStatus === "successful" || l.status === "taken");
 const unsuccessful = listings.filter((l) => l.dealStatus === "unsuccessful");
 const ongoing = listings.filter((l) => l.dealStatus === "ongoing" || l.status === "reserved");
 const totalCommission = commissions.reduce((s, c) => s + c.companyCut, 0);

 return (
 <div className="space-y-6-up">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Deal Records</h1>
 <p className="text-sm text-gray-500 mt-0.5">Auto-tracked deal outcomes across the platform</p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
 {[
 { label: "Successful", value: successful.length, color: "text-emerald-600" },
 { label: "Unsuccessful", value: unsuccessful.length, color: "text-red-600" },
 { label: "Ongoing", value: ongoing.length, color: "text-blue-600" },
 { label: "Total Commission", value: formatNaira(totalCommission), color: "text-[var(--color-primary)]" },
 ].map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
 <p className="text-xs text-gray-500">{s.label}</p>
 <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
 </div>
 ))}
 </div>

 <div className="bg-white rounded-lg border border-gray-200">
 <div className="px-5 pt-5 pb-2 border-b border-gray-100">
 <div className="flex gap-4">
 {(["successful", "unsuccessful", "ongoing"] as const).map((tab) => (
 <button key={tab} className="text-sm font-medium text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-2 capitalize">
 {tab} ({tab === "successful" ? successful.length : tab === "unsuccessful" ? unsuccessful.length : ongoing.length})
 </button>
 ))}
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/50">
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
 <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Status</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
 </tr>
 </thead>
 <tbody>
 {[...successful, ...ongoing, ...unsuccessful].map((l) => (
 <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
 <td className="px-4 py-3.5 text-sm text-gray-900">{l.title}</td>
 <td className="px-4 py-3.5 text-sm capitalize text-gray-500">{l.listingType}</td>
 <td className="px-4 py-3.5 text-sm text-right font-medium">{formatNaira(l.price)}</td>
 <td className="px-4 py-3.5"><Badge variant={l.status === "available" ? "success" : l.status === "reserved" ? "warning" : "danger"}>{l.status}</Badge></td>
 <td className="px-4 py-3.5">
 <Badge variant={l.dealStatus === "successful" || l.status === "taken" ? "success" : l.dealStatus === "unsuccessful" ? "danger" : "info"}>
 {l.dealStatus || l.status}
 </Badge>
 </td>
 <td className="px-4 py-3.5 text-xs text-gray-400">{l.createdAt}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
