"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AdminCRM() {
 const [leadRouting, setLeadRouting] = useState("auto");
 const [inquiryResponse, setInquiryResponse] = useState("24h");
 const [followUpReminder, setFollowUpReminder] = useState(true);
 const [autoAssignAgent, setAutoAssignAgent] = useState(false);
 const [sendConfirmation, setSendConfirmation] = useState(true);

 return (
 <div className="space-y-6-up">
 <div className="flex items-center gap-3">
 <a href="/admin" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
 </a>
 <div>
 <h1 className="text-xl font-bold text-gray-900">CRM Settings</h1>
 <p className="text-sm text-gray-500 mt-0.5">Manage leads, inquiries, and client relationships</p>
 </div>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Lead Management</h2>
 <div className="space-y-4">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-2">Lead Routing Method</label>
 <div className="flex gap-2">
 {[
 { value: "auto", label: "Auto-Assign" },
 { value: "manual", label: "Manual Review" },
 { value: "round", label: "Round Robin" },
 ].map((opt) => (
 <button
 key={opt.value}
 onClick={() => setLeadRouting(opt.value)}
 className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
 leadRouting === opt.value
 ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
 : "bg-white text-gray-600 border-gray-200 hover:border-[var(--color-primary)]/30"
 }`}
>
 {opt.label}
 </button>
 ))}
 </div>
 </div>
 <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/50 border border-gray-100">
 <div>
 <p className="text-sm font-medium text-gray-900">Auto-Assign to Agent</p>
 <p className="text-xs text-gray-500 mt-0.5">New leads are automatically assigned to an available agent.</p>
 </div>
 <button
 onClick={() => setAutoAssignAgent(!autoAssignAgent)}
 className={`relative w-11 h-6 rounded-full transition-colors ${autoAssignAgent ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
>
 <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoAssignAgent ? "translate-x-5" : ""}`} />
 </button>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Inquiry Settings</h2>
 <div className="space-y-4">
 <div>
 <label className="block text-xs font-medium text-gray-700 mb-2">Target Response Time</label>
 <select
 value={inquiryResponse}
 onChange={(e) => setInquiryResponse(e.target.value)}
 className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
>
 <option value="1h">Within 1 hour</option>
 <option value="4h">Within 4 hours</option>
 <option value="24h">Within 24 hours</option>
 <option value="48h">Within 48 hours</option>
 </select>
 </div>
 <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/50 border border-gray-100">
 <div>
 <p className="text-sm font-medium text-gray-900">Send Confirmation to Client</p>
 <p className="text-xs text-gray-500 mt-0.5">Auto-reply when inquiry is received.</p>
 </div>
 <button
 onClick={() => setSendConfirmation(!sendConfirmation)}
 className={`relative w-11 h-6 rounded-full transition-colors ${sendConfirmation ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
>
 <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${sendConfirmation ? "translate-x-5" : ""}`} />
 </button>
 </div>
 <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/50 border border-gray-100">
 <div>
 <p className="text-sm font-medium text-gray-900">Follow-Up Reminder</p>
 <p className="text-xs text-gray-500 mt-0.5">Notify agent if inquiry is unread after target time.</p>
 </div>
 <button
 onClick={() => setFollowUpReminder(!followUpReminder)}
 className={`relative w-11 h-6 rounded-full transition-colors ${followUpReminder ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
>
 <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${followUpReminder ? "translate-x-5" : ""}`} />
 </button>
 </div>
 </div>
 <Button className="mt-4" onClick={() => alert("CRM settings saved (Demo)")}>Save CRM Settings</Button>
 </div>

 <div className="bg-white rounded-lg border border-gray-200 p-5">
 <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline Stages</h2>
 <div className="space-y-2">
 {[
 { stage: "New Inquiry", count: 5, color: "bg-blue-100 text-blue-700" },
 { stage: "Contacted", count: 3, color: "bg-amber-100 text-amber-700" },
 { stage: "Viewing Scheduled", count: 2, color: "bg-purple-100 text-purple-700" },
 { stage: "Negotiation", count: 1, color: "bg-orange-100 text-orange-700" },
 { stage: "Closed", count: 4, color: "bg-emerald-100 text-emerald-700" },
 ].map((item) => (
 <div key={item.stage} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
 <div className="flex items-center gap-3">
 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color}`}>{item.stage}</span>
 </div>
 <span className="text-sm font-medium text-gray-900">{item.count}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
