"use client";
import { useState } from "react";
import Link from "next/link";
import { formatNaira, formatDate } from "@/lib/utils";

type AgreementStatus = "draft" | "pending_landlord" | "pending_tenant" | "completed" | "expired" | "terminated";

const mockAgreements = [
 { id: "ag-001", tenantName: "Sani Ibrahim Musa", landlordName: "Alh. Sani Abubakar", propertyTitle: "3-Bedroom Flat — Fagge", annualRent: 1_200_000, status: "pending_landlord" as const, createdAt: "2026-06-04", agent: "Fatima Usman" },
 { id: "ag-002", tenantName: "Fatima Kabir Abdullahi", landlordName: "Dr. Khalid Suleiman", propertyTitle: "Shop Space — Kano Municipal", annualRent: 1_200_000, status: "pending_tenant" as const, createdAt: "2026-06-03", agent: "Fatima Usman" },
 { id: "ag-003", tenantName: "Musa Abubakar Bello", landlordName: "Alh. Sani Abubakar", propertyTitle: "Warehouse Space — Fagge", annualRent: 2_400_000, status: "completed" as const, createdAt: "2026-06-01", agent: "Ahmad Suleiman" },
 { id: "ag-004", tenantName: "Zainab Muhammad", landlordName: "Alh. Sani Abubakar", propertyTitle: "4-Bedroom Duplex — Kano Municipal", annualRent: 1_800_000, status: "draft" as const, createdAt: "2026-06-05", agent: "Nura Muhd" },
];

const statusStyles: Record<AgreementStatus, string> = {
 draft: "bg-gray-100 text-gray-700",
 pending_landlord: "bg-amber-100 text-amber-800",
 pending_tenant: "bg-blue-100 text-blue-800",
 completed: "bg-emerald-100 text-emerald-800",
 expired: "bg-red-100 text-red-800",
 terminated: "bg-red-100 text-red-800",
};

export default function AdminAgreementsPage() {
 const [filter, setFilter] = useState<AgreementStatus | "all">("all");
 const agreements = filter === "all" ? mockAgreements : mockAgreements.filter((a) => a.status === filter);

 const stats = {
 total: mockAgreements.length,
 pending: mockAgreements.filter((a) => a.status === "pending_landlord" || a.status === "pending_tenant").length,
 completed: mockAgreements.filter((a) => a.status === "completed").length,
 };

 return (
 <div className="space-y-6-up">
 <div>
 <h1 className="text-xl font-bold text-gray-900">All Agreements</h1>
 <p className="text-sm text-gray-500 mt-0.5">Overview of all tenancy agreements across the platform</p>
 </div>

 <div className="grid grid-cols-3 gap-3">
 <button onClick={() => setFilter("all")} className={`bg-white rounded-lg border p-4 text-left ${filter === "all" ? "border-[var(--color-primary)]" : "border-gray-200"}`}>
 <p className="text-xs text-gray-500">Total</p>
 <p className="text-lg font-bold text-gray-900 mt-0.5">{stats.total}</p>
 </button>
 <button onClick={() => setFilter("pending_landlord")} className={`bg-white rounded-lg border p-4 text-left ${filter === "pending_landlord" ? "border-amber-400" : "border-gray-200"}`}>
 <p className="text-xs text-gray-500">Pending Signature</p>
 <p className="text-lg font-bold text-amber-600 mt-0.5">{stats.pending}</p>
 </button>
 <button onClick={() => setFilter("completed")} className={`bg-white rounded-lg border p-4 text-left ${filter === "completed" ? "border-emerald-400" : "border-gray-200"}`}>
 <p className="text-xs text-gray-500">Completed</p>
 <p className="text-lg font-bold text-emerald-600 mt-0.5">{stats.completed}</p>
 </button>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/50">
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Property</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tenant</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Landlord</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Rent</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Agent</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
 </tr>
 </thead>
 <tbody>
 {agreements.map((ag) => (
 <tr key={ag.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
 <td className="px-4 py-3">
 <Link href={`/agreements/${ag.id}`} className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)]">
 {ag.propertyTitle}
 </Link>
 </td>
 <td className="px-4 py-3 text-xs text-gray-700">{ag.tenantName}</td>
 <td className="px-4 py-3 text-xs text-gray-700">{ag.landlordName}</td>
 <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(ag.annualRent)}</td>
 <td className="px-4 py-3 text-xs text-gray-500">{ag.agent}</td>
 <td className="px-4 py-3">
 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyles[ag.status]}`}>
 {ag.status.replace("_", " ")}
 </span>
 </td>
 <td className="px-4 py-3 text-xs text-gray-400">{formatDate(ag.createdAt)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
