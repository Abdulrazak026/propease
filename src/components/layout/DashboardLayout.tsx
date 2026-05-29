"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";

const navItems: Record<string, { label: string; href: string; icon: string }[]> = {
  agent: [
    { label: "Task Board", href: "/agent", icon: "📋" },
    { label: "Inquiries", href: "/agent/inquiries", icon: "💬" },
    { label: "Commissions", href: "/agent/commissions", icon: "💰" },
  ],
  ambassador: [
    { label: "City Overview", href: "/ambassador", icon: "🏙️" },
    { label: "Post Listing", href: "/ambassador/listings/new", icon: "➕" },
    { label: "Create Task", href: "/ambassador/tasks", icon: "📌" },
    { label: "Commissions", href: "/ambassador/commissions", icon: "💰" },
  ],
  head: [
    { label: "Overview", href: "/head", icon: "📊" },
    { label: "Users", href: "/head/users", icon: "👥" },
    { label: "Commissions", href: "/head/commissions", icon: "💰" },
    { label: "Settings", href: "/head/settings", icon: "⚙️" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const pathname = usePathname();

  const items = role ? navItems[role] : [];

  return (
    <div className="flex flex-1">
      <aside className="w-56 bg-white border-r border-gray-200 hidden md:block shrink-0">
        <nav className="p-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
