"use client";
import { useState, Suspense, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import AgreementTemplate from "@/components/agreements/AgreementTemplate";
import SignaturePad from "@/components/ui/SignaturePad";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";

function AgreementContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const signRole = searchParams.get("role") || null;

  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<any>(`/api/agreements/${id}`).then(r => {
      if (r.data) setAgreement((r.data as any).agreement || r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>;
  if (!agreement) return <div className="flex-1 flex items-center justify-center py-24"><div className="text-center"><div className="text-5xl mb-4">&#x1F4C4;</div><h2 className="text-lg font-semibold text-gray-900">Agreement not found</h2><Link href="/" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">&#x2190; Go home</Link></div></div>;

  const isFullySigned = agreement.landlordSignature && agreement.tenantSignature;
  const pendingSign = signRole === "landlord" ? !agreement.landlordSignature : signRole === "tenant" ? !agreement.tenantSignature : false;

  const handleSign = async (dataUrl: string) => {
    setError("");
    try {
      const r = await api.post(`/api/agreements/${id}/sign`, {
        role: signRole,
        signature: dataUrl,
      });
      if ((r.data as any)?.agreement) setAgreement((r.data as any).agreement);
      setShowSignaturePad(false);
      setSigned(true);
    } catch (err: any) {
      setError(err?.message || "Signing failed");
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Back
      </Link>

      {isFullySigned && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div><p className="text-sm font-medium text-emerald-800">Agreement Fully Signed and Executed</p><p className="text-xs text-emerald-600">This document is legally binding.</p></div>
        </div>
      )}

      {!isFullySigned && signRole === "landlord" && !agreement.landlordSignature && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5"><p className="text-sm font-medium text-amber-800">Your signature is required</p><p className="text-xs text-amber-700 mt-0.5">You are signing as the Landlord/Agent.</p></div>
      )}
      {!isFullySigned && signRole === "tenant" && !agreement.tenantSignature && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5"><p className="text-sm font-medium text-blue-800">Your signature is required</p><p className="text-xs text-blue-700 mt-0.5">The landlord has signed. Now it's your turn as Tenant.</p></div>
      )}

      <AgreementTemplate agreement={agreement} mode={isFullySigned ? "signed" : pendingSign ? "signing" : "preview"} />

      {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>}

      {pendingSign && !showSignaturePad && !signed && (
        <div className="mt-5"><Button className="w-full py-3" onClick={() => setShowSignaturePad(true)}>Sign as {signRole === "landlord" ? "Landlord/Agent" : "Tenant"}</Button></div>
      )}

      {pendingSign && showSignaturePad && (
        <div className="mt-5 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sign as {signRole === "landlord" ? "Landlord/Agent" : "Tenant"}</h3>
          <SignaturePad onSave={handleSign} label="Draw your signature above" />
        </div>
      )}

      {isFullySigned && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => window.print()}>Print / Save as PDF</Button>
          <Button onClick={() => { navigator.clipboard.writeText(window.location.href); }}>Copy Link</Button>
        </div>
      )}

      {signed && (
        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-lg p-5 text-center">
          <p className="text-sm font-medium text-emerald-800">Signature Saved!</p>
          <p className="text-xs text-emerald-600 mt-1">{signRole === "landlord" ? "The agreement will now be sent to the tenant." : "The agreement is now fully signed."}</p>
        </div>
      )}
    </div>
  );
}

export default function AgreementDetailPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>}>
      <AgreementContent />
    </Suspense>
  );
}
