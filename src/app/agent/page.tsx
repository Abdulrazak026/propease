"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { api } from "@/lib/api-client";
import Footer from "@/components/layout/Footer";

interface MyListing { id: string; title: string; propertyType: string; listingType: string; city: string; price: number; status: string; createdAt: string; }

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-purple-100 text-purple-800",
  sold: "bg-gray-200 text-gray-600",
  rented: "bg-teal-100 text-teal-800",
  rejected: "bg-red-100 text-red-700",
};

export default function AgentPage() {
  const { isAuthenticated, currentUser, role } = useRole();
  const isAgent = isAuthenticated && role === "agent";
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAgent) return;
    setLoading(true);
    api.get<{ listings: MyListing[] }>("/api/agent/my-listings").then(r => {
      if (r.data?.listings) setListings(r.data.listings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAgent]);

  if (isAgent) {
    const counts = {
      total: listings.length,
      review: listings.filter(l => l.status === "review").length,
      approved: listings.filter(l => l.status === "approved" || l.status === "available").length,
      rented: listings.filter(l => l.status === "rented" || l.status === "sold").length,
    };
    return (
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name?.split(" ")[0] || ""}</h1>
            <p className="text-sm text-gray-500">Manage your listings and inquiries</p>
          </div>
          <Link href="/ambassador/listings/new" className="text-xs font-semibold px-3.5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors">+ New Listing</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Total listings", v: counts.total, c: "from-gray-500 to-gray-700" },
            { l: "Awaiting review", v: counts.review, c: "from-amber-500 to-amber-700" },
            { l: "Live", v: counts.approved, c: "from-emerald-500 to-emerald-700" },
            { l: "Closed", v: counts.rented, c: "from-sky-500 to-sky-700" },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 bg-gradient-to-br ${s.c} bg-clip-text text-transparent`}>{s.v}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">My listings</h2>
            <span className="text-[11px] text-gray-500">{listings.length} total</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">No listings yet</p>
              <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">Post your first property. It goes to review before going public, usually within a few hours.</p>
              <Link href="/ambassador/listings/new" className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 text-xs font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">Post a property</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Property</th>
                    <th className="px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">City</th>
                    <th className="px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.slice(0, 10).map(l => (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate">{l.title}</td>
                      <td className="px-5 py-3 text-xs text-gray-600 capitalize">{l.propertyType} · {l.listingType}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{l.city}</td>
                      <td className="px-5 py-3 text-xs font-medium text-gray-900">₦{l.price.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[l.status] || "bg-gray-100 text-gray-700"}`}>{l.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="relative bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">For property owners</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Manage your rentals.<br />
              <span className="text-[var(--color-primary)]">Get paid on time.</span>
            </h1>
            <p className="text-base text-gray-600 mt-4 max-w-xl leading-relaxed">
              One dashboard for rent collection, tenant records, agreements, and maintenance. No more chasing payments.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-gray-950 text-white text-sm font-semibold rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all"
              >
                Sign in to dashboard
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-gray-200 text-gray-800 hover:bg-gray-50 transition-all"
              >
                Create free account
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">Free for up to 3 units. No card required.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { v: "₦38M", l: "Rent collected monthly" },
              { v: "97%", l: "Paid on time" },
              { v: "< 4 hrs", l: "Maintenance response" },
            ].map((s) => (
              <div key={s.l} className="bg-white rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{s.v}</p>
                <p className="text-xs text-gray-500 mt-1.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-[1.15]">Everything you need, in one app.</h2>
            <p className="text-sm text-gray-500 mt-2">Three things landlords do most. Done well.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Rent collection</h3>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">Tenants pay through Paystack. You see the deposit land in your account.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Tenant records</h3>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">Lease, ID, payment history. All in one place per tenant.</p>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl p-6 border border-sky-100">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 8.2 0 4.5 4.5 0 0 0-7.5-2.78M15 5.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 13.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Maintenance</h3>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">Tenants log issues. You assign, track, and pay in the same screen.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-[1.15]">Set up in an afternoon.</h2>
            <p className="text-sm text-gray-500 mt-2">Run from your phone after that.</p>
          </div>
          <div className="mt-8 space-y-3 max-w-2xl">
            {[
              { n: "1", t: "Add your property", d: "Address, units, current rent. 2 minutes each." },
              { n: "2", t: "Invite your tenants", d: "They get a link. They sign in and can pay from any phone." },
              { n: "3", t: "Get paid on the 1st", d: "Auto-reminders go out 3 days before rent is due." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">{s.n}</div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{s.t}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="relative bg-gray-950 rounded-3xl overflow-hidden p-10 sm:p-14 text-center sm:text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
              <div className="max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.1]">Ready to stop chasing rent?</h2>
                <p className="text-white/55 mt-2 text-sm">Open a free account. Set up takes one afternoon.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <Link href="/login" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 bg-white text-gray-950 text-sm font-semibold rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all">
                  Sign in
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center min-h-[52px] px-7 py-3.5 text-sm font-semibold rounded-full border border-white/20 text-white hover:bg-white/5 transition-all">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
