"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api-client";

const propertyTypes = [
 { value: "house", label: "House" },
 { value: "flat", label: "Flat" },
 { value: "land", label: "Land" },
 { value: "commercial", label: "Commercial" },
 { value: "other", label: "Other" },
];

export default function CustomOrderPage() {
 const [form, setForm] = useState({
 clientName: "", clientContact: "",
 propertyType: "house", area: "", budget: "",
 purpose: "rent", notes: "",
 });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const { status, data, error: apiError } = await api.post("/api/custom-orders", {
        clientName: form.clientName,
        clientContact: form.clientContact,
        propertyType: form.propertyType,
        area: form.area,
        budget: Number(form.budget) || 0,
        notes: form.notes,
      });
      if (status === 201 || status === 200) {
        setSubmitted(true);
      } else {
        setError((data as any)?.error || apiError || "Failed to submit");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
    setSending(false);
  };

 if (submitted) {
 return (
 <div className="flex-1 flex items-center justify-center py-24 px-4">
 <div className="text-center max-w-md">
 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 </div>
 <h1 className="text-2xl font-bold text-gray-900">Request Submitted!</h1>
 <p className="text-sm text-gray-500 mt-2">
 Your custom order has been received and will be routed to an ambassador in {form.area || "your area"}.
 They will follow up within 48 hours.
 </p>
 <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ clientName: "", clientContact: "", propertyType: "house", area: "", budget: "", purpose: "rent", notes: "" }); }}>
 Submit Another
 </Button>
 </div>
 </div>
 );
 }

 return (
 <div className="flex-1 py-16 px-4 bg-gray-50">
 <div className="max-w-xl mx-auto">
 <div className="text-center mb-8">
 <div className="w-14 h-14 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--color-primary)]/20">
 <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
 </div>
 <h1 className="text-2xl font-bold text-gray-900">Custom Property Request</h1>
 <p className="text-sm text-gray-500 mt-1">
 Tell us what you need and we&apos;ll find it for you
 </p>
 </div>

 <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg space-y-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Input label="Your Name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} required placeholder="e.g. Hadiza Mohammed" />
 <Input label="Phone Number" type="tel" value={form.clientContact} onChange={(e) => setForm({ ...form, clientContact: e.target.value })} required placeholder="0803 XXX XXXX" />
 </div>

 <div className="space-y-1.5">
 <label className="block text-sm font-medium text-gray-700">Property Type</label>
 <div className="flex flex-wrap gap-2">
 {propertyTypes.map((pt) => (
 <button
 key={pt.value}
 type="button"
 onClick={() => setForm({ ...form, propertyType: pt.value })}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
 form.propertyType === pt.value
 ? "bg-[var(--color-primary)] text-white"
 : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
 }`}
>
 {pt.label}
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Input label="Area / Neighborhood" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required placeholder="e.g. Kano Municipal, Tarauni" />
 <Input label="Budget (₦)" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required placeholder="e.g. 1500000" />
 </div>

 <div className="space-y-1.5">
 <label className="block text-sm font-medium text-gray-700">Purpose</label>
 <div className="flex gap-2">
 {["rent", "sale"].map((p) => (
 <button
 key={p}
 type="button"
 onClick={() => setForm({ ...form, purpose: p })}
 className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
 form.purpose === p
 ? "bg-[var(--color-accent)] text-white"
 : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
 }`}
>
 {p === "rent" ? "For Rent" : "For Sale"}
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
      <textarea
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        rows={3}
        placeholder="e.g. Must have borehole, gated compound, proximity to school..."
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none"
      />
    </div>

    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>}

    <Button type="submit" disabled={sending} className="w-full">{sending ? "Submitting..." : "Submit Request"}</Button>
 </form>
 </div>
 </div>
 );
}
