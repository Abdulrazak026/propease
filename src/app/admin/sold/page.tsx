"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";
import { formatNaira, resolveImageUrl } from "@/lib/utils";
import { usePermissions } from "@/lib/use-permissions";

interface SoldProperty {
  id: string;
  title: string;
  price: number;
  city: string;
  address: string;
  propertyType: string;
  soldDate: string;
  photo?: string;
}

export default function AdminSoldPage() {
  const perms = usePermissions();
  const [sold, setSold] = useState<SoldProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSold = () => {
    setLoading(true);
    api.get<{ items: SoldProperty[]; total: number }>("/api/sold-properties").then((r) => {
      if (r.data?.items) setSold(r.data.items);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchSold(); }, []);

  const deleteSold = async (id: string) => {
    if (!confirm("Delete this sold property?")) return;
    setDeleting(id);
    await api.delete(`/api/sold-properties/${id}`);
    fetchSold();
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
          <div><h1 className="text-xl font-bold text-gray-900">Sold Properties</h1><p className="text-xs text-gray-500">Manage the sold listings shown on /sold</p></div>
        </div>
        {perms.canCloseDeals && <Button size="sm" onClick={() => setShowAdd(true)}>+ Add Sold</Button>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Property</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">City</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Loading...</td></tr>
              ) : sold.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No sold properties yet</td></tr>
              ) : sold.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.photo ? (
                        <img src={resolveImageUrl(s.photo) || ""} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">🏠</div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-xs">{s.title}</p>
                        <p className="text-[10px] text-gray-400">{s.propertyType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.city}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">{formatNaira(s.price)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.soldDate ? new Date(s.soldDate).toLocaleDateString("en-GB") : "N/A"}</td>
                  <td className="px-4 py-3">
                    {perms.canCloseDeals && <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" disabled={deleting === s.id} onClick={() => deleteSold(s.id)}>
                      {deleting === s.id ? "..." : "Delete"}
                    </Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddSoldModal onClose={() => setShowAdd(false)} onSaved={fetchSold} />}
    </div>
  );
}

function AddSoldModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: "", city: "Kano", address: "", propertyType: "flat", soldDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.title) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    const r = await api.post("/api/sold-properties", {
      title: form.title,
      price: 0,
      city: form.city,
      address: form.address,
      propertyType: form.propertyType,
      soldDate: form.soldDate || new Date().toISOString(),
    });
    setSaving(false);
    if (r.status === 201 || r.status === 200) { onSaved(); onClose(); }
    else { setError("Failed to add"); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Sold Property</h3>
        <div className="space-y-3">
          <input placeholder="Property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <option value="flat">Flat</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>
          <input type="date" value={form.soldDate} onChange={(e) => setForm({ ...form, soldDate: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <div className="flex gap-2 mt-4">
          <Button className="flex-1" disabled={saving} onClick={handleSubmit}>{saving ? "Saving..." : "Add"}</Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
