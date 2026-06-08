"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface AgentApp { id: string; name: string; email: string; city: string | null; whatsapp: string | null; createdAt: string; }
interface ContactSub { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; read: boolean; createdAt: string; }
interface Inquiry { id: string; clientName: string; clientContact: string; message: string; status: string; createdAt: string; listing?: { id: string; title: string } | null; assignedAgent?: { id: string; name: string } | null; }
interface Conversation { id: string; messages: { id: string; content: string; senderId: string; sender?: { name: string }; createdAt: string }[]; participants: { user: { id: string; name: string } }[]; }

export default function SubmissionsPage() {
  const [tab, setTab] = useState<"agents" | "contacts">("agents");
  const [agents, setAgents] = useState<AgentApp[]>([]);
  const [contacts, setContacts] = useState<ContactSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryConversation, setInquiryConversation] = useState<Conversation | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<{ agentApplications: AgentApp[]; contactSubmissions: ContactSub[] }>("/api/admin/submissions").then(r => {
      if (r.data?.agentApplications) setAgents(r.data.agentApplications);
      if (r.data?.contactSubmissions) setContacts(r.data.contactSubmissions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [inquiryConversation?.messages?.length]);

  const openInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setLoadingConversation(true);
    setInquiryConversation(null);
    try {
      const r = await api.get<{ inquiry: Inquiry; conversation: Conversation | null }>(`/api/inquiries/${inquiry.id}/conversation`);
      if (r.data?.conversation) setInquiryConversation(r.data.conversation);
    } catch {}
    setLoadingConversation(false);
  };

  const approveAgent = async (id: string) => {
    await api.patch(`/api/admin/users/${id}`, { isApproved: true, suspendedAt: null });
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/api/admin/submissions/agent/${id}`);
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const markRead = async (id: string) => {
    await api.patch(`/api/admin/submissions/contact/${id}/read`);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await api.delete(`/api/admin/submissions/contact/${id}`);
    setContacts(prev => prev.filter(c => c.id !== id));
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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {contacts.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">No contact messages yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map(c => (
                <div key={c.id} className={`px-4 py-3 hover:bg-gray-50/50 ${!c.read ? "bg-blue-50/30" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900">{c.name}</span>
                        <span className="text-[10px] text-gray-400">{c.email}</span>
                        {!c.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      <p className="text-xs font-medium text-gray-700 mb-0.5">{c.subject || "General Inquiry"}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{c.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!c.read && <Button size="sm" variant="ghost" onClick={() => markRead(c.id)}>Mark Read</Button>}
                      <Button size="sm" variant="danger" onClick={() => deleteContact(c.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
