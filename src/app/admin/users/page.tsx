"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { users } from "@/lib/mock-data";

export default function UsersPage() {
  const [tab, setTab] = useState("all");
  const [viewUser, setViewUser] = useState<(typeof users)[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = tab === "all" ? users : users.filter((u) => u.role === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></a>
          <div><h1 className="text-xl font-bold text-gray-900">Users</h1><p className="text-xs text-gray-500">Manage all platform users</p></div>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>+ Add User</Button>
      </div>

      <div className="flex gap-2">
        {["all","head","ambassador","agent"].map(r => <button key={r} onClick={() => setTab(r)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${tab===r?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>{r}</button>)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">User</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Role</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Wallet</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">{u.name.split(" ").map(n=>n[0]).join("")}</div><div><p className="font-medium text-gray-900 text-xs">{u.name}</p><p className="text-[10px] text-gray-400">{u.email}</p></div></div></td>
                  <td className="px-4 py-3"><Badge>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{u.city||"—"}</td>
                  <td className="px-4 py-3"><Badge variant={u.isApproved?"success":"warning"}>{u.isApproved?"Active":"Pending"}</Badge></td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{u.walletBalance.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => setViewUser(u)}>View</Button>
                      {u.role!=="head"&&<Button size="sm" variant={u.isApproved?"outline":"primary"}>{u.isApproved?"Suspend":"Approve"}</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {viewUser && <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewUser(null)}><div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">{viewUser.name}</h3><button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium">{viewUser.email}</p></div>
          <div><span className="text-gray-400 text-xs">Role</span><p className="font-medium capitalize">{viewUser.role}</p></div>
          <div><span className="text-gray-400 text-xs">City</span><p className="font-medium">{viewUser.city||"—"}</p></div>
          <div><span className="text-gray-400 text-xs">Status</span><Badge variant={viewUser.isApproved?"success":"warning"}>{viewUser.isApproved?"Approved":"Pending"}</Badge></div>
          <div><span className="text-gray-400 text-xs">Wallet</span><p className="font-medium">₦{viewUser.walletBalance.toLocaleString()}</p></div>
          <div><span className="text-gray-400 text-xs">Verified</span><p className="font-medium">{viewUser.isVerified?"Yes":"No"}</p></div>
          <div><span className="text-gray-400 text-xs">Can Create Tasks</span><p className="font-medium">{viewUser.canCreateTasks?"Yes":"No"}</p></div>
          <div><span className="text-gray-400 text-xs">Can Close Deals</span><p className="font-medium">{viewUser.canCloseDeals?"Yes":"No"}</p></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Transaction History</h4>
          <div className="text-xs text-gray-400">No transactions yet — wallet balance is from initial setup.</div>
        </div>
        <div className="mt-4 flex gap-2"><Button variant="outline" size="sm" className="flex-1">Edit Profile</Button><Button variant="danger" size="sm" className="flex-1">Suspend User</Button></div>
      </div></div>}

      {/* Add User Modal */}
      {showAdd && <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}><div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add New User</h3>
        <div className="space-y-3"><input placeholder="Full Name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><input type="email" placeholder="Email" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"><option>head</option><option>ambassador</option><option>agent</option></select><input type="password" placeholder="Password" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
        <div className="flex gap-2 mt-4"><Button className="flex-1" onClick={() => setShowAdd(false)}>Create User</Button><Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button></div>
      </div></div>}
    </div>
  );
}
