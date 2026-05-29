"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AmbassadorSettings() {
  const { currentUser } = useRole();
  const [notifyNewTasks, setNotifyNewTasks] = useState(true);
  const [notifyInquiries, setNotifyInquiries] = useState(true);
  const [notifyCommissions, setNotifyCommissions] = useState(true);
  const [taskAutoAssign, setTaskAutoAssign] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">City profile and notification preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">City Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <input value={currentUser?.city || ""} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
            <input defaultValue={currentUser?.name || ""} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">City Description</label>
            <textarea defaultValue={`Manage real estate listings for ${currentUser?.city || "your city"}.`} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none" />
          </div>
        </div>
        <Button className="mt-4" onClick={() => alert("Profile updated (Demo)")}>Save Profile</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-3">
          {[
            { label: "New Tasks Created", key: "tasks", state: notifyNewTasks, set: setNotifyNewTasks },
            { label: "Inquiries on Your Listings", key: "inquiries", state: notifyInquiries, set: setNotifyInquiries },
            { label: "Commission Payouts", key: "commissions", state: notifyCommissions, set: setNotifyCommissions },
            { label: "Auto-Assign Tasks to Agents", key: "auto", state: taskAutoAssign, set: setTaskAutoAssign },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <p className="text-sm text-gray-700">{item.label}</p>
              <button
                onClick={() => item.set(!item.state)}
                className={`relative w-11 h-6 rounded-full transition-colors ${item.state ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.state ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => alert("Notification settings saved (Demo)")}>Save Preferences</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-3">
          {[
            { label: "Email", value: currentUser?.email || "" },
            { label: "Role", value: "Ambassador" },
            { label: "Wallet Balance", value: `₦${(currentUser?.walletBalance || 0).toLocaleString()}` },
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
