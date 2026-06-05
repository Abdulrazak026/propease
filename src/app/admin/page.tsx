"use client";
import { users, listings, tasks, commissions, platformStats, withdrawals } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";
import BarChart from "@/components/charts/BarChart";

const monthlyRevenue = [
 { label: "Apr", value: 2_400_000 },
 { label: "May", value: 9_700_000 },
 { label: "Jun", value: 8_500_000 },
];

const taskDist = [
 { label: "Open", value: tasks.filter((t) => t.status === "open").length, color: "#3b82f6" },
 { label: "In Prog", value: tasks.filter((t) => t.status === "in_progress").length, color: "#f59e0b" },
 { label: "Fulfilled", value: tasks.filter((t) => t.status === "fulfilled").length, color: "#10b981" },
];

const commissionBreakdown = [
 { label: "Company", value: commissions.reduce((s, c) => s + c.companyCut, 0), color: "#0d9488" },
 { label: "Ambassador", value: commissions.reduce((s, c) => s + c.ambassadorCut, 0), color: "#f59e0b" },
 { label: "Agent", value: commissions.reduce((s, c) => s + c.agentCut, 0), color: "#8b5cf6" },
];

export default function AdminOverview() {
 const totalRevenue = platformStats.totalRevenue;
 const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");
 const activeUsers = users.filter((u) => u.role !== "admin");

 const cards = [
 { label: "Total Users", value: activeUsers.length, sub: `${users.filter(u => u.role === "agent").length} agents`, accent: "bg-blue-100", color: "text-blue-600" },
 { label: "Active Listings", value: platformStats.availableListings, sub: `${listings.length} total`, accent: "bg-emerald-100", color: "text-emerald-600" },
 { label: "Open Tasks", value: platformStats.openTasks, sub: `${tasks.length} total tasks`, accent: "bg-amber-100", color: "text-amber-600" },
 { label: "Company Revenue", value: formatNaira(totalRevenue), sub: `${commissions.length} deals`, accent: "bg-violet-100", color: "text-violet-600" },
 ];

 const recentActivity = [
 { icon: "👤", text: "New user registered as agent", time: "2 hours ago" },
 { icon: "🏘️", text: "New listing posted in Tarauni", time: "5 hours ago" },
 { icon: "💰", text: "Commission paid — ₦120,000", time: "1 day ago" },
 { icon: "📌", text: "Task assigned — Land search in Tarauni", time: "1 day ago" },
 { icon: "💳", text: "Withdrawal request — ₦80,000", time: "2 days ago" },
 ];

 return (
 <div className="space-y-6-up">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
 <p className="text-sm text-gray-500 mt-0.5">Full platform control and oversight</p>
 </div>
 {pendingWithdrawals.length> 0 && (
 <Link href="/admin/audit" className="relative">
 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
 {pendingWithdrawals.length} pending withdrawal{pendingWithdrawals.length> 1 ? "s" : ""}
 </span>
 </Link>
 )}
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {cards.map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 card-hover">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 ${s.accent} rounded-lg flex items-center justify-center`}>
 <span className={`text-sm font-bold ${s.color}`}>{typeof s.value === "string" ? "₦" : s.value}</span>
 </div>
 <div>
 <p className="text-xs text-gray-500">{s.label}</p>
 <p className={`text-sm font-bold ${s.color} mt-0.5`}>{s.value}</p>
 <p className="text-[10px] text-gray-400">{s.sub}</p>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {[
 { label: "Successful Deals", value: listings.filter((l) => l.dealStatus === "successful" || l.status === "taken").length, color: "text-emerald-600", bg: "bg-emerald-100" },
 { label: "Unsuccessful", value: listings.filter((l) => l.dealStatus === "unsuccessful").length, color: "text-red-600", bg: "bg-red-100" },
 { label: "Ongoing Deals", value: listings.filter((l) => l.dealStatus === "ongoing" || l.status === "reserved").length, color: "text-blue-600", bg: "bg-blue-100" },
 { label: "Outsourced", value: listings.filter((l) => l.listingType === "outsourcing" || l.category === "partnership").length, color: "text-purple-600", bg: "bg-purple-100" },
 ].map((s) => (
 <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
 <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
 <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
 </div>
 <p className="text-xs text-gray-500">{s.label}</p>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
 <BarChart data={monthlyRevenue} height={180} format={(v) => `₦${(v / 1_000_000).toFixed(1)}M`} />
 </div>
 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Task Status</h2>
 <BarChart data={taskDist} height={180} format={(v) => `${v}`} />
 </div>
 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Commission Splits</h2>
 <BarChart data={commissionBreakdown} height={180} format={(v) => `₦${(v / 1_000_000).toFixed(1)}M`} />
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Overview</h2>
 <div className="grid grid-cols-2 gap-3">
 {[
 { label: "Cities", value: "4", detail: "Kano Municipal, Fagge, Tarauni, Nassarawa" },
 { label: "Ambassadors", value: users.filter((u) => u.role === "ambassador").length, detail: `${users.filter((u) => u.role === "agent").length} agents` },
 { label: "Partnerships", value: listings.filter((l) => l.category === "partnership").length, detail: "External companies" },
 { label: "Commissions Paid", value: formatNaira(platformStats.totalCommissionsPaid), detail: `${commissions.length} deals` },
 { label: "Reservations", value: "3", detail: "1 confirmed, 2 pending" },
 { label: "Request Service", value: "3", detail: "2 routed, 1 pending" },
 ].map((item) => (
 <div key={item.label} className="p-3 rounded-lg bg-gray-50/50 border border-gray-100">
 <p className="text-xs text-gray-500">{item.label}</p>
 <p className="text-sm font-bold text-[var(--color-primary)] mt-0.5">{item.value}</p>
 <p className="text-[10px] text-gray-400 mt-0.5">{item.detail}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
 <div className="space-y-1">
 {recentActivity.map((item, i) => (
 <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
 <span className="text-lg">{item.icon}</span>
 <div className="flex-1 min-w-0">
 <p className="text-sm text-gray-700">{item.text}</p>
 <p className="text-xs text-gray-400">{item.time}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
