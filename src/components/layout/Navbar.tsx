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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-primary)]">PropEase</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition">
              Browse
            </Link>
            <Link href="/custom-order" className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition">
              Custom Order
            </Link>
            {isAuthenticated && dashboardLink && (
              <Link
                href={dashboardLink}
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition"
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:block">{currentUser!.name}</span>
                <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-medium capitalize">
                  {currentUser!.role}
                </span>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="border-t border-gray-100 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Demo: </span>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => handleDemoLogin(u.id)}
                className="text-xs px-2.5 py-1 rounded-md bg-gray-50 hover:bg-[var(--color-primary)] hover:text-white border border-gray-200 transition whitespace-nowrap"
              >
                {u.name} ({u.role})
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
