"use client";
import { users, tasks, commissions } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function AgentTrackingPage() {
 const agents = users.filter((u) => u.role === "agent");
 const ambassadors = users.filter((u) => u.role === "ambassador");

 return (
 <div className="space-y-6-up">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Agent Tracking</h1>
 <p className="text-sm text-gray-500 mt-0.5">Monitor agent performance and activity</p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
 {[
 { label: "Total Agents", value: agents.length, color: "text-[var(--color-primary)]" },
 { label: "Ambassadors", value: ambassadors.length, color: "text-amber-600" },
 { label: "Open Tasks", value: tasks.filter((t) => t.status === "open").length, color: "text-blue-600" },
 { label: "Commissions Paid", value: formatNaira(commissions.reduce((s, c) => s + c.agentCut, 0)), color: "text-emerald-600" },
 ].map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
 <p className="text-xs text-gray-500">{s.label}</p>
 <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
 </div>
 ))}
 </div>

 <div className="bg-white rounded-lg border border-gray-200">
 <div className="px-5 pt-5 pb-2">
 <h2 className="text-sm font-semibold text-gray-900">All Agents</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/50">
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ambassador</th>
 <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
 <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 </tr>
 </thead>
 <tbody>
 {agents.map((a) => {
 const ambassador = a.ambassadorId ? users.find((u) => u.id === a.ambassadorId) : null;
 const agentTasks = tasks.filter((t) => t.assignedTo.id === a.id);
 const activeTasks = agentTasks.filter((t) => t.status === "open" || t.status === "in_progress");
 return (
 <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
 <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{a.name}</td>
 <td className="px-4 py-3.5 text-sm text-gray-500">{a.city}</td>
 <td className="px-4 py-3.5 text-sm text-gray-700">{ambassador?.name || "-"}</td>
 <td className="px-4 py-3.5 text-sm text-right">{activeTasks.length} active</td>
 <td className="px-4 py-3.5 text-sm text-right font-medium">{formatNaira(a.walletBalance)}</td>
 <td className="px-4 py-3.5">
 <Badge variant={a.canCloseDeals ? "success" : "default"}>{a.canCloseDeals ? "Can Close" : "Standard"}</Badge>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
