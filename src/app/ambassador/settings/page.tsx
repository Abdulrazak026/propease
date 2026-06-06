"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api-client";

export default function AmbassadorSettings() {
  const { currentUser } = useRole();
  const [displayName, setDisplayName] = useState(currentUser?.name || "");
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || "");
  const [notifyNewTasks, setNotifyNewTasks] = useState(true);
  const [notifyInquiries, setNotifyInquiries] = useState(true);
  const [notifyCommissions, setNotifyCommissions] = useState(true);
  const [taskAutoAssign, setTaskAutoAssign] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const saveProfile = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.patch("/api/agent/settings/me", { name: displayName, whatsapp });
      setMsg({ type: "success", text: "Profile saved" });
    } catch {
      setMsg({ type: "error", text: "Failed to save" });
    }
    setSaving(false);
    setTimeout(() => setMsg(null), 3000);
  };

  const saveNotifications = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.patch("/api/agent/settings/me/notifications", {
        notifyNewTasks, notifyInquiries, notifyCommissions, taskAutoAssign,
      });
      setMsg({ type: "success", text: "Preferences saved" });
    } catch {
      setMsg({ type: "error", text: "Failed to save" });
    }
    setSaving(false);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/ambassador" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">City profile and notification preferences</p>
        </div>
      </div>

      {msg && <div className={`px-4 py-2 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg.text}</div>}

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">City Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <input value={currentUser?.city || ""} readOnly className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
            <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+234 XXX XXX XXXX" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
        </div>
        <Button className="mt-4" onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-3">
          {[
            { label: "New Tasks Created", state: notifyNewTasks, set: setNotifyNewTasks },
            { label: "Inquiries on Your Listings", state: notifyInquiries, set: setNotifyInquiries },
            { label: "Commission Payouts", state: notifyCommissions, set: setNotifyCommissions },
            { label: "Auto-Assign Tasks to Agents", state: taskAutoAssign, set: setTaskAutoAssign },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/50 border border-gray-100">
              <p className="text-sm text-gray-700">{item.label}</p>
              <button onClick={() => item.set(!item.state)} className={`relative w-11 h-6 rounded-full transition-colors ${item.state ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.state ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={saveNotifications} disabled={saving}>{saving ? "Saving..." : "Save Preferences"}</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-3">
          {[
            { label: "Email", value: currentUser?.email || "" },
            { label: "Role", value: "Ambassador" },
            { label: "Wallet Balance", value: `\u20A6${(currentUser?.walletBalance || 0).toLocaleString()}` },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 px-3">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
