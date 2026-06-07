import Link from "next/link";

const features = [
  {
    title: "Track Rent Payments",
    desc: "See who has paid and who hasn't. Get reminders for upcoming and overdue rent, all in real time.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: "Tenant Management",
    desc: "View tenant profiles, lease terms, and contact information in one organized place.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Digital Agreements",
    desc: "Create and manage tenancy agreements with e-signatures. No paper, no delays.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
      </svg>
    ),
  },
  {
    title: "Maintenance Requests",
    desc: "Tenants can send maintenance requests. Track progress and assign contractors instantly.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1 3.06a1 1 0 01-1.5-.86V6.63a1 1 0 011.5-.86l5.1 3.06m0 0l5.1 3.06a1 1 0 010 1.72l-5.1 3.06m0-7.84V3m0 0l-5.1 3.06a1 1 0 000 1.72L11.42 9m7.08 0l5.1 3.06a1 1 0 010 1.72l-5.1 3.06M18.5 3l5.1 3.06a1 1 0 010 1.72L18.5 10.78M18.5 3v7.78" />
      </svg>
    ),
  },
];

export default function AgentPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary)]/80 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-[11px] font-medium tracking-wider uppercase mb-8 border border-white/10 backdrop-blur-sm">Manage Rentals</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Your Properties,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-amber-200">One Dashboard</span>
          </h1>
          <p className="mt-5 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Manage all your rental properties from a single place. Track payments, communicate with tenants, and handle agreements — all without spreadsheets.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em]">Platform Features</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 tracking-tight">Everything You Need to Manage Rentals</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">Tools designed for Nigerian landlords and property managers.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-20">
          {features.map((f) => (
            <div key={f.title} className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg hover:border-gray-200 active:scale-[0.99] transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/5 text-[var(--color-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-10 md:p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Sign In to Access Your Dashboard</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              Already have an account? Sign in to view your rental properties, track payments, and manage tenants.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login" className="inline-flex items-center justify-center min-h-[48px] px-8 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary)]/90 active:scale-[0.97] transition-all shadow-lg shadow-[var(--color-primary)]/20">Sign In</Link>
              <Link href="/register" className="inline-flex items-center justify-center min-h-[48px] px-8 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97] transition-all">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
