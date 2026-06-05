"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import AgreementTemplate from "@/components/agreements/AgreementTemplate";
import SignaturePad from "@/components/ui/SignaturePad";
import Button from "@/components/ui/Button";

// Mock agreement data
const mockAgreement = {
 id: "ag-001",
 tenantName: "Sani Ibrahim Musa",
 tenantEmail: "sani@example.com",
 tenantPhone: "0803 123 4567",
 landlordName: "Alh. Sani Abubakar",
 propertyTitle: "3-Bedroom Flat — Fagge",
 propertyAddress: "Block C, Aminu Kano Crescent, Fagge",
 propertyCity: "Fagge",
 annualRent: 1_200_000,
 damageDeposit: 150_000,
 serviceCharge: 50_000,
 startDate: "2026-07-01",
 endDate: "2027-06-30",
 rentDueDay: 1,
 noticePeriodDays: 30,
 renewalType: "yearly",
 tenantSignature: null as string | null,
 tenantSignedAt: null as string | null,
 landlordSignature: null as string | null,
 landlordSignedAt: null as string | null,
 createdDate: "2026-06-04",
};

export default function AgreementDetailPage() {
 const { id } = useParams();
 const searchParams = useSearchParams();
 const signRole = searchParams.get("role") || null;

 const [agreement, setAgreement] = useState({ ...mockAgreement, id: id as string });
 const [showSignaturePad, setShowSignaturePad] = useState(false);
 const [signed, setSigned] = useState(false);

 const isFullySigned = agreement.landlordSignature && agreement.tenantSignature;
 const pendingSign = signRole === "landlord" ? !agreement.landlordSignature : signRole === "tenant" ? !agreement.tenantSignature : false;

 const handleSign = (dataUrl: string) => {
 const now = new Date().toISOString();
 if (signRole === "landlord") {
 setAgreement((prev) => ({ ...prev, landlordSignature: dataUrl, landlordSignedAt: now }));
 } else {
 setAgreement((prev) => ({ ...prev, tenantSignature: dataUrl, tenantSignedAt: now }));
 }
 setShowSignaturePad(false);
 setSigned(true);
 };

 return (
 <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition mb-4">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
 Back
 </Link>

 {/* Status Banner */}
 {isFullySigned && (
 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5 flex items-center gap-3">
 <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
 <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <div>
 <p className="text-sm font-medium text-emerald-800">Agreement Fully Signed and Executed</p>
 <p className="text-xs text-emerald-600">This document is legally binding. You can print or save as PDF.</p>
 </div>
 </div>
 )}

 {!isFullySigned && signRole === "landlord" && !agreement.landlordSignature && (
 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
 <p className="text-sm font-medium text-amber-800">Your signature is required</p>
 <p className="text-xs text-amber-700 mt-0.5">You are signing as the Landlord/Agent. After you sign, it will be sent to the tenant.</p>
 </div>
 )}

 {!isFullySigned && signRole === "tenant" && !agreement.tenantSignature && (
 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
 <p className="text-sm font-medium text-blue-800">Your signature is required</p>
 <p className="text-xs text-blue-700 mt-0.5">The landlord has signed. Now it's your turn as the Tenant.</p>
 </div>
 )}

 {/* The Agreement */}
 <AgreementTemplate agreement={agreement} mode={isFullySigned ? "signed" : pendingSign ? "signing" : "preview"} />

 {/* Signature Action */}
 {pendingSign && !showSignaturePad && !signed && (
 <div className="mt-5">
 <Button
 className="w-full py-3"
 onClick={() => setShowSignaturePad(true)}
>
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
 </svg>
 Sign as {signRole === "landlord" ? "Landlord/Agent" : "Tenant"}
 </Button>
 </div>
 )}

 {pendingSign && showSignaturePad && (
 <div className="mt-5 bg-white rounded-lg border border-gray-200 p-6">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Sign as {signRole === "landlord" ? "Landlord/Agent" : "Tenant"}</h3>
 <SignaturePad onSave={handleSign} label="Draw your signature above using your mouse or finger" />
 </div>
 )}

 {/* Print / Download */}
 {isFullySigned && (
 <div className="mt-5 flex items-center justify-center gap-3">
 <Button variant="outline" onClick={() => window.print()}>
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
 </svg>
 Print / Save as PDF
 </Button>
 <Button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}>
 Copy Agreement Link
 </Button>
 </div>
 )}

 {signed && (
 <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-lg p-5 text-center-up">
 <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
 <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <p className="text-sm font-medium text-emerald-800">Signature Saved!</p>
 <p className="text-xs text-emerald-600 mt-1">
 {signRole === "landlord"
 ? "The agreement will now be sent to the tenant for signing."
 : "The agreement is now fully signed and legally binding."}
 </p>
 </div>
 )}
 </div>
 );
}
