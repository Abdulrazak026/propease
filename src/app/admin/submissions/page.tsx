"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface AgentApp { id: string; name: string; email: string; city: string | null; whatsapp: string | null; createdAt: string; }
interface ContactSub { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; read: boolean; createdAt: string; }

export default function SubmissionsPage() {
  const [tab, setTab] = useState<"agents" | "contacts">("agents");
  const [agents, setAgents] = useState<AgentApp[]>([]);
  const [contacts, setContacts] = useState<ContactSub[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></a>
        <div><h1 className="text-xl font-bold text-gray-900">Submissions</h1><p className="text-xs text-gray-500">Agent applications, contact messages, and property inquiries</p></div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTab("agents")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="agents"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Agent Applications ({agents.length})
        </button>
        <button onClick={() => setTab("contacts")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="contacts"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Contact Messages {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 rounded-full">{unreadCount}</span>}
        </button>
        <button onClick={() => setTab("inquiries")} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${tab==="inquiries"?"bg-[var(--color-primary)] text-white border-[var(--color-primary)]":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          Property Inquiries {newInquiries > 0 && <span className="ml-1 bg-emerald-500 text-white text-[9px] px-1.5 rounded-full">{newInquiries}</span>}
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
                  <th className="px-4 py-3 text-xs font-medium text-gray-600">WhatsApp</th>
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
      ) : tab === "contacts" ? (
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Inquiry List */}
          <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${selectedInquiry ? "hidden lg:block" : ""}`}>
            {inquiries.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">No property inquiries yet</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {inquiries.map(i => (
                  <button key={i.id} onClick={() => openInquiry(i)} className={`w-full text-left px-4 py-3 hover:bg-gray-50/50 transition-colors ${selectedInquiry?.id === i.id ? "bg-emerald-50/50 border-l-2 border-emerald-500" : ""} ${i.status === "new" ? "bg-emerald-50/30" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">{i.clientName}</span>
                      <Badge variant={i.status === "new" ? "warning" : i.status === "responded" ? "success" : "default"}>{i.status}</Badge>
                    </div>
                    {i.listing && <p className="text-[10px] text-gray-500 mb-1 truncate">Re: {i.listing.title}</p>}
                    {i.assignedAgent && <p className="text-[10px] text-emerald-600 mb-1">Agent: {i.assignedAgent.name}</p>}
                    <p className="text-xs text-gray-600 line-clamp-1">{i.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(i.createdAt).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Detail */}
          {selectedInquiry && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px]">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelectedInquiry(null); setInquiryConversation(null); }} className="lg:hidden text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-sm font-semibold text-gray-900">{selectedInquiry.clientName}</h3>
                    <Badge variant={selectedInquiry.status === "new" ? "warning" : selectedInquiry.status === "responded" ? "success" : "default"}>{selectedInquiry.status}</Badge>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {selectedInquiry.listing ? `Re: ${selectedInquiry.listing.title}` : "General inquiry"}
                    {selectedInquiry.assignedAgent ? ` · Agent: ${selectedInquiry.assignedAgent.name}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  {selectedInquiry.status === "new" && <Button size="sm" variant="ghost" onClick={() => updateInquiryStatus(selectedInquiry.id, "read")}>Mark Read</Button>}
                  {selectedInquiry.status !== "responded" && <Button size="sm" variant="primary" onClick={() => updateInquiryStatus(selectedInquiry.id, "responded")}>Mark Responded</Button>}
                </div>
              </div>

              {/* Chat messages */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {loadingConversation ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : inquiryConversation?.messages?.length ? (
                  inquiryConversation.messages.map(msg => {
                    const senderName = msg.sender?.name || "Unknown";
                    const isCustomer = msg.senderId !== selectedInquiry.assignedAgent?.id;
                    return (
                      <div key={msg.id} className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
                        <div className="max-w-[80%]">
                          <p className="text-[10px] text-gray-400 mb-0.5 px-1">{senderName}</p>
                          <div className={`px-3 py-2 rounded-xl text-sm ${isCustomer ? "bg-white border border-gray-200 text-gray-900 rounded-bl-sm" : "bg-[var(--color-primary)] text-white rounded-br-sm"}`}>
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 px-1">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-sm text-gray-500 mb-2">No conversation found</p>
                    <p className="text-xs text-gray-400">{selectedInquiry.clientContact ? `Contact: ${selectedInquiry.clientContact}` : "No contact info"}</p>
                    <p className="text-xs text-gray-400 mt-1">{selectedInquiry.message}</p>
                  </div>
                )}
              </div>

              {/* Reply input */}
              <div className="shrink-0 border-t border-gray-100 p-3 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a reply..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const msg = input.value.trim();
                        if (!msg || !selectedInquiry) return;
                        input.value = "";
                        await api.post(`/api/inquiries/${selectedInquiry.id}/reply`, { message: msg });
                        const r = await api.get<any>(`/api/inquiries/${selectedInquiry.id}/conversation`);
                        if (r.data?.conversation) setInquiryConversation(r.data.conversation);
                        setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, status: "responded" } : i));
                      }
                    }}
                  />
                  <button
                    onClick={async (e) => {
                      const input = (e.currentTarget as HTMLElement).parentElement?.querySelector("input") as HTMLInputElement;
                      const msg = input?.value.trim();
                      if (!msg || !selectedInquiry) return;
                      input.value = "";
                      await api.post(`/api/inquiries/${selectedInquiry.id}/reply`, { message: msg });
                      const r = await api.get<any>(`/api/inquiries/${selectedInquiry.id}/conversation`);
                      if (r.data?.conversation) setInquiryConversation(r.data.conversation);
                      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, status: "responded" } : i));
                    }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
