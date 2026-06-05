"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, setCurrentUser, isAuthenticated } = useRole();

  const handleLogout = () => { setCurrentUser(null); router.push("/"); };

  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/agent") || pathname.startsWith("/ambassador") || pathname === "/wallet";

  const NAV_LINKS = [
    { label: "Buy", href: "/?type=buy" },
    { label: "Rent", href: "/?type=rent" },
    { label: "Sell", href: "/sell" },
    { label: "Manage Rentals", href: "/agent" },
    { label: "Advertise", href: "/list-property" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Get Help", href: "/help" },
  ];

  return (
    <>
      {!isDashboard && (
        <div className="hidden lg:flex items-center h-12 px-6 bg-white border-b border-gray-200">
          <nav className="flex items-center gap-2 flex-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                    active ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  {currentUser!.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className="text-xs text-gray-500 capitalize">{currentUser!.role === "head" ? "admin" : currentUser!.role}</span>
                <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600 ml-1">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="text-xs text-white bg-[var(--color-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--color-primary-light)] transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
