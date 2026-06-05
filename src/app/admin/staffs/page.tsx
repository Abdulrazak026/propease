"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { users } from "@/lib/mock-data";

export default function StaffsPage() {
  const [view, setView] = useState<"ambassadors"|"agents">("ambassadors");
  const [editUser, setEditUser] = useState<string|null>(null);
  const [viewUser, setViewUser] = useState<(typeof users)[0]|null>(null);
  const ambassadors = users.filter(u => u.role === "ambassador");
  const agents = users.filter(u => u.role === "agent");
  const list = view === "ambassadors" ? ambassadors : agents;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Staff Management</h1><p className="text-xs text-gray-500">Manage ambassadors, agents, and permissions</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={()=>setView("ambassadors")} className={`p-4 rounded-xl border text-left transition-all ${view==="ambassadors"?"border-[var(--color-primary)] bg-[var(--color-primary)]/5":"border-gray-200 bg-white hover:border-gray-300"}`}><div className="text-2xl font-bold text-gray-900">{ambassadors.length}</div><div className="text-xs text-gray-500 mt-0.5">Ambassadors</div></button>
        <button onClick={()=>setView("agents")} className={`p-4 rounded-xl border text-left transition-all ${view==="agents"?"border-[var(--color-primary)] bg-[var(--color-primary)]/5":"border-gray-200 bg-white hover:border-gray-300"}`}><div className="text-2xl font-bold text-gray-900">{agents.length}</div><div className="text-xs text-gray-500 mt-0.5">Agents</div></button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Name</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Permissions</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {list.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">{user.name.split(" ").map(n=>n[0]).join("")}</div><div><p className="font-medium text-gray-900 text-xs">{user.name}</p><p className="text-[10px] text-gray-400">{user.email}</p></div></div></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{user.city}</td>
                  <td className="px-4 py-3"><Badge variant={user.isApproved?"success":"warning"}>{user.isApproved?"Active":"Pending"}</Badge></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{user.canCreateTasks&&<span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Create Tasks</span>}{user.canCloseDeals&&<span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Close Deals</span>}{!user.canCreateTasks&&!user.canCloseDeals&&<span className="text-[10px] text-gray-400">—</span>}</div></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>setViewUser(user)}>View</Button><Button size="sm" variant="outline" onClick={()=>setEditUser(user.id)}>Roles</Button></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {viewUser && <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={()=>setViewUser(null)}><div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">{viewUser.name}</h3><button onClick={()=>setViewUser(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium">{viewUser.email}</p></div>
          <div><span className="text-gray-400 text-xs">Role</span><p className="font-medium capitalize">{viewUser.role}</p></div>
          <div><span className="text-gray-400 text-xs">City</span><p className="font-medium">{viewUser.city||"—"}</p></div>
          <div><span className="text-gray-400 text-xs">Wallet</span><p className="font-medium">₦{viewUser.walletBalance.toLocaleString()}</p></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100"><h4 className="text-xs font-semibold text-gray-700 mb-2">Transaction History</h4><div className="text-xs text-gray-400">No transactions recorded yet.</div></div>
        <div className="mt-4 flex gap-2"><Button variant="outline" size="sm" className="flex-1" onClick={()=>{setViewUser(null);setEditUser(viewUser.id)}}>Manage Roles</Button><Button variant="danger" size="sm" className="flex-1">Suspend</Button></div>
      </div></div>}

      {/* Roles/Permissions Modal */}
      {editUser && (
        <RolesModal userId={editUser} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
}

function RolesModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const u = users.find(x => x.id === userId)!;
  if (!u) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Manage Roles — {u.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Role</label>
            <select defaultValue={u.role} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value="ambassador">Ambassador</option><option value="agent">Agent</option><option value="head">Head (Admin)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">Permissions</label>
            <div className="space-y-2">
              {[
                {k:"canCreateTasks",l:"Create & Assign Tasks",d:"Create outsourcing tasks and assign to agents"},
                {k:"canCloseDeals",l:"Close Deals",d:"Mark deals as completed and trigger commissions"},
                {k:"canViewReports",l:"View Reports",d:"Access analytics and performance reports"},
                {k:"canManageListings",l:"Manage Listings",d:"Create, edit, and remove property listings"},
                {k:"canApproveUsers",l:"Approve Users",d:"Approve or reject new user registrations"},
                {k:"canWithdrawFunds",l:"Withdraw Funds",d:"Request withdrawals from wallet balance"},
                {k:"canSendNotifications",l:"Send Notifications",d:"Broadcast notifications to users"},
                {k:"canExportData",l:"Export Data",d:"Download reports, agreements, and user data"},
              ].map(p => (
                <label key={p.k} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked={false} className="mt-0.5 rounded" />
                  <div><p className="text-sm font-medium text-gray-900">{p.l}</p><p className="text-[10px] text-gray-400">{p.d}</p></div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Commission Rate (%)</label>
            <input type="number" defaultValue="5" className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Assigned Cities</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Kano Municipal","Fagge","Tarauni","Nassarawa"].map(c => (
                <label key={c} className="flex items-center gap-1 text-xs"><input type="checkbox" defaultChecked className="rounded" />{c}</label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2"><Button className="flex-1" onClick={onClose}>Save Permissions</Button><Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button></div>
      </div>
    </div>
  );
}
