"use client";
import { useState } from "react";
import { users } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatNaira } from "@/lib/utils";

const roleColors: Record<string, string> = {
 admin: "bg-purple-100 text-purple-800",
 head: "bg-blue-100 text-blue-800",
 ambassador: "bg-amber-100 text-amber-800",
 agent: "bg-emerald-100 text-emerald-800",
};

export default function AdminUsers() {
 const [showCreate, setShowCreate] = useState(false);
 const [localUsers, setLocalUsers] = useState(users);
 const [verifFilter, setVerifFilter] = useState<"all" | "verified" | "unverified">("all");

 const grouped = {
 admin: localUsers.filter((u) => u.role === "admin" && (verifFilter === "all" || (verifFilter === "verified" ? u.isVerified : !u.isVerified))),
 head: localUsers.filter((u) => u.role === "head" && (verifFilter === "all" || (verifFilter === "verified" ? u.isVerified : !u.isVerified))),
 ambassador: localUsers.filter((u) => u.role === "ambassador" && (verifFilter === "all" || (verifFilter === "verified" ? u.isVerified : !u.isVerified))),
 agent: localUsers.filter((u) => u.role === "agent" && (verifFilter === "all" || (verifFilter === "verified" ? u.isVerified : !u.isVerified))),
 };

 const toggleVerify = (userId: string) => {
 setLocalUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
 };

 const totalVerified = localUsers.filter((u) => u.isVerified).length;
 const totalUnverified = localUsers.filter((u) => !u.isVerified).length;

 return (
 <div className="space-y-6-up">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
 </a>
 <div>
 <h1 className="text-xl font-bold text-gray-900">All Users</h1>
 <p className="text-sm text-gray-500 mt-0.5">Manage all accounts across the platform</p>
 </div>
 </div>
 <Button onClick={() => setShowCreate(!showCreate)}>
 {showCreate ? "Cancel" : "+ Add User"}
 </Button>
 </div>

 <div className="grid grid-cols-3 gap-3">
 <button onClick={() => setVerifFilter("all")} className={`bg-white rounded-lg border p-4 text-left transition-all ${
 verifFilter === "all" ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]" : "border-gray-200"
 }`}>
 <p className="text-xs text-gray-500">Total Users</p>
 <p className="text-lg font-bold text-gray-900 mt-0.5">{localUsers.length}</p>
 </button>
 <button onClick={() => setVerifFilter("verified")} className={`bg-white rounded-lg border p-4 text-left transition-all ${
 verifFilter === "verified" ? "border-emerald-400 ring-1 ring-emerald-400" : "border-gray-200"
 }`}>
 <p className="text-xs text-gray-500">Verified</p>
 <p className="text-lg font-bold text-emerald-600 mt-0.5">{totalVerified}</p>
 </button>
 <button onClick={() => setVerifFilter("unverified")} className={`bg-white rounded-lg border p-4 text-left transition-all ${
 verifFilter === "unverified" ? "border-amber-400 ring-1 ring-amber-400" : "border-gray-200"
 }`}>
 <p className="text-xs text-gray-500">Unverified</p>
 <p className="text-lg font-bold text-amber-600 mt-0.5">{totalUnverified}</p>
 </button>
 </div>

 {showCreate && (
 <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4-up">
 <h2 className="text-sm font-semibold text-gray-900">Create New User</h2>
 <div className="grid grid-cols-2 gap-4">
 <div className="col-span-2 sm:col-span-1">
 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
 <input className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="Full name" />
 </div>
 <div className="col-span-2 sm:col-span-1">
 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
 <input className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" placeholder="email@mbpp.ng" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
 <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
 <option>Admin</option><option>Head</option><option>Ambassador</option><option>Agent</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
 <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]">
 <option>Kano Municipal</option><option>Fagge</option><option>Tarauni</option><option>Nassarawa</option>
 </select>
 </div>
 </div>
 <Button className="w-full" onClick={() => { alert("User created! (Demo)"); setShowCreate(false); }}>Create User</Button>
 </div>
 )}

 {(["admin", "head", "ambassador", "agent"] as const).map((role) => (
 <div key={role}>
 <h2 className="text-sm font-semibold text-gray-900 capitalize mb-3">{role}s ({grouped[role].length})</h2>
 <div className="bg-white rounded-lg border border-gray-200">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/50">
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
 <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
 </tr>
 </thead>
 <tbody>
 {grouped[role].map((u) => (
 <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
 <td className="px-4 py-3.5">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
 {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">{u.name}</p>
 <Badge variant={role === "admin" ? "info" : "default"} className={roleColors[role]}>{role}</Badge>
 </div>
 </div>
 </td>
 <td className="px-4 py-3.5 text-xs text-gray-500">{u.email}</td>
 <td className="px-4 py-3.5 text-xs text-gray-500">{u.city}</td>
 <td className="px-4 py-3.5 text-xs font-medium text-gray-900">{formatNaira(u.walletBalance)}</td>
 <td className="px-4 py-3.5">
 <button
 onClick={() => toggleVerify(u.id)}
 className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
 u.isVerified
 ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
 : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
 }`}
>
 {u.isVerified ? (
 <>
 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
 Verified
 </>
 ) : (
 <>Click to Verify</>
 )}
 </button>
 </td>
 <td className="px-4 py-3.5">
 <div className="flex gap-1">
 {u.canCreateTasks && <Badge variant="info">Can Create Tasks</Badge>}
 {u.canCloseDeals && <Badge variant="success">Can Close Deals</Badge>}
 {(role === "admin" || role === "head") && <Badge variant="default">Full Access</Badge>}
 {!u.canCreateTasks && !u.canCloseDeals && role === "agent" && <span className="text-xs text-gray-400">Standard</span>}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 ))}
 </div>
 );
}
