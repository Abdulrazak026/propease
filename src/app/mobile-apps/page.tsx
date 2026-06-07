import Link from "next/link";

const features = [
  { icon: "🔍", title: "Browse Listings", desc: "Search and filter thousands of properties across Kano with powerful search tools." },
  { icon: "📷", title: "Photo & Video Tours", desc: "View high-quality photos and virtual tours of properties before you visit." },
  { icon: "💬", title: "Instant Chat", desc: "Message agents directly from the app. Get answers in real time." },
  { icon: "📋", title: "Apply on the Go", desc: "Submit tenant applications and sign rent agreements from your phone." },
  { icon: "🔔", title: "Saved Alerts", desc: "Get notified when new properties matching your criteria are listed." },
  { icon: "💳", title: "Payments", desc: "Pay deposits and rent securely through Paystack integration in the app." },
  { icon: "📊", title: "Price History", desc: "Track how property prices have changed over time in any neighbourhood." },
  { icon: "⭐", title: "Reviews & Ratings", desc: "Read and leave reviews about properties and agents." },
];

export default function MobileAppsPage() {
  return (
    <div className="flex-1">
      <section className="relative bg-[var(--color-primary)] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-15" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6">
            Mobile Apps
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Take MBPP <span className="text-[var(--color-accent)]">Anywhere You Go</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Find homes, message agents, and manage your rentals, all from your phone.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-5 mb-20">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-lg border border-gray-200 p-5 text-center">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Download the App</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
            Available on iOS and Android. Coming soon to the App Store and Google Play Store.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium opacity-60 cursor-not-allowed">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              App Store
            </span>
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium opacity-60 cursor-not-allowed">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 20.5v-17a.5.5 0 01.5-.5h.06L17.2 11.3a.5.5 0 010 .84L3.56 20.5a.5.5 0 01-.5-.5zM18.72 12.4l-3.3 5.5 6.18 3.53a.5.5 0 00.74-.44V8.71a.5.5 0 00-.74-.44l-6.18 3.53 3.3 5.5z"/></svg>
              Google Play
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Coming soon. Notify me when available</p>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Mobile-Optimised Web App</h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
            Until the native apps launch, our mobile website is fully optimised for your phone. Add MBPP to your home screen for an app-like experience.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-all"
          >
            Browse Now
          </Link>
        </div>
      </div>
    </div>
  );
}
