"use client";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { api } from "@/lib/api-client";

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useRole();
  const [name, setName] = useState(currentUser?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setMsg(null);
    if (!name.trim()) { setMsg({ type: "error", text: "Name is required" }); return; }
    if (newPassword && newPassword !== confirmPassword) { setMsg({ type: "error", text: "Passwords do not match" }); return; }
    if (newPassword && newPassword.length < 8) { setMsg({ type: "error", text: "Password must be at least 8 characters" }); return; }
    setSaving(true);
    try {
      const body: any = { name: name.trim() };
      if (newPassword) { body.currentPassword = currentPassword; body.newPassword = newPassword; }
      const { data, error } = await api.put<{ user: any; message: string }>("/api/auth/profile", body);
      if (data?.user) {
        setCurrentUser({ ...currentUser!, ...data.user });
        setMsg({ type: "success", text: data.message || "Profile updated" });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setMsg({ type: "error", text: error || "Failed to update" });
      }
    } catch { setMsg({ type: "error", text: "Network error" }); }
    setSaving(false);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input value={currentUser.email} disabled className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        </div>
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Password</h3>
          <div className="space-y-3">
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 8 chars)" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
          </div>
        </div>
        {msg && (
          <div className={`text-sm px-3 py-2 rounded-lg ${msg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{msg.text}</div>
        )}
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
