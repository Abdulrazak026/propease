"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";

interface Staff {
  id: string; name: string; role: string;
}

interface ShareOrderModalProps {
  orderId: string;
  onClose: () => void;
  onShared: () => void;
}

export default function ShareOrderModal({ orderId, onClose, onShared }: ShareOrderModalProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ users: Staff[] }>("/api/admin/users").then(r => {
      if (r.data?.users) {
        setStaff(r.data.users.filter(u => u.role === "agent" || u.role === "ambassador" || u.role === "head"));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleStaff = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const selectAll = () => setSelected(staff.map(s => s.id));

  const handleShare = async () => {
    if (selected.length === 0) return;
    setSharing(true);
    await api.post(`/api/custom-orders/${orderId}/share`, { staffIds: selected });
    setSharing(false);
    onShared();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Share Order</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Select agents to assign this order to. A task will be created for each selected agent.</p>
        </div>

        <div className="p-5 max-h-60 overflow-y-auto space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8"><div className="h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
          ) : staff.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No agents or ambassadors available</p>
          ) : (
            <>
              <button onClick={selectAll} className="text-xs text-[var(--color-primary)] hover:underline mb-2">Select all</button>
              {staff.map(s => (
                <button key={s.id} onClick={() => toggleStaff(s.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${selected.includes(s.id) ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selected.includes(s.id) ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-gray-300"}`}>
                    {selected.includes(s.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{s.role}</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">{selected.length} selected</p>
          <button onClick={handleShare} disabled={selected.length === 0 || sharing} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity">
            {sharing ? "Sharing..." : "Share Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
