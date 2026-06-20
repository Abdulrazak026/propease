export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: "inquiries" | "tasks" | "withdrawals";
  permission?: string;
  group?: string;
}

export const dashboardNav: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: "dashboard", group: "Main" },
    { label: "Users", href: "/admin/users", icon: "users", permission: "canManageUsers", group: "Main" },
    { label: "Staffs", href: "/admin/staffs", icon: "tasks", permission: "canManageUsers", group: "Main" },
    { label: "Listings", href: "/admin/outsourcing", icon: "post-listing", group: "Main" },
    { label: "Submissions", href: "/admin/submissions", icon: "inquiries", group: "Inbox" },
    { label: "Inquiries", href: "/admin/crm", icon: "messages", group: "Inbox" },
    { label: "Tasks", href: "/admin/tasks", icon: "tasks", badge: "tasks", permission: "canCreateTasks", group: "Operations" },
    { label: "Applications", href: "/admin/applications", icon: "applications", group: "Operations" },
    { label: "Reservations", href: "/admin/reservations", icon: "agreements", group: "Operations" },
    { label: "Agreements", href: "/admin/agreements", icon: "agreements", permission: "canManageAgreements", group: "Operations" },
    { label: "Transactions", href: "/admin/deals", icon: "audit", permission: "canCloseDeals", group: "Operations" },
    { label: "Commissions", href: "/admin/commissions", icon: "commissions", group: "Operations" },
    { label: "Careers", href: "/admin/careers", icon: "agreements", group: "Operations" },
    { label: "Moderation", href: "/admin/moderation", icon: "agreements", permission: "canManageContent", group: "Content" },
    { label: "Media", href: "/admin/media", icon: "post-listing", permission: "canManageContent", group: "Content" },
    { label: "Blog", href: "/admin/blog", icon: "agreements", permission: "canManageContent", group: "Content" },
    { label: "Newsletter", href: "/admin/newsletter", icon: "inquiries", group: "Content" },
    { label: "Social Media", href: "/admin/social-media", icon: "social", group: "Content" },
    { label: "Settings", href: "/admin/settings", icon: "settings", group: "System" },
    { label: "Profile", href: "/profile", icon: "users", group: "System" },
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
    { label: "Profile", href: "/profile", icon: "users" },
  ],
  ambassador: [
    { label: "City Overview", href: "/ambassador", icon: "city-overview" },
    { label: "My Agents", href: "/ambassador/agents", icon: "users" },
    { label: "Listings", href: "/ambassador/listings", icon: "post-listing" },
    { label: "Moderation", href: "/ambassador/moderation", icon: "agreements", permission: "canManageContent" },
    { label: "Tasks", href: "/ambassador/tasks", icon: "create-task", permission: "canCreateTasks" },
    { label: "Commissions", href: "/ambassador/commissions", icon: "commissions" },
    { label: "Wallet", href: "/wallet", icon: "wallet" },
    { label: "Settings", href: "/ambassador/settings", icon: "settings" },
    { label: "Profile", href: "/profile", icon: "users" },
  ],
};
