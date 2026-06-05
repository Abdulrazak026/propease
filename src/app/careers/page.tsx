import Link from "next/link";
import Button from "@/components/ui/Button";

const roles = [
  {
    title: "Field Agent — Kano Municipal",
    type: "Full-time",
    location: "Kano Municipal",
    desc: "Show properties to prospective tenants, complete tasks assigned by the ambassador, and close rental agreements. Commission-based with monthly minimum guarantee.",
  },
  {
    title: "Field Agent — Fagge",
    type: "Full-time",
    location: "Fagge",
    desc: "Cover commercial and residential properties in Fagge district. Must know the local market well and have reliable transportation.",
  },
  {
    title: "Ambassador — Tarauni",
    type: "Full-time",
    location: "Tarauni",
    desc: "Manage all operations in Tarauni district — onboard agents, verify listings, assign tasks, and grow market share. Previous real estate experience required.",
  },
  {
    title: "Ambassador — Nassarawa",
    type: "Full-time",
    location: "Nassarawa",
    desc: "Lead the Nassarawa expansion. Hire and train local agents, establish relationships with landlords, and hit growth targets.",
  },
  {
    title: "Software Engineer (Frontend)",
    type: "Remote",
    location: "Remote / Kano",
    desc: "Build and maintain our Next.js frontend. Strong React skills and eye for UI/UX required. Experience with TypeScript and Tailwind CSS preferred.",
  },
  {
    title: "Customer Support Lead",
    type: "Full-time",
    location: "Kano Municipal",
    desc: "Manage our support team, handle escalations, and ensure every user gets prompt help. Experience in property or fintech support is a plus.",
  },
];

const values = [
  { icon: "🎯", title: "Local First", text: "We build for Kano. Every decision starts with understanding our users and their neighbourhoods." },
  { icon: "🔍", title: "Transparency", text: "No hidden fees, no fake listings, no surprises. What you see is what you get." },
  { icon: "📈", title: "Growth", text: "We invest in our people. Agents get training, ambassadors get leadership development, and everyone shares in the success." },
  { icon: "🤝", title: "Community", text: "Real estate is about people. We foster trust between tenants, landlords, agents, and the platform." },
];

export default function CareersPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-[var(--color-primary)] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
            Careers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Join the Team That Is <span className="text-[var(--color-accent)]">Transforming Kano Real Estate</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Help us build the future of property in Northern Nigeria.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-lg border border-gray-200 p-5 text-center">
              <span className="text-2xl mb-3 block">{v.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{v.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Open Positions</h2>
          <p className="text-sm text-gray-500 mb-8">
            {roles.length} roles available. We review applications on a rolling basis.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div key={role.title} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{role.title}</h3>
                  <span className="text-[10px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-2 py-0.5 rounded-full">
                    {role.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{role.location}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{role.desc}</p>
                <Button size="sm">Apply Now</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Do Not See a Role That Fits?</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            We are always looking for talented people. Send us your CV and we will keep you in mind for future openings.
          </p>
          <Link href="/contact">
            <Button variant="outline">Send Your CV</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
