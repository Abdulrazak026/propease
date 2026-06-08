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
  { label: "Tasks", href: "/admin/tasks", icon: "tasks", badge: "tasks", permission: "canCreateTasks" },
  { label: "Agreements", href: "/admin/agreements", icon: "agreements", permission: "canManageAgreements" },
  { label: "Deals", href: "/admin/deals", icon: "audit", permission: "canCloseDeals" },
  { label: "Commissions", href: "/admin/commissions", icon: "commissions" },
  { label: "Moderation", href: "/admin/moderation", icon: "agreements", permission: "canManageContent" },
  { label: "Media", href: "/admin/media", icon: "post-listing", permission: "canManageContent" },
  { label: "Blog", href: "/admin/blog", icon: "agreements", permission: "canManageContent" },
  { label: "FAQs", href: "/admin/faqs", icon: "inquiries" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "inquiries" },
  { label: "CRM Settings", href: "/admin/crm", icon: "settings" },
  { label: "Outsourcing", href: "/admin/outsourcing", icon: "users" },
  { label: "Careers", href: "/admin/careers", icon: "agreements" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  ],
  agent: [
  { label: "Task Board", href: "/agent", icon: "tasks", badge: "tasks", permission: "canCreateTasks" },
  { label: "My Tasks", href: "/agent/tasks", icon: "tasks", permission: "canCreateTasks" },
  { label: "My Listings", href: "/agent/my-listings", icon: "post-listing", permission: "canCreateListings" },
  { label: "Inquiries", href: "/agent/inquiries", icon: "inquiries", badge: "inquiries" },
  { label: "Applications", href: "/agent/applications", icon: "applications" },
  { label: "Agreements", href: "/agent/agreements", icon: "agreements", permission: "canManageAgreements" },
  { label: "Commissions", href: "/agent/commissions", icon: "commissions" },
  { label: "Wallet", href: "/wallet", icon: "wallet" },
  ],
  ambassador: [
  { label: "City Overview", href: "/ambassador", icon: "city-overview" },
  { label: "Post Listing", href: "/ambassador/listings/new", icon: "post-listing", permission: "canCreateListings" },
  { label: "Review Listings", href: "/ambassador/moderation", icon: "agreements", permission: "canManageContent" },
  { label: "Create Task", href: "/ambassador/tasks", icon: "create-task", permission: "canCreateTasks" },
  { label: "Commissions", href: "/ambassador/commissions", icon: "commissions" },
  { label: "Wallet", href: "/wallet", icon: "wallet" },
  { label: "Settings", href: "/ambassador/settings", icon: "settings" },
  ],
};
