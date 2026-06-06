"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  whyAgent: string;
  heardAbout: string;
}

export default function ApplyAsAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "terms" | "done">("form");
  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", phone: "", location: "",
    experience: "", whyAgent: "", heardAbout: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("terms");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    const { status } = await api.post("/api/auth/register", {
      name: form.fullName,
      email: form.email,
      password: form.phone,
      role: "agent",
      city: form.location,
    });
    setSubmitting(false);
    if (status === 201) {
      setStep("done");
    } else if (status === 409) {
      setError("This email is already registered");
    } else {
      setError("Submission failed. Please try again.");
    }
  };

  if (step === "done") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-lg w-full text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-sm text-gray-500 mb-1">Thank you for applying to become an MBPP agent.</p>
          <p className="text-sm text-gray-500 mb-6">Our team will review your application and get back to you within 2–3 business days.</p>
          <p className="text-xs text-gray-400">A confirmation email has been sent to <span className="font-medium text-gray-600">{form.email}</span></p>
        </div>
      </main>
    );
  }

  if (step === "terms") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl w-full">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Agent Terms & Conditions</h1>
          <div className="text-sm text-gray-600 space-y-3 mb-6 max-h-80 overflow-y-auto border border-gray-100 rounded-lg p-4 bg-gray-50">
            <p><strong>1. Code of Conduct</strong><br />As an MBPP agent, you agree to represent properties truthfully, maintain client confidentiality, and act in the best interest of both property owners and tenants.</p>
            <p><strong>2. Listing Accuracy</strong><br />All property listings must include accurate information, current photographs, and truthful descriptions. Misrepresentation will result in immediate termination.</p>
            <p><strong>3. Commission Structure</strong><br />Agents earn a commission of 5% on each successful rental or sale transaction facilitated through MBPP. Commissions are paid within 7 days of transaction completion.</p>
            <p><strong>4. Verification Requirements</strong><br />Agents must provide valid identification (NIN or BVN), proof of address, and two professional references. MBPP reserves the right to verify all provided information.</p>
            <p><strong>5. Exclusive Platform</strong><br />Properties listed on MBPP must not be listed on competing platforms at a lower price. Agents are encouraged to use MBPP as their primary listing platform.</p>
            <p><strong>6. Data Protection</strong><br />Agents must comply with the Nigeria Data Protection Regulation (NDPR). Client personal information must not be shared with third parties without explicit consent.</p>
            <p><strong>7. Dispute Resolution</strong><br />Any disputes arising from agent activities shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria.</p>
            <p><strong>8. Termination</strong><br />MBPP reserves the right to terminate an agent's account with 14 days&apos; notice if terms are violated. Agents may terminate their account at any time with 7 days&apos; notice.</p>
          </div>
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-gray-600">
              I have read and agree to the <strong>Agent Terms & Conditions</strong> above. I confirm that all information provided in my application is accurate and complete.
            </span>
          </label>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>Back</Button>
            <Button className="flex-1" disabled={!agreed} onClick={handleConfirm}>Submit Application</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Apply as an Agent</h1>
            <p className="text-sm text-gray-500">Join MBPP and start earning commissions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
              placeholder="e.g. Ibrahim Musa"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
                placeholder="080 XXX XXX XX"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / City *</label>
            <input
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
              placeholder="e.g. Kano Municipal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Real Estate Experience</label>
            <select
              value={form.experience}
              onChange={(e) => update("experience", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
            >
              <option value="">Select experience level</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1–3 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">More than 5 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join MBPP? *</label>
            <textarea
              required
              rows={3}
              value={form.whyAgent}
              onChange={(e) => update("whyAgent", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm resize-none"
              placeholder="Tell us about yourself and why you'd make a great agent..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
            <select
              value={form.heardAbout}
              onChange={(e) => update("heardAbout", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
            >
              <option value="">Select</option>
              <option value="social">Social Media</option>
              <option value="friend">Friend or Family</option>
              <option value="search">Search Engine</option>
              <option value="advert">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Continue to Terms & Conditions
          </Button>
        </form>
      </div>
    </main>
  );
}
