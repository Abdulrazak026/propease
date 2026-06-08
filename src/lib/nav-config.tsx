export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: "inquiries" | "tasks" | "withdrawals";
  permission?: string;
}

export const dashboardNav: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Submissions", href: "/admin/submissions", icon: "inquiries" },
    { label: "Users", href: "/admin/users", icon: "users", permission: "canManageUsers" },
    { label: "Staffs", href: "/admin/staffs", icon: "tasks", permission: "canManageUsers" },
    { label: "Moderation", href: "/admin/moderation", icon: "agreements", permission: "canManageContent" },
    { label: "Media", href: "/admin/media", icon: "post-listing", permission: "canManageContent" },
    { label: "Blog", href: "/admin/blog", icon: "agreements", permission: "canManageContent" },
    { label: "FAQs", href: "/admin/faqs", icon: "inquiries" },
    { label: "Newsletter", href: "/admin/newsletter", icon: "inquiries" },
    { label: "Tasks", href: "/admin/tasks", icon: "tasks", badge: "tasks", permission: "canCreateTasks" },
    { label: "Agreements", href: "/admin/agreements", icon: "agreements", permission: "canManageAgreements" },
    { label: "Deals", href: "/admin/deals", icon: "audit", permission: "canCloseDeals" },
    { label: "Commissions", href: "/admin/commissions", icon: "commissions" },
    { label: "Outsourcing", href: "/admin/outsourcing", icon: "users" },
    { label: "Careers", href: "/admin/careers", icon: "agreements" },
    { label: "CRM Settings", href: "/admin/crm", icon: "settings" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
    { label: "Messages", href: "/messages", icon: "messages" },
    { label: "Notifications", href: "/notifications", icon: "notifications" },
  ],
  agent: [
    { label: "Dashboard", href: "/agent", icon: "dashboard" },
    { label: "My Tasks", href: "/agent/tasks", icon: "tasks", permission: "canCreateTasks" },
    { label: "My Listings", href: "/agent/my-listings", icon: "post-listing", permission: "canCreateListings" },
    { label: "Inquiries", href: "/agent/inquiries", icon: "inquiries", badge: "inquiries" },
    { label: "Applications", href: "/agent/applications", icon: "applications" },
    { label: "Agreements", href: "/agent/agreements", icon: "agreements", permission: "canManageAgreements" },
    { label: "Commissions", href: "/agent/commissions", icon: "commissions" },
    { label: "Wallet", href: "/wallet", icon: "wallet" },
    { label: "Messages", href: "/messages", icon: "messages" },
    { label: "Notifications", href: "/notifications", icon: "notifications" },
  ],
  ambassador: [
    { label: "City Overview", href: "/ambassador", icon: "city-overview" },
    { label: "Listings", href: "/ambassador/listings", icon: "post-listing" },
    { label: "Moderation", href: "/ambassador/moderation", icon: "agreements", permission: "canManageContent" },
    { label: "Tasks", href: "/ambassador/tasks", icon: "create-task", permission: "canCreateTasks" },
    { label: "Commissions", href: "/ambassador/commissions", icon: "commissions" },
    { label: "Wallet", href: "/wallet", icon: "wallet" },
    { label: "Settings", href: "/ambassador/settings", icon: "settings" },
    { label: "Messages", href: "/messages", icon: "messages" },
    { label: "Notifications", href: "/notifications", icon: "notifications" },
  ],
};
