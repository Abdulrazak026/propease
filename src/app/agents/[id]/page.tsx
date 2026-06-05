"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { users, tasks, commissions, inquiries, listings } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function AgentProfilePage() {
 const { id } = useParams();
 const agent = users.find((u) => u.id === id && u.role === "agent");
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

 const agentTasks = tasks.filter((t) => t.assignedTo.id === agent.id);
 const agentCommissions = commissions.filter((c) => c.agent.id === agent.id);
 const agentInquiries = inquiries.filter((i) => i.assignedAgent?.id === agent.id);
 const agentListings = listings.filter((l) => l.assignedAgent?.id === agent.id);
 const fulfilledTasks = agentTasks.filter((t) => t.status === "fulfilled");
 const totalEarned = agentCommissions.reduce((s, c) => s + c.agentCut, 0);

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
 {agent.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
 { label: "Tasks Completed", value: fulfilledTasks.length, sub: `${agentTasks.length} total assigned`, accent: "bg-emerald-100", color: "text-emerald-600" },
 { label: "Commissions Earned", value: formatNaira(totalEarned), sub: `${agentCommissions.length} deals`, accent: "bg-[var(--color-primary)]/10", color: "text-[var(--color-primary)]" },
 { label: "Inquiries Handled", value: agentInquiries.length, sub: `${agentInquiries.filter(i => i.status === "new").length} new`, accent: "bg-blue-100", color: "text-blue-600" },
 { label: "Listings Managed", value: agentListings.length, sub: `${agentListings.filter(l => l.status === "available").length} active`, accent: "bg-amber-100", color: "text-amber-600" },
 ].map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 card-hover">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
 <span className={`text-sm font-bold ${s.color}`}>{typeof s.value === "string" && s.value.startsWith("₦") ? "₦" : s.value}</span>
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

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Tasks</h2>
 {agentTasks.length> 0 ? (
 <div className="space-y-1">
 {agentTasks.slice(0, 5).map((t) => (
 <div key={t.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
 <div className="min-w-0 flex-1">
 <p className="text-sm text-gray-900 truncate">{t.title}</p>
 <p className="text-xs text-gray-400 mt-0.5">{t.area}</p>
 </div>
 <Badge variant={t.status === "fulfilled" ? "success" : t.status === "in_progress" ? "warning" : "default"}>{t.status}</Badge>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-gray-400 py-6 text-center">No tasks assigned</p>
 )}
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission History</h2>
 {agentCommissions.length> 0 ? (
 <div className="space-y-1">
 {agentCommissions.map((c) => (
 <div key={c.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
 <div className="min-w-0 flex-1">
 <p className="text-sm text-gray-900 truncate">{c.dealTitle}</p>
 <p className="text-xs text-gray-400 mt-0.5">{c.dealType} • {formatDate(c.paidAt)}</p>
 </div>
 <span className="text-sm font-medium text-emerald-600">{formatNaira(c.agentCut)}</span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-gray-400 py-6 text-center">No commissions yet</p>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
