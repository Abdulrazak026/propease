"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import ShareOrderModal from "@/components/admin/ShareOrderModal";

interface CustomOrder {
  id: string; clientName: string; clientContact: string; propertyType: string;
  area: string; budget: number; notes: string; status: string; createdAt: string;
  task?: { id: string; title: string; status: string } | null;
}

type Tab = "all" | "pending" | "routed" | "completed" | "cancelled";

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [shareOrderId, setShareOrderId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    api.get<{ orders: CustomOrder[] }>("/api/custom-orders").then(r => {
      if (r.data?.orders) setOrders(r.data.orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    routed: orders.filter(o => o.status === "routed").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const cancelOrder = async (id: string) => {
    await api.patch(`/api/custom-orders/${id}/status`, { status: "cancelled" });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
          <div><h1 className="text-xl font-bold text-gray-900">Custom Orders</h1><p className="text-xs text-gray-500">Guest property requests</p></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Open</p><p className="text-2xl font-bold text-gray-900 mt-1">{counts.pending}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">In Progress</p><p className="text-2xl font-bold text-gray-900 mt-1">{counts.routed}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Completed</p><p className="text-2xl font-bold text-gray-900 mt-1">{counts.completed}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500">Cancelled</p><p className="text-2xl font-bold text-gray-900 mt-1">{counts.cancelled}</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
        {[["all", "All"], ["pending", "Open"], ["routed", "In Progress"], ["completed", "Completed"], ["cancelled", "Cancelled"]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v as Tab)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{l}</button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No {tab === "all" ? "" : tab} orders</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{o.clientName}</p>
                  <p className="text-xs text-gray-500">{o.clientContact}</p>
                </div>
                <Badge variant={o.status === "pending" ? "warning" : o.status === "routed" ? "info" : o.status === "completed" ? "success" : "default"}>{o.status}</Badge>
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
                  <span className="text-gray-400">Assigned Task:</span> <span className="font-medium text-gray-900">{o.task.title}</span>
                  <span className="ml-2 text-[10px] text-gray-500">({o.task.status})</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShareOrderId(o.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 transition-opacity">
                  Share to Agents
                </button>
                <button onClick={() => cancelOrder(o.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareOrderId && (
        <ShareOrderModal
          orderId={shareOrderId}
          onClose={() => setShareOrderId(null)}
          onShared={fetchOrders}
        />
      )}
    </div>
  );
}
