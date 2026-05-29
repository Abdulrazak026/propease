"use client";
import { useRole } from "@/context/RoleContext";
import { listings, tasks, users } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function AmbassadorOverview() {
  const { currentUser } = useRole();
  const city = currentUser?.city || "";
  const cityListings = listings.filter((l) => l.city === city);
  const cityActiveListings = cityListings.filter((l) => l.status !== "taken");
  const cityTasks = tasks.filter((t) => t.area === city);
  const myAgents = users.filter((u) => u.ambassadorId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{city} Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage listings, agents, and tasks in your city</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Listings", value: cityActiveListings.length, color: "text-[var(--color-primary)]" },
          { label: "Total Listings", value: cityListings.length, color: "text-gray-900" },
          { label: "Agents", value: myAgents.length, color: "text-amber-600" },
          { label: "Open Tasks", value: cityTasks.filter((t) => t.status === "open" || t.status === "in_progress").length, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Your Listings</h2>
            <Link href="/ambassador/listings/new">
              <Button size="sm">+ Post New</Button>
            </Link>
          </div>

          {cityActiveListings.length > 0 ? (
            <div className="space-y-2">
              {cityActiveListings.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.city} • {formatNaira(l.price)}{l.listingType === "rent" ? "/yr" : ""}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    l.status === "available" ? "bg-emerald-100 text-emerald-700" :
                    l.status === "reserved" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">No listings in your city yet</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Your Agents</h2>
          </div>

          {myAgents.length > 0 ? (
            <div className="space-y-2">
              {myAgents.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-[var(--color-primary)]">
                      {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">
                      Wallet: {formatNaira(a.walletBalance)} • {listings.filter((l) => l.assignedAgent?.id === a.id).length} listings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">No agents assigned to you yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
