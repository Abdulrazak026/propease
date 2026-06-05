"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ApplicationData {
 listingId: string;
 fullName: string;
 email: string;
 phone: string;
 dateOfBirth: string;
 employmentStatus: string;
 employer: string;
 jobTitle: string;
 workAddress: string;
 monthlyIncome: string;
 idType: string;
 idNumber: string;
 refName: string;
 refPhone: string;
 refEmail: string;
 refRelation: string;
 nokName: string;
 nokPhone: string;
 nokEmail: string;
 nokRelation: string;
}

const emptyForm: ApplicationData = {
 listingId: "",
 fullName: "", email: "", phone: "", dateOfBirth: "",
 employmentStatus: "", employer: "", jobTitle: "", workAddress: "",
 monthlyIncome: "",
 idType: "", idNumber: "",
 refName: "", refPhone: "", refEmail: "", refRelation: "",
 nokName: "", nokPhone: "", nokEmail: "", nokRelation: "",
};

const steps = [
 { num: 1, label: "Personal Info" },
 { num: 2, label: "Employment" },
 { num: 3, label: "Income" },
 { num: 4, label: "ID Verification" },
 { num: 5, label: "References" },
 { num: 6, label: "Next of Kin" },
];

function StepIndicator({ current }: { current: Step }) {
 return (
 <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
 {steps.map((s) => {
 const isActive = s.num === current;
 const isDone = s.num < current;
 return (
 <div key={s.num} className="flex items-center gap-1 shrink-0">
 <div
 className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
 isDone ? "bg-emerald-500 text-white" :
 isActive ? "bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)]/30" :
 "bg-gray-100 text-gray-400"
 }`}
>
 {isDone ? (
 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 ) : (
 s.num
 )}
 </div>
 <span className={`text-[10px] font-medium mr-2 ${isActive ? "text-[var(--color-primary)]" : isDone ? "text-emerald-600" : "text-gray-400"}`}>
 {s.label}
 </span>
 </div>
 );
 })}
 </div>
 );
}

export default function ApplyPageWrapper() {
 return (
 <Suspense fallback={<div className="flex-1 flex items-center justify-center py-24"><p className="text-sm text-gray-400">Loading...</p></div>}>
 <ApplyPage />
 </Suspense>
 );
}

function ApplyPage() {
 const searchParams = useSearchParams();
 const [step, setStep] = useState<Step>(1);
 const [form, setForm] = useState<ApplicationData>(() => ({
 ...emptyForm,
 listingId: searchParams.get("listing") || "",
 }));
 const [submitted, setSubmitted] = useState(false);

 const update = (field: keyof ApplicationData, value: string) => {
 setForm((prev) => ({ ...prev, [field]: value }));
 };

 const canProceed = (s: Step): boolean => {
 switch (s) {
 case 1: return form.fullName.length>= 2 && form.email.includes("@") && form.phone.length>= 8;
 case 2: return form.employmentStatus !== "";
 case 3: return form.monthlyIncome !== "";
 case 4: return form.idType !== "" && form.idNumber.length>= 3;
 case 5: return form.refName.length>= 2 && form.refPhone.length>= 8;
 case 6: return form.nokName.length>= 2 && form.nokPhone.length>= 8;
 default: return true;
 }
 };

 const handleSubmit = () => {
 setSubmitted(true);
 };

 if (submitted) {
 return (
 <div className="flex-1 flex items-center justify-center py-24 px-4">
 <div className="max-w-md w-full text-center">
 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
 <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
 <p className="text-sm text-gray-500 mb-2">Your rental application has been received. The agent will review your details and contact you.</p>
 <p className="text-xs text-gray-400 mb-6">Reference: APP-{Date.now().toString().slice(-6)}</p>
 <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-all">
 Back to Listings
 </Link>
 </div>
 </div>
 );
 }

  return (
  <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="mb-6">
  <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition mb-3">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
 Back to listings
 </Link>
 <h1 className="text-xl font-bold text-gray-900">Rental Application</h1>
 <p className="text-sm text-gray-500 mt-0.5">Complete all 6 steps to submit your application</p>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-6">
 <StepIndicator current={step} />

 {/* Step 1: Personal Info */}
 {step === 1 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
 <p className="text-xs text-gray-500">Basic details about you</p>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
 <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. Sani Ibrahim Musa" />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
 <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="you@example.com" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
 <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="0803 123 4567" />
 </div>
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
 <input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" />
 </div>
 </div>
 )}

 {/* Step 2: Employment */}
 {step === 2 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">Employment Details</h2>
 <p className="text-xs text-gray-500">Your current employment situation</p>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-2">Employment Status *</label>
 <div className="grid grid-cols-2 gap-2">
 {["Employed", "Self-Employed", "Business Owner", "Unemployed", "Student", "Retired"].map((s) => (
 <button
 key={s}
 onClick={() => update("employmentStatus", s)}
 className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
 form.employmentStatus === s ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]" : "border-gray-200 text-gray-600 hover:border-gray-300"
 }`}
>
 {s}
 </button>
 ))}
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Employer / Business Name</label>
 <input value={form.employer} onChange={(e) => update("employer", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Company name" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
 <input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. Civil Servant" />
 </div>
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Work Address</label>
 <input value={form.workAddress} onChange={(e) => update("workAddress", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Office / business location" />
 </div>
 </div>
 )}

 {/* Step 3: Income */}
 {step === 3 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">Income Information</h2>
 <p className="text-xs text-gray-500">Your monthly income helps us find the right property for you</p>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Monthly Income *</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₦</span>
 <input value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} type="number" className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-sm" placeholder="e.g. 150000" />
 </div>
 <p className="text-[10px] text-gray-400 mt-1">Enter your average monthly income after tax</p>
 </div>
 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
 <p className="text-xs text-amber-800 flex items-center gap-2">
 <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 Your income information is kept confidential and only shared with the agent reviewing your application.
 </p>
 </div>
 </div>
 )}

 {/* Step 4: ID Verification */}
 {step === 4 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">ID Verification</h2>
 <p className="text-xs text-gray-500">Upload a valid form of identification</p>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-2">ID Type *</label>
 <div className="grid grid-cols-2 gap-2">
 {[
 { value: "nin", label: "National ID (NIN)" },
 { value: "bvn", label: "BVN" },
 { value: "intl_passport", label: "International Passport" },
 { value: "drivers_license", label: "Driver's License" },
 { value: "voters_card", label: "Voter's Card" },
 ].map((idType) => (
 <button
 key={idType.value}
 onClick={() => update("idType", idType.value)}
 className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
 form.idType === idType.value ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]" : "border-gray-200 text-gray-600 hover:border-gray-300"
 }`}
>
 {idType.label}
 </button>
 ))}
 </div>
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">ID Number *</label>
 <input value={form.idNumber} onChange={(e) => update("idNumber", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Enter your ID number" />
 </div>
 <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
 <p className="text-xs text-gray-500 text-center">
 <span className="font-medium text-gray-700">Upload ID Document</span> (optional for now)<br />
 You can upload a scanned copy of your ID during the final agreement stage.
 </p>
 </div>
 </div>
 )}

 {/* Step 5: References */}
 {step === 5 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">Reference</h2>
 <p className="text-xs text-gray-500">Someone who can vouch for you (not a family member)</p>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Reference Full Name *</label>
 <input value={form.refName} onChange={(e) => update("refName", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Full name" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
 <input value={form.refPhone} onChange={(e) => update("refPhone", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Phone number" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
 <input type="email" value={form.refEmail} onChange={(e) => update("refEmail", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Email address" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Relationship</label>
 <input value={form.refRelation} onChange={(e) => update("refRelation", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. Employer, Colleague" />
 </div>
 </div>
 </div>
 )}

 {/* Step 6: Next of Kin */}
 {step === 6 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">Next of Kin</h2>
 <p className="text-xs text-gray-500">Emergency contact information</p>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
 <input value={form.nokName} onChange={(e) => update("nokName", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Full name" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
 <input value={form.nokPhone} onChange={(e) => update("nokPhone", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Phone number" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
 <input type="email" value={form.nokEmail} onChange={(e) => update("nokEmail", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="Email address" />
 </div>
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-1">Relationship *</label>
 <input value={form.nokRelation} onChange={(e) => update("nokRelation", e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm" placeholder="e.g. Spouse, Parent, Sibling" />
 </div>
 </div>
 </div>
 )}

 {/* Step 7: Review */}
 {step === 7 && (
 <div className="space-y-4">
 <h2 className="text-base font-semibold text-gray-900">Review Your Application</h2>
 <p className="text-xs text-gray-500">Please verify all information before submitting</p>
 <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
 <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-600">{form.fullName}</span></div>
 <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-600">{form.email}</span></div>
 <div><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-600">{form.phone}</span></div>
 <div><span className="font-medium text-gray-700">Employment:</span> <span className="text-gray-600">{form.employmentStatus} at {form.employer}</span></div>
 <div><span className="font-medium text-gray-700">Monthly Income:</span> <span className="text-gray-600">₦{parseInt(form.monthlyIncome || "0").toLocaleString()}</span></div>
 <div><span className="font-medium text-gray-700">ID Type:</span> <span className="text-gray-600">{form.idType}</span></div>
 <div><span className="font-medium text-gray-700">Reference:</span> <span className="text-gray-600">{form.refName}</span></div>
 <div><span className="font-medium text-gray-700">Next of Kin:</span> <span className="text-gray-600">{form.nokName} ({form.nokRelation})</span></div>
 </div>
 </div>
 )}

 {/* Navigation Buttons */}
 <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
 <div>
 {step> 1 ? (
 <Button variant="outline" onClick={() => setStep((step - 1) as Step)}>
 ← Back
 </Button>
 ) : (
 <div />
 )}
 </div>
 <div className="flex items-center gap-2">
 {step < 6 && (
 <Button
 disabled={!canProceed(step)}
 onClick={() => setStep((step + 1) as Step)}
>
 Continue →
 </Button>
 )}
 {step === 6 && (
 <Button onClick={() => setStep(7)}>
 Review →
 </Button>
 )}
 {step === 7 && (
 <Button onClick={handleSubmit}>
 Submit Application
 </Button>
 )}
 </div>
 </div>

 {step < 7 && (
 <p className="text-xs text-gray-400 text-center mt-4">
 Step {step} of 6
 </p>
 )}
 </div>

 {/* Add Apply Now button to listing detail page */}
 <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-5">
 <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 Why apply?
 </h3>
 <ul className="text-xs text-blue-700 mt-2 space-y-1">
 <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" /> Get pre-approved before viewing properties</li>
 <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" /> Landlords prefer tenants with completed applications</li>
 <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" /> Skip the paperwork when you find the right property</li>
 </ul>
 </div>
 </div>
 );
}
