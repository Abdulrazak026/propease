"use client";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";
import { users } from "@/lib/mock-data";

export default function Navbar() {
  const { currentUser, setCurrentUser, isAuthenticated } = useRole();

  const handleDemoLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId) || null;
    setCurrentUser(user);
  };

  const handleLogout = () => setCurrentUser(null);

  const dashboardLink = isAuthenticated
    ? `/${currentUser!.role}`
    : null;

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-bold text-[var(--color-primary)]">PropEase</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-100/50 rounded-lg transition-all">
                Browse
              </Link>
              <Link href="/custom-order" className="px-4 py-2 text-sm text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-100/50 rounded-lg transition-all">
                Custom Order
              </Link>
              {isAuthenticated && dashboardLink && (
                <Link href={dashboardLink} className="px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-gray-100/50 rounded-lg transition-all">
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {currentUser!.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 leading-tight">{currentUser!.name}</p>
                      <p className="text-[11px] text-gray-500 capitalize leading-tight">{currentUser!.role}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>

          {!isAuthenticated && (
            <div className="border-t border-white/10 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Demo:</span>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleDemoLogin(u.id)}
                  className="text-xs px-3 py-1 rounded-full bg-white/60 hover:bg-white hover:text-[var(--color-primary)] border border-gray-200/60 transition-all whitespace-nowrap"
                >
                  {u.name} ({u.role})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
