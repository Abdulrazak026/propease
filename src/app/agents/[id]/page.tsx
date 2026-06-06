"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatNaira, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ReviewSection from "@/components/listings/ReviewSection";
import { api } from "@/lib/api-client";

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get<any>(`/api/admin/users`),
      api.get<any>(`/api/reviews/agent/${id}`),
    ]).then(([usersR, revR]) => {
      if (usersR.data?.users) {
        const found = usersR.data.users.find((u: any) => u.id === id);
        setAgent(found || null);
      }
      if ((revR.data as any)?.reviews) setReviews(revR.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!agent) {
 return (
 <div className="flex-1 flex items-center justify-center py-24">
 <div className="text-center">
 <h2 className="text-xl font-semibold text-gray-900">Agent not found</h2>
 <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline mt-2 inline-block">← Back</Link>
 </div>
 </div>
 );
 }

  const avgRating = reviews?.averageRating || 0;
  const reviewCount = reviews?.totalCount || 0;
  const totalEarned = agent.walletBalance || 0;

 return (
 <div className="flex-1">
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <Link href="/ambassador" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition mb-6">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
 Back to Overview
 </Link>

 <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xl font-bold">
  {agent.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
 </div>
 <div className="flex-1">
 <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
 <p className="text-sm text-gray-500">{agent.city} • Agent</p>
 <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
 <span>Wallet: <strong className="text-gray-900">{formatNaira(agent.walletBalance)}</strong></span>
 {agent.canCloseDeals && <Badge variant="success">Can Close Deals</Badge>}
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
 {[
 { label: "Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", sub: `${reviewCount} reviews`, accent: "bg-emerald-100", color: "text-emerald-600" },
 { label: "Commissions Earned", value: formatNaira(totalEarned), sub: "from closed deals", accent: "bg-[var(--color-primary)]/10", color: "text-[var(--color-primary)]" },
 { label: "Inquiries Handled", value: "—", sub: "across listings", accent: "bg-blue-100", color: "text-blue-600" },
 { label: "Listings Managed", value: "—", sub: "active properties", accent: "bg-amber-100", color: "text-amber-600" },
 ].map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 card-hover">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
 <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
 </div>
 <div className="min-w-0">
 <p className="text-xs text-gray-500">{s.label}</p>
 <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
 <p className="text-[10px] text-gray-400">{s.sub}</p>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="max-w-3xl">
   <ReviewSection
     agentId={id as string}
     agentName={agent.name}
     listingId=""
     currentUserId=""
   />
 </div>
</div>
</div>
 );
}
