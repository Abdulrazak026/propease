"use client";
import { formatNaira, formatDate } from "@/lib/utils";

interface AgreementData {
 id?: string;
 tenantName: string;
 tenantEmail: string;
 tenantPhone: string;
 landlordName: string;
 propertyTitle: string;
 propertyAddress: string;
 propertyCity: string;
 annualRent: number;
 damageDeposit: number;
 serviceCharge: number;
 startDate: string;
 endDate: string;
 rentDueDay: number;
 noticePeriodDays: number;
 renewalType: string;
 tenantSignature?: string | null;
 tenantSignedAt?: string | null;
 landlordSignature?: string | null;
 landlordSignedAt?: string | null;
 createdDate?: string;
}

interface Props {
 agreement: AgreementData;
 mode?: "preview" | "signing" | "signed";
}

const clauses = [
 {
 title: "1. PARTIES",
 text: "This Tenancy Agreement is made between the Landlord/Agent and the Tenant for the property described below.",
 },
 {
 title: "2. PROPERTY",
 text: "The Landlord agrees to let and the Tenant agrees to take the property known as the Premises for the Term at the Rent.",
 },
 {
 title: "3. TERM",
 text: "The tenancy shall commence on the Start Date and continue until the End Date unless terminated earlier in accordance with this Agreement. The Tenant shall have no right to remain in occupation after the End Date without a new agreement.",
 },
 {
 title: "4. RENT",
 text: "The Tenant shall pay the Annual Rent in advance on the Rent Due Day of each period. Rent is payable in Nigerian Naira (NGN). Late payment will attract a penalty of 10% of the outstanding amount per month.",
 },
 {
 title: "5. DEPOSIT",
 text: "The damage deposit shall be held by the Landlord as security against breach of terms, damage to the property, or unpaid bills. Subject to a property inspection at the end of the term and deductions for any damages (fair wear and tear excepted), the deposit shall be refunded within 30 days of termination.",
 },
 {
 title: "6. TENANT OBLIGATIONS",
 text: "The Tenant shall: (a) pay rent on time; (b) keep the premises in good condition; (c) not sublet or assign without written consent; (d) allow Landlord reasonable access for inspections; (e) not make alterations without consent; (f) comply with all applicable laws and community rules; (g) use the premises only for the agreed purpose.",
 },
 {
 title: "7. LANDLORD OBLIGATIONS",
 text: "The Landlord shall: (a) ensure the premises are habitable at the start; (b) maintain structural integrity; (c) carry out necessary repairs (excluding damage caused by Tenant); (d) ensure the premises comply with health and safety requirements; (e) respect the Tenant's right to quiet enjoyment.",
 },
 {
 title: "8. NOTICE PERIOD",
 text: "Either party may terminate this agreement by giving written notice. The notice period shall be 30 calendar days, or as otherwise specified in this Agreement.",
 },
 {
 title: "9. RENEWAL",
 text: "The tenancy shall automatically renew on a yearly basis unless either party gives written notice of non-renewal at least 30 days before the End Date. Renewal terms shall be negotiated in good faith.",
 },
 {
 title: "10. GOVERNING LAW",
 text: "This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria and the applicable tenancy laws of Kano State.",
 },
 {
 title: "11. DISPUTE RESOLUTION",
 text: "Any dispute arising from this Agreement shall first be referred to mediation. If mediation fails, the dispute shall be resolved by arbitration in accordance with the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria, 2004.",
 },
 {
 title: "12. ENTIRE AGREEMENT",
 text: "This Agreement constitutes the entire agreement between the parties. Any modification must be in writing and signed by both parties.",
 },
];

export default function AgreementTemplate({ agreement, mode = "preview" }: Props) {
 const now = new Date().toISOString();
 const createdDate = agreement.createdDate || now;
 const startDateFormatted = formatDate(agreement.startDate || createdDate);
 const endDateFormatted = formatDate(agreement.endDate || createdDate);

 return (
 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
 {/* Header */}
 <div className="bg-[var(--color-primary)] px-6 py-5 text-white">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-bold">TENANCY AGREEMENT</h2>
 <p className="text-white/70 text-xs mt-0.5">Residential Property Lease | Kano State, Nigeria</p>
 </div>
 {agreement.id && (
 <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-lg font-mono">
 REF: {agreement.id.slice(0, 8).toUpperCase()}
 </span>
 )}
 </div>
 <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-4 text-xs text-white/80">
 <div>Date: <span className="text-white font-medium">{formatDate(createdDate)}</span></div>
 <div>Type: <span className="text-white font-medium">Yearly Rent</span></div>
 </div>
 </div>

 {/* Parties */}
 <div className="px-6 py-5 border-b border-gray-100">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">THIS AGREEMENT is made between:</h3>
 <div className="grid grid-cols-2 gap-4 text-sm">
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">The Landlord/Agent</p>
 <p className="font-medium text-gray-900">{agreement.landlordName}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">The Tenant</p>
 <p className="font-medium text-gray-900">{agreement.tenantName}</p>
 <p className="text-xs text-gray-500 mt-0.5">{agreement.tenantEmail} · {agreement.tenantPhone}</p>
 </div>
 </div>
 </div>

 {/* Property & Financial */}
 <div className="px-6 py-5 border-b border-gray-100">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Property & Financial Details</h3>
 <div className="grid grid-cols-2 gap-4 text-sm">
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Property</p>
 <p className="font-medium text-gray-900">{agreement.propertyTitle}</p>
 <p className="text-xs text-gray-500">{agreement.propertyAddress}, {agreement.propertyCity}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Annual Rent</p>
 <p className="text-lg font-bold text-[var(--color-primary)]">{formatNaira(agreement.annualRent)}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Damage Deposit</p>
 <p className="font-medium text-gray-900">{agreement.damageDeposit ? formatNaira(agreement.damageDeposit) : "N/A"}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Service Charge</p>
 <p className="font-medium text-gray-900">{agreement.serviceCharge ? formatNaira(agreement.serviceCharge) : "N/A"}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Tenancy Term</p>
 <p className="font-medium text-gray-900">{startDateFormatted} → {endDateFormatted}</p>
 </div>
 <div className="bg-gray-50 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Rent Due Day</p>
 <p className="font-medium text-gray-900">{agreement.rentDueDay ? `${agreement.rentDueDay}th of each period` : "1st of each period"}</p>
 </div>
 </div>
 </div>

 {/* Clauses */}
 <div className="px-6 py-5 border-b border-gray-100">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
 <div className="space-y-4 text-sm">
 {clauses.map((c) => (
 <div key={c.title}>
 <p className="font-medium text-gray-900">{c.title}</p>
 <p className="text-gray-600 mt-0.5 text-xs leading-relaxed">{c.text}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Signatures */}
 <div className="px-6 py-5">
 <h3 className="text-sm font-semibold text-gray-900 mb-4">Signatures</h3>
 <div className="grid grid-cols-2 gap-6">
 {/* Landlord Signature */}
 <div className="border border-gray-200 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Landlord/Agent</p>
 <p className="text-sm font-medium text-gray-900 mb-3">{agreement.landlordName}</p>
 {agreement.landlordSignature ? (
 <div className="border-t border-gray-200 pt-3">
 <img src={agreement.landlordSignature} alt="Landlord signature" className="max-h-16 object-contain" />
 {agreement.landlordSignedAt && (
 <p className="text-[10px] text-gray-400 mt-1">Signed: {formatDate(agreement.landlordSignedAt)}</p>
 )}
 </div>
 ) : (
 <div className="border-t border-gray-200 pt-3">
 <p className="text-xs text-gray-300 italic">Awaiting signature</p>
 </div>
 )}
 </div>

 {/* Tenant Signature */}
 <div className="border border-gray-200 rounded-lg p-4">
 <p className="text-[10px] uppercase text-gray-500 font-medium mb-1">Tenant</p>
 <p className="text-sm font-medium text-gray-900 mb-3">{agreement.tenantName}</p>
 {agreement.tenantSignature ? (
 <div className="border-t border-gray-200 pt-3">
 <img src={agreement.tenantSignature} alt="Tenant signature" className="max-h-16 object-contain" />
 {agreement.tenantSignedAt && (
 <p className="text-[10px] text-gray-400 mt-1">Signed: {formatDate(agreement.tenantSignedAt)}</p>
 )}
 </div>
 ) : (
 <div className="border-t border-gray-200 pt-3">
 <p className="text-xs text-gray-300 italic">Awaiting signature</p>
 </div>
 )}
 </div>
 </div>

 {agreement.tenantSignature && agreement.landlordSignature && (
 <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
 <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-1">
 <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <p className="text-sm font-medium text-emerald-800">Agreement Fully Signed</p>
 <p className="text-[10px] text-emerald-600 mt-0.5">This agreement is legally binding. Download or print for your records.</p>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
 <p className="text-[10px] text-gray-400 text-center">
 MBPP Tenancy Agreement · Generated on {formatDate(now)} · Kano State, Nigeria
 </p>
 </div>
 </div>
 );
}
