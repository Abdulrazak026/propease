"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { inquiries, tasks, withdrawals } from "@/lib/mock-data";

const navItems: Record<string, { label: string; href: string; icon: string; badge?: "inquiries" | "tasks" | "withdrawals" }[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Users", href: "/admin/users", icon: "👥" },
    { label: "Commissions", href: "/admin/commissions", icon: "💰" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
    { label: "Audit Log", href: "/admin/audit", icon: "📋", badge: "withdrawals" },
  ],
  agent: [
    { label: "Task Board", href: "/agent", icon: "📋", badge: "tasks" },
    { label: "Inquiries", href: "/agent/inquiries", icon: "💬", badge: "inquiries" },
    { label: "Commissions", href: "/agent/commissions", icon: "💰" },
    { label: "Wallet", href: "/wallet", icon: "👛" },
  ],
  ambassador: [
    { label: "City Overview", href: "/ambassador", icon: "🏙️" },
    { label: "Post Listing", href: "/ambassador/listings/new", icon: "➕" },
    { label: "Create Task", href: "/ambassador/tasks", icon: "📌" },
    { label: "Commissions", href: "/ambassador/commissions", icon: "💰" },
    { label: "Wallet", href: "/wallet", icon: "👛" },
    { label: "Settings", href: "/ambassador/settings", icon: "⚙️" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, currentUser } = useRole();
  const pathname = usePathname();

  const resolvedRole = role === "head" ? "admin" : role;
  const items = resolvedRole ? navItems[resolvedRole] : [];

  const badgeCount = (badge: string | undefined): number => {
    if (!badge || !currentUser) return 0;
    if (badge === "inquiries") return inquiries.filter((i) => i.assignedAgent?.id === currentUser.id && i.status === "new").length;
    if (badge === "tasks") return tasks.filter((t) => t.assignedTo.id === currentUser.id && (t.status === "open" || t.status === "in_progress")).length;
    if (badge === "withdrawals") return withdrawals.filter((w) => w.status === "pending").length;
    return 0;
  };

  return (
    <div className="flex flex-1">
      <aside className="w-60 bg-white border-r border-gray-200 hidden md:flex md:flex-col shrink-0">
        <nav className="p-3 space-y-1 flex-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const count = badgeCount(item.badge);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? resolvedRole === "admin" ? "bg-violet-600 text-white shadow-sm" : "bg-[var(--color-primary)] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                  }`}>
                    {count > 9 ? "9+" : count}
                  </span>
                )}
                {active && count === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Site
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
