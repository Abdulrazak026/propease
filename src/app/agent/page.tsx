import Link from "next/link";
import Button from "@/components/ui/Button";

const features = [
  { icon: "📊", title: "Track Rent Payments", desc: "See who has paid and who hasn't. Get reminders for upcoming and overdue rent." },
  { icon: "🔑", title: "Tenant Management", desc: "View tenant profiles, lease terms, and contact information in one place." },
  { icon: "📝", title: "Digital Agreements", desc: "Create and manage tenancy agreements with e-signatures. No paper needed." },
  { icon: "🔔", title: "Maintenance Requests", desc: "Tenants can send maintenance requests. Track progress and assign contractors." },
];

export default function AgentPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-[var(--color-primary)] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">Manage Rentals</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Your Properties, <span className="text-[var(--color-accent)]">One Dashboard</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Manage all your rental properties from a single place. Track payments, communicate with tenants, and handle agreements.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Sign In to Access Your Dashboard</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Already have an account? Sign in to view your rental properties, track payments, and manage tenants.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login"><Button size="lg">Sign In</Button></Link>
            <Link href="/register"><Button variant="outline" size="lg">Create Account</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
