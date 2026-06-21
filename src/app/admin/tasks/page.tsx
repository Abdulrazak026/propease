"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { usePermissions } from "@/lib/use-permissions";
import ShareOrderModal from "@/components/admin/ShareOrderModal";

interface AdminTask { id: string; title: string; description: string; propertyType: string; area: string; budget: number; deadline: string; status: string; createdAt: string; createdBy: { id: string; name: string }; assignedTo: { id: string; name: string }; }
interface Agent { id: string; name: string; email: string; role: string; isApproved: boolean; }
interface CustomOrder {
  id: string; clientName: string; clientContact: string; propertyType: string;
  area: string; budget: number; notes: string; status: string; createdAt: string;
  task?: { id: string; title: string; status: string } | null;
}

const statusStyles: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  submitted: "bg-purple-100 text-purple-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-800",
  routed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function AdminTasksPage() {
  const perms = usePermissions();
  const [tab, setTab] = useState<"tasks" | "orders">("tasks");
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ title: "", description: "", area: "Kano Municipal", propertyType: "flat", budget: "", deadline: "", assignedToId: "" });
  const [saving, setSaving] = useState(false);
  const [shareOrderId, setShareOrderId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get<{ tasks: AdminTask[] }>("/api/tasks/all"),
      api.get<{ orders: CustomOrder[] }>("/api/custom-orders"),
    ]).then(([taskR, orderR]) => {
      setTasks(taskR.data?.tasks || []);
      setOrders(orderR.data?.orders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const loadAgents = () => {
    api.get<{ users: Agent[] }>("/api/admin/users").then(r => {
      if (r.data?.users) setAgents(r.data.users.filter(u => ["agent", "ambassador"].includes(u.role) && u.isApproved));
    }).catch(() => {});
  };

  useEffect(() => { loadAgents(); }, []);

  const createTask = async () => {
    if (!form.title) return;
    setSaving(true);
    const res = await api.post<{ task: AdminTask }>("/api/tasks", {
      title: form.title,
      description: form.description,
      area: form.area,
      propertyType: form.propertyType,
      budget: form.budget ? Number(form.budget) : 0,
      deadline: form.deadline || undefined,
      assignedToId: form.assignedToId || undefined,
    });
    setSaving(false);
    if (res.error || (res.status >= 400)) {
      alert(res.data && (res.data as any).error ? (res.data as any).error : "Failed to create task");
      return;
    }
    setShowCreate(false);
    setForm({ title: "", description: "", area: "Kano Municipal", propertyType: "flat", budget: "", deadline: "", assignedToId: "" });
    load();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/api/custom-orders/${id}/status`, { status });
      load();
    } catch (e) {
      console.error("Failed to update order status:", e);
    }
  };

  const grouped = {
    open: tasks.filter(t => t.status === "open"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    submitted: tasks.filter(t => t.status === "submitted"),
    fulfilled: tasks.filter(t => t.status === "fulfilled"),
    closed: tasks.filter(t => t.status === "closed"),
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & Orders</h1>
          <p className="text-sm text-gray-500">Manage tasks and custom property requests</p>
        </div>
        <div className="flex items-center gap-2">
          {perms.canCreateTasks && <button onClick={() => setShowCreate(!showCreate)} className="text-xs font-semibold px-3.5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90">+ Create Task</button>}
          <Link href="/admin" className="text-xs font-semibold text-gray-600 hover:text-gray-900">← Back</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("tasks")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="tasks"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Tasks ({tasks.length})
        </button>
        <button onClick={() => setTab("orders")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="orders"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Custom Orders {orders.filter(o => o.status === "pending").length > 0 && <span className="ml-1 bg-amber-500 text-white text-[9px] px-1.5 rounded-full">{orders.filter(o => o.status === "pending").length}</span>}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Create New Task</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Task Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="e.g. Find 3-bed flat in Nassarawa" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assign To</label>
              <select value={form.assignedToId} onChange={e => setForm({ ...form, assignedToId: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option value="">Open — Any agent can take it</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Area</label>
              <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
              <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30">
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Budget (₦)</label>
              <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" placeholder="Task details..." />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
            <Button disabled={saving || !form.title} onClick={createTask}>{saving ? "Creating..." : "Create Task"}</Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { l: "Open", v: grouped.open.length, c: "text-amber-600" },
          { l: "Active", v: grouped.in_progress.length, c: "text-blue-600" },
          { l: "Submitted", v: grouped.submitted.length, c: "text-purple-600" },
          { l: "Done", v: grouped.fulfilled.length, c: "text-emerald-600" },
          { l: "Orders", v: orders.length, c: "text-orange-600" },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-3.5">
            <p className="text-xs text-gray-500">{s.l}</p>
            <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : tab === "tasks" ? (
        tasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">No tasks</p>
            <p className="text-xs text-gray-500">Ambassadors can create tasks from the ambassador dashboard.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">City</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Assignee</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Budget</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 50).map(t => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => window.location.href = `/admin/tasks/${t.id}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[var(--color-primary)] max-w-[280px] truncate hover:underline">{t.title}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{t.area}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{t.assignedTo?.name || "Unassigned"}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">₦{t.budget.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[t.status] || "bg-gray-100 text-gray-700"}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No custom orders yet</div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{o.clientName}</p>
                    <p className="text-xs text-gray-500">{o.clientContact}</p>
                  </div>
                  <Badge variant={o.status === "pending" ? "warning" : o.status === "completed" || o.status === "fulfilled" ? "success" : o.status === "cancelled" ? "default" : "default"}>{o.status}</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                  <div><span className="text-gray-400">Type</span><p className="font-medium text-gray-900 capitalize">{o.propertyType}</p></div>
                  <div><span className="text-gray-400">Area</span><p className="font-medium text-gray-900">{o.area}</p></div>
                  <div><span className="text-gray-400">Budget</span><p className="font-medium text-gray-900">₦{o.budget?.toLocaleString()}</p></div>
                  <div><span className="text-gray-400">Date</span><p className="font-medium text-gray-900">{new Date(o.createdAt).toLocaleDateString()}</p></div>
                </div>
                {o.notes && <p className="text-xs text-gray-600 mb-3">{o.notes}</p>}
                {o.task && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs mb-3">
                    <span className="text-gray-400">Task:</span> <span className="font-medium text-gray-900">{o.task.title}</span>
                    <span className="ml-2 text-[10px] text-gray-500">({o.task.status})</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {o.status !== "cancelled" && o.status !== "fulfilled" && (
                    <button onClick={() => setShareOrderId(o.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 transition-opacity">
                      {o.status === "routed" ? "Share Again" : "Share to Agents"}
                    </button>
                  )}
                  {o.status !== "cancelled" && o.status !== "fulfilled" && (
                    <button onClick={() => updateOrderStatus(o.id, "cancelled")} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Cancel
                    </button>
                  )}
                  {o.status === "cancelled" && (
                    <span className="text-xs font-medium text-gray-400 italic">Cancelled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {/* Share Order Modal */}
      {shareOrderId && (
        <ShareOrderModal
          orderId={shareOrderId}
          onClose={() => setShareOrderId(null)}
          onShared={load}
        />
      )}
    </div>
  );
}
