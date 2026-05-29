"use client";
import { useRole } from "@/context/RoleContext";
import { inquiries } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate, statusColors } from "@/lib/utils";

export default function AgentInquiries() {
  const { currentUser } = useRole();
  const myInquiries = inquiries.filter((i) => i.assignedAgent?.id === currentUser?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-sm text-gray-500 mt-0.5">Messages from clients about your listings</p>
      </div>

      {myInquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-base font-semibold text-gray-900">No inquiries yet</h3>
          <p className="text-sm text-gray-400 mt-1">Inquiries will appear here when clients message you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myInquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{inq.clientName}</h3>
                  <p className="text-xs text-gray-500">{inq.clientContact}</p>
                </div>
                <Badge variant={inq.status === "new" ? "info" : inq.status === "read" ? "default" : "success"}>
                  {inq.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-3">{inq.message}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="text-xs text-gray-400">
                  About: <span className="text-gray-600">{inq.listingTitle}</span>
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
