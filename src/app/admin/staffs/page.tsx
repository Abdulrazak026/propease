"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";

interface ApiUser {
  id: string; name: string; email: string; role: string; city: string | null;
  walletBalance: number; isApproved: boolean; isVerified: boolean;
  canCreateTasks: boolean; canCloseDeals: boolean;
  canCreateListings?: boolean; canManageUsers?: boolean;
  canManageContent?: boolean; canViewAnalytics?: boolean; canManageAgreements?: boolean;
}

const PERMISSIONS = [
  { k: "canCreateTasks", l: "Create & Assign Tasks" },
  { k: "canCloseDeals", l: "Close Deals & Commissions" },
  { k: "canCreateListings", l: "Create & Publish Listings" },
  { k: "canManageUsers", l: "Manage Staff Accounts" },
  { k: "canManageContent", l: "Blog, FAQs & Media" },
  { k: "canViewAnalytics", l: "View Analytics & Audit" },
  { k: "canManageAgreements", l: "Create/Sign Agreements" },
];

type RoleTab = "heads" | "ambassadors" | "agents";

export default function StaffsPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [view, setView] = useState<RoleTab>("heads");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<string | null>(null);

  const fetchUsers = () => {
    api.get<{ users: ApiUser[] }>("/api/admin/users").then(r => {
      if (r.data?.users) setUsers(r.data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const heads = users.filter(u => u.role === "head");
  const ambassadors = users.filter(u => u.role === "ambassador");
  const agents = users.filter(u => u.role === "agent");
  const list = view === "heads" ? heads : view === "ambassadors" ? ambassadors : agents;

  const permTrue = (u: ApiUser) => PERMISSIONS.filter(p => !!(u as any)[p.k]).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Staff Management</h1><p className="text-xs text-gray-500">Manage all staff roles and permissions</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {([
          { key: "heads" as RoleTab, label: "Admins", count: heads.length },
          { key: "ambassadors" as RoleTab, label: "Ambassadors", count: ambassadors.length },
          { key: "agents" as RoleTab, label: "Agents", count: agents.length },
        ]).map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={`p-4 rounded-xl border text-left transition-all ${view === t.key ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
            <div className="text-2xl font-bold text-gray-900">{t.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left"><th className="px-4 py-3 text-xs font-medium text-gray-600">Name</th><th className="px-4 py-3 text-xs font-medium text-gray-600">City</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Permissions</th><th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {list.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">{user.name.split(" ").map(n => n[0]).join("")}</div><div><p className="font-medium text-gray-900 text-xs">{user.name}</p><p className="text-[10px] text-gray-400">{user.email}</p></div></div></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{user.city || "N/A"}</td>
                  <td className="px-4 py-3"><Badge variant={user.isApproved ? "success" : "warning"}>{user.isApproved ? "Active" : "Pending"}</Badge></td>
                  <td className="px-4 py-3"><span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{permTrue(user)}/{PERMISSIONS.length} active</span></td>
                  <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => setEditUser(user.id)}>Edit Permissions</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && <RolesModal userId={editUser} users={users} onClose={() => { setEditUser(null); fetchUsers(); }} />}
    </div>
  );
}

function RolesModal({ userId, users, onClose }: { userId: string; users: ApiUser[]; onClose: () => void }) {
  const u = users.find(x => x.id === userId)!;
  const [saving, setSaving] = useState(false);
  if (!u) return null;

  const update = async (data: Record<string, unknown>) => {
    setSaving(true);
    await api.patch(`/api/admin/users/${userId}`, data);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Manage: {u.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Role</label>
            <select defaultValue={u.role} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" onChange={async e => { await update({ role: e.target.value }); }}>
              <option value="head">Admin / Head</option>
              <option value="ambassador">Ambassador</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">Permissions</label>
            <div className="space-y-2">
              {PERMISSIONS.map(p => (
                <label key={p.k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={async () => { await update({ [p.k]: !(u as any)[p.k] }); }}>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${(u as any)[p.k] ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${(u as any)[p.k] ? "translate-x-5" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{p.l}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Status</label>
            <Button size="sm" variant={u.isApproved ? "outline" : "primary"} className="mt-1 w-full" onClick={async () => { await update({ isApproved: !u.isApproved }); }} disabled={saving}>
              {u.isApproved ? "Suspend Account" : "Approve Account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
