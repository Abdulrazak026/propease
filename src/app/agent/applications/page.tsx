"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";

// Mock applications till backend is live
const mockApplications: ApplicationData[] = [
 {
 id: "app1",
 fullName: "Sani Ibrahim Musa",
 email: "sani@example.com",
 phone: "0803 123 4567",
 employmentStatus: "Employed",
 employer: "Kano State Civil Service",
 jobTitle: "Administrative Officer",
 monthlyIncome: 250000,
 idType: "nin",
 idNumber: "12345678901",
 refName: "Alh. Garba Suleiman",
 refPhone: "0805 987 6543",
 nokName: "Aisha Sani",
 nokPhone: "0706 543 2109",
 nokRelation: "Spouse",
 status: "submitted" as const,
 createdAt: "2026-06-04",
 listingTitle: "3-Bedroom Flat — Fagge",
 },
 {
 id: "app2",
 fullName: "Fatima Kabir Abdullahi",
 email: "fatima@example.com",
 phone: "0809 876 5432",
 employmentStatus: "Self-Employed",
 employer: "K & F Fashion House",
 jobTitle: "Owner",
 monthlyIncome: 400000,
 idType: "intl_passport",
 idNumber: "A01234567",
 refName: "Hajiya Hauwa Muhammad",
 refPhone: "0802 345 6789",
 nokName: "Kabir Abdullahi",
 nokPhone: "0810 123 4567",
 nokRelation: "Father",
 status: "under_review" as const,
 createdAt: "2026-06-03",
 listingTitle: "Shop Space — Kano Municipal",
 },
 {
 id: "app3",
 fullName: "Musa Abubakar Bello",
 email: "musa@example.com",
 phone: "0701 234 5678",
 employmentStatus: "Business Owner",
 employer: "Bello Transport Services",
 jobTitle: "CEO",
 monthlyIncome: 800000,
 idType: "drivers_license",
 idNumber: "DL-567890",
 refName: "Engr. Bello Muhammad",
 refPhone: "0806 543 2109",
 nokName: "Hafsat Musa",
 nokPhone: "0807 654 3210",
 nokRelation: "Spouse",
 status: "approved" as const,
 createdAt: "2026-06-01",
 listingTitle: "Warehouse Space — Fagge",
 },
];

type AppStatus = "submitted" | "under_review" | "approved" | "rejected";
const allStatuses: AppStatus[] = ["submitted", "under_review", "approved", "rejected"];

interface ApplicationData {
 id: string;
 fullName: string;
 email: string;
 phone: string;
 employmentStatus: string;
 employer: string;
 jobTitle: string;
 monthlyIncome: number;
 idType: string;
 idNumber: string;
 refName: string;
 refPhone: string;
 nokName: string;
 nokPhone: string;
 nokRelation: string;
 status: AppStatus;
 createdAt: string;
 listingTitle: string;
}

const statusStyles: Record<AppStatus, string> = {
 submitted: "bg-blue-100 text-blue-800",
 under_review: "bg-amber-100 text-amber-800",
 approved: "bg-emerald-100 text-emerald-800",
 rejected: "bg-red-100 text-red-800",
};

export default function AgentApplicationsPage() {
 const { currentUser } = useRole();
 const [apps, setApps] = useState(mockApplications);
 const [selected, setSelected] = useState<string | null>(null);

 const updateStatus = (id: string, status: AppStatus) => {
 setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
 };

 const selectedApp = apps.find((a) => a.id === selected);

 return (
 <div className="space-y-4">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Tenant Applications</h1>
 <p className="text-sm text-gray-500 mt-0.5">
 {apps.filter(a => a.status === "submitted").length} new, {apps.filter(a => a.status === "under_review").length} under review
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
 <div className="lg:col-span-2 space-y-2">
 {apps.length === 0 ? (
 <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
 <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <p className="text-sm font-medium text-gray-900">No applications yet</p>
 <p className="text-xs text-gray-500 mt-1">Tenant applications will appear here</p>
 </div>
 ) : (
 apps.map((app) => (
 <button
 key={app.id}
 onClick={() => setSelected(app.id)}
 className={`w-full text-left bg-white rounded-lg border p-4 transition-all ${
 selected === app.id ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]" : "border-gray-200 hover:border-gray-300"
 }`}
>
 <div className="flex items-start justify-between gap-2 mb-2">
 <span className="font-medium text-sm text-gray-900">{app.fullName}</span>
 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyles[app.status]}`}>
 {app.status.replace("_", " ")}
 </span>
 </div>
 <p className="text-xs text-gray-500">For: {app.listingTitle}</p>
 <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
 <span className="text-[10px] text-gray-400">Income: ₦{app.monthlyIncome.toLocaleString()}/mo</span>
 <span className="text-[10px] text-gray-400">{app.createdAt}</span>
 </div>
 </button>
 ))
 )}
 </div>

 <div className="lg:col-span-3">
 {selectedApp ? (
 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h2 className="text-base font-semibold text-gray-900">{selectedApp.fullName}</h2>
 <p className="text-xs text-gray-500">{selectedApp.email} · {selectedApp.phone}</p>
 </div>
 <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[selectedApp.status]}`}>
 {selectedApp.status.replace("_", " ")}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-5">
 <div className="bg-gray-50 rounded-lg p-3">
 <p className="text-[10px] text-gray-500 uppercase font-medium">Employment</p>
 <p className="text-sm font-medium text-gray-900 mt-1">{selectedApp.employmentStatus}</p>
 <p className="text-xs text-gray-500">{selectedApp.employer} · {selectedApp.jobTitle}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-3">
 <p className="text-[10px] text-gray-500 uppercase font-medium">Monthly Income</p>
 <p className="text-sm font-medium text-gray-900 mt-1">₦{selectedApp.monthlyIncome.toLocaleString()}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-3">
 <p className="text-[10px] text-gray-500 uppercase font-medium">ID Type</p>
 <p className="text-sm font-medium text-gray-900 mt-1">{selectedApp.idType}</p>
 <p className="text-xs text-gray-500">{selectedApp.idNumber}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-3">
 <p className="text-[10px] text-gray-500 uppercase font-medium">Property</p>
 <p className="text-sm font-medium text-gray-900 mt-1">{selectedApp.listingTitle}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-5">
 <div className="bg-gray-50 rounded-lg p-3">
 <p className="text-[10px] text-gray-500 uppercase font-medium">Reference</p>
 <p className="text-sm font-medium text-gray-900 mt-1">{selectedApp.refName}</p>
 <p className="text-xs text-gray-500">{selectedApp.refPhone}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-3">
 <p className="text-[10px] text-gray-500 uppercase font-medium">Next of Kin</p>
 <p className="text-sm font-medium text-gray-900 mt-1">{selectedApp.nokName}</p>
 <p className="text-xs text-gray-500">{selectedApp.nokRelation} · {selectedApp.nokPhone}</p>
 </div>
 </div>

 <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
 {selectedApp.status !== "approved" && (
 <Button
 onClick={() => updateStatus(selectedApp.id, "approved")}
>
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 Approve
 </Button>
 )}
 {selectedApp.status !== "under_review" && selectedApp.status !== "rejected" && (
 <Button
 variant="outline"
 onClick={() => updateStatus(selectedApp.id, "under_review")}
>
 Mark Under Review
 </Button>
 )}
 {selectedApp.status !== "rejected" && selectedApp.status !== "approved" && (
 <Button
 variant="outline"
 className="text-red-600 border-red-200 hover:bg-red-50"
 onClick={() => updateStatus(selectedApp.id, "rejected")}
>
 Reject
 </Button>
 )}
 <WhatsAppInline phone={selectedApp.phone} name={selectedApp.fullName} />
 </div>
 </div>
 ) : (
 <div className="bg-white rounded-lg border border-gray-200 p-8 text-center h-full flex items-center justify-center">
 <div>
 <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
 <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
 </svg>
 </div>
 <p className="text-sm font-medium text-gray-900">Select an application</p>
 <p className="text-xs text-gray-500 mt-1">Choose from the list to review details</p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}

function WhatsAppInline({ phone, name }: { phone: string; name: string }) {
 const digits = phone.replace(/\D/g, "");
 const normalized = digits.startsWith("0") ? "234" + digits.slice(1) : digits.startsWith("234") ? digits : "234" + digits;
 const url = `https://wa.me/${normalized}?text=${encodeURIComponent(`Hello ${name}, this is regarding your rental application on MBPP.`)}`;

 return (
 <a href={url} target="_blank" rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 transition-all"
>
 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
 </svg>
 WhatsApp
 </a>
 );
}
