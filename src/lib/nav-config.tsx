export interface NavItem {
 label: string;
 href: string;
 icon: string;
 badge?: "inquiries" | "tasks" | "withdrawals";
}

export const dashboardNav: Record<string, NavItem[]> = {
 admin: [
 { label: "Dashboard", href: "/admin", icon: "dashboard" },
 { label: "Users", href: "/admin/users", icon: "users" },
 { label: "Agreements", href: "/admin/agreements", icon: "agreements" },
 { label: "CRM Settings", href: "/admin/crm", icon: "settings" },
 { label: "Outsourcing", href: "/admin/outsourcing", icon: "users" },
  { label: "Staffs", href: "/admin/staffs", icon: "tasks" },
 { label: "Commissions", href: "/admin/commissions", icon: "commissions" },
  { label: "Deals", href: "/admin/deals", icon: "audit" },
 { label: "Settings", href: "/admin/settings", icon: "settings" },
 { label: "Audit Log", href: "/admin/audit", icon: "audit", badge: "withdrawals" },
 ],
 agent: [
 { label: "Task Board", href: "/agent", icon: "tasks", badge: "tasks" },
 { label: "Inquiries", href: "/agent/inquiries", icon: "inquiries", badge: "inquiries" },
 { label: "Applications", href: "/agent/applications", icon: "applications" },
 { label: "Agreements", href: "/agent/agreements", icon: "agreements" },
 { label: "Commissions", href: "/agent/commissions", icon: "commissions" },
 { label: "Wallet", href: "/wallet", icon: "wallet" },
 { label: "Settings", href: "/agent/settings", icon: "settings" },
 ],
 ambassador: [
 { label: "City Overview", href: "/ambassador", icon: "city-overview" },
 { label: "Post Listing", href: "/ambassador/listings/new", icon: "post-listing" },
 { label: "Create Task", href: "/ambassador/tasks", icon: "create-task" },
 { label: "Commissions", href: "/ambassador/commissions", icon: "commissions" },
 { label: "Wallet", href: "/wallet", icon: "wallet" },
 { label: "Settings", href: "/ambassador/settings", icon: "settings" },
 ],
};
