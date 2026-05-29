"use client";
import { useRole } from "@/context/RoleContext";
import { inquiries } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function AgentInquiries() {
  const { currentUser } = useRole();
  const myInquiries = inquiries.filter((i) => i.assignedAgent?.id === currentUser?.id);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-sm text-gray-500 mt-0.5">Messages from clients about your listings</p>
      </div>

      {myInquiries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/60">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">No inquiries yet</h3>
          <p className="text-sm text-gray-400 mt-1">Inquiries will appear here when clients message you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myInquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{inq.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{inq.clientName}</h3>
                    <p className="text-xs text-gray-500">{inq.clientContact}</p>
                  </div>
                </div>
                <Badge variant={inq.status === "new" ? "info" : inq.status === "read" ? "default" : "success"}>
                  {inq.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-3 ml-13">{inq.message}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  About: <span className="text-gray-600 font-medium">{inq.listingTitle}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">Mark Read</Button>
                  <Button size="sm">Reply</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
