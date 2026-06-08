"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface AgentApp {
  id: string; name: string; email: string; city: string | null; whatsapp: string | null; createdAt: string;
  phone?: string; experience?: string; whyAgent?: string; heardAbout?: string;
}
interface ContactSub { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; read: boolean; createdAt: string; }
interface Inquiry { id: string; clientName: string; clientContact: string; message: string; status: string; createdAt: string; listing?: { id: string; title: string } | null; assignedAgent?: { id: string; name: string } | null; }
interface Conversation { id: string; messages: { id: string; content: string; senderId: string; sender?: { name: string }; createdAt: string }[]; participants: { user: { id: string; name: string } }[]; }

export default function SubmissionsPage() {
  const [tab, setTab] = useState<"agents" | "contacts">("agents");
  const [agents, setAgents] = useState<AgentApp[]>([]);
  const [contacts, setContacts] = useState<ContactSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAgent, setViewAgent] = useState<AgentApp | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSub | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    api.get<{ agentApplications: AgentApp[]; contactSubmissions: ContactSub[] }>("/api/admin/submissions").then(r => {
      if (r.data?.agentApplications) setAgents(r.data.agentApplications);
      if (r.data?.contactSubmissions) setContacts(r.data.contactSubmissions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const approveAgent = async (id: string) => {
    await api.patch(`/api/admin/users/${id}`, { isApproved: true, suspendedAt: null });
    setAgents(prev => prev.filter(a => a.id !== id));
    setViewAgent(null);
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/api/admin/submissions/agent/${id}`);
    setAgents(prev => prev.filter(a => a.id !== id));
    setViewAgent(null);
  };

  const markRead = async (id: string) => {
    await api.patch(`/api/admin/submissions/contact/${id}/read`);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await api.delete(`/api/admin/submissions/contact/${id}`);
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  const sendReply = async (contact: ContactSub) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const { status } = await api.post("/api/contact/reply", { contactId: contact.id, email: contact.email, name: contact.name, message: replyText });
      if (status === 200 || status === 201) {
        setReplyText("");
        setSelectedContact(null);
      }
    } catch {}
    setSendingReply(false);
  };

  const unreadCount = contacts.filter(c => !c.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Submissions</h1><p className="text-xs text-gray-500">Agent applications and contact form messages</p></div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("agents")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="agents"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Agent Applications ({agents.length})
        </button>
        <button onClick={() => setTab("contacts")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="contacts"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Contact Messages {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 rounded-full">{unreadCount}</span>}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
      ) : tab === "agents" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {agents.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">No pending agent applications</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">City</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Applied</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">Actions</th>
                </tr></thead>
                <tbody>
                  {agents.map(a => (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">{a.name.split(" ").map(n=>n[0]).join("")}</div><span className="text-xs font-medium text-gray-900">{a.name}</span></div></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{a.email}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{a.city || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="ghost" onClick={() => setViewAgent(a)}>View</Button>
                          <Button size="sm" variant="primary" onClick={() => approveAgent(a.id)}>Approve</Button>
                          <Button size="sm" variant="danger" onClick={() => deleteAgent(a.id)}>Reject</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Contact list */}
          <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${selectedContact ? "hidden lg:block" : ""}`}>
            {contacts.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">No contact messages yet</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {contacts.map(c => (
                  <button key={c.id} onClick={() => { setSelectedContact(c); if (!c.read) markRead(c.id); }} className={`w-full text-left px-4 py-3 hover:bg-gray-50/50 transition-colors ${selectedContact?.id === c.id ? "bg-blue-50/50 border-l-2 border-blue-500" : ""} ${!c.read ? "bg-blue-50/30" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">{c.name}</span>
                      {!c.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mb-0.5">{c.email}</p>
                    <p className="text-xs text-gray-700 font-medium mb-0.5">{c.subject || "General Inquiry"}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{c.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact detail + reply */}
          {selectedContact && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px]">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedContact(null)} className="lg:hidden text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-[10px] text-gray-500">{selectedContact.email} · {selectedContact.phone || "No phone"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="danger" onClick={() => deleteContact(selectedContact.id)}>Delete</Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-400 mb-2">Subject: <span className="font-medium text-gray-700">{selectedContact.subject || "General Inquiry"}</span></p>
                  <p className="text-xs text-gray-400 mb-3">Received: <span className="text-gray-600">{new Date(selectedContact.createdAt).toLocaleString()}</span></p>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-gray-100 p-3 bg-white">
                <p className="text-[10px] text-gray-400 mb-2">Reply to {selectedContact.name}</p>
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  <Button onClick={() => sendReply(selectedContact)} disabled={!replyText.trim() || sendingReply} className="self-end">
                    {sendingReply ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agent Application Detail Modal */}
      {viewAgent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewAgent(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Agent Application</h3>
              <button onClick={() => setViewAgent(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-lg font-bold text-[var(--color-primary)]">
                  {viewAgent.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{viewAgent.name}</p>
                  <p className="text-xs text-gray-500">Applied {new Date(viewAgent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="font-medium text-gray-900">{viewAgent.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <p className="font-medium text-gray-900">{viewAgent.phone || viewAgent.whatsapp || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">City</p>
                  <p className="font-medium text-gray-900">{viewAgent.city || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Experience</p>
                  <p className="font-medium text-gray-900">{viewAgent.experience || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Heard About</p>
                  <p className="font-medium text-gray-900">{viewAgent.heardAbout || "—"}</p>
                </div>
              </div>
              {viewAgent.whyAgent && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Why they want to join</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{viewAgent.whyAgent}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { approveAgent(viewAgent.id); }}>Approve</Button>
                <Button variant="danger" className="flex-1" onClick={() => { deleteAgent(viewAgent.id); }}>Reject</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
