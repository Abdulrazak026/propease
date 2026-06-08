"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface CustomOrder {
  id: string; clientName: string; clientContact: string; propertyType: string;
  area: string; budget: number; notes: string; status: string; createdAt: string;
  task?: { id: string; title: string; status: string } | null;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  routed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ orders: CustomOrder[] }>("/api/custom-orders").then(r => {
      if (r.data?.orders) setOrders(r.data.orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/api/custom-orders/${id}/status`, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Custom Orders</h1><p className="text-xs text-gray-500">Guest property requests</p></div>
      </div>

      {orders.length === 0 ? (
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
                <Badge variant={o.status === "pending" ? "warning" : o.status === "completed" ? "success" : "default"}>{o.status}</Badge>
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
                <Button size="sm" variant="ghost" onClick={() => updateStatus(o.id, "completed")}>Mark Complete</Button>
                <Button size="sm" variant="danger" onClick={() => updateStatus(o.id, "cancelled")}>Cancel</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
