"use client";
import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";
import { formatNaira, formatDate } from "@/lib/utils";

interface Agreement {
 id: string;
 tenantName: string;
 landlordName: string;
 propertyTitle: string;
 annualRent: number;
 status: AgreementStatus;
 createdAt: string;
}

type AgreementStatus = "draft" | "pending_landlord" | "pending_tenant" | "completed" | "expired" | "terminated";

const mockAgreements: Agreement[] = [
 { id: "ag-001", tenantName: "Sani Ibrahim Musa", landlordName: "Alh. Sani Abubakar", propertyTitle: "3-Bedroom Flat — Fagge", annualRent: 1_200_000, status: "pending_landlord", createdAt: "2026-06-04" },
 { id: "ag-002", tenantName: "Fatima Kabir Abdullahi", landlordName: "Dr. Khalid Suleiman", propertyTitle: "Shop Space — Kano Municipal", annualRent: 1_200_000, status: "pending_tenant", createdAt: "2026-06-03" },
 { id: "ag-003", tenantName: "Musa Abubakar Bello", landlordName: "Alh. Sani Abubakar", propertyTitle: "Warehouse Space — Fagge", annualRent: 2_400_000, status: "completed", createdAt: "2026-06-01" },
];

const statusStyles: Record<AgreementStatus, string> = {
 draft: "bg-gray-100 text-gray-700",
 pending_landlord: "bg-amber-100 text-amber-800",
 pending_tenant: "bg-blue-100 text-blue-800",
 completed: "bg-emerald-100 text-emerald-800",
 expired: "bg-red-100 text-red-800",
 terminated: "bg-red-100 text-red-800",
};

export default function AgentAgreementsPage() {
 const { currentUser } = useRole();
 const [agreements] = useState(mockAgreements);

 const handleShareViaWhatsApp = (ag: Agreement) => {
 const link = `${window.location.origin}/agreements/${ag.id}`;
 const url = `https://wa.me/?text=${encodeURIComponent(`Please sign your tenancy agreement for ${ag.propertyTitle}: ${link}`)}`;
 window.open(url, "_blank");
 };

 return (
 <div className="space-y-4-up">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Tenancy Agreements</h1>
 <p className="text-sm text-gray-500 mt-0.5">Generate and manage digital rent agreements</p>
 </div>
 <Link href="/agent/agreements/new">
 <Button>+ New Agreement</Button>
 </Link>
 </div>

 {agreements.length === 0 ? (
 <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
 <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
 <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
 </svg>
 </div>
 <p className="text-sm font-medium text-gray-900">No agreements yet</p>
 <p className="text-xs text-gray-500 mt-1">Create your first digital tenancy agreement</p>
 </div>
 ) : (
 <div className="space-y-2">
 {agreements.map((ag) => (
 <div key={ag.id} className="bg-white rounded-lg border border-gray-200 p-4">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-2 mb-1">
 <Link href={`/agreements/${ag.id}`} className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)] transition line-clamp-1">
 {ag.propertyTitle}
 </Link>
 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyles[ag.status]}`}>
 {ag.status.replace("_", " ")}
 </span>
 </div>
 <div className="flex items-center gap-3 text-xs text-gray-500">
 <span>Tenant: {ag.tenantName}</span>
 <span>·</span>
 <span>Landlord: {ag.landlordName}</span>
 <span>·</span>
 <span>{formatNaira(ag.annualRent)}/yr</span>
 </div>
 </div>
 <div className="flex items-center gap-2 shrink-0">
 <Link href={`/agreements/${ag.id}`} className="text-xs font-medium text-[var(--color-primary)] hover:underline px-2 py-1">
 View
 </Link>
 <button
 onClick={() => handleShareViaWhatsApp(ag)}
 className="text-xs font-medium text-green-600 hover:underline px-2 py-1"
>
 Share on WhatsApp
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
