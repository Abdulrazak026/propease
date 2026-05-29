export default function PrivacyPage() {
  return (
    <div className="flex-1 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 1 June 2026</p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <p>
            PropEase ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>
          <p>
            <strong>Personal Data:</strong> Name, email address, phone number, and wallet information when you register or use our services.
          </p>
          <p>
            <strong>Usage Data:</strong> Information on how you access and use the platform, including pages visited, time spent, and search queries.
          </p>
          <p>
            <strong>Device Data:</strong> Browser type, operating system, IP address, and device identifiers.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p>We use the collected data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, operate, and maintain our platform</li>
            <li>Process transactions and manage your wallet</li>
            <li>Assign tasks and track commission payouts</li>
            <li>Send relevant property listings and service updates</li>
            <li>Improve our platform and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share information with:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Property owners and agents to facilitate transactions</li>
            <li>Payment processors (Paystack) for transaction processing</li>
            <li>Service providers who assist in platform operations</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">4. Data Security</h2>
          <p>
            We implement appropriate security measures including encryption, access controls, and regular audits to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal data held by us</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with relevant authorities</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">6. Cookies</h2>
          <p>
            We use cookies to enhance your experience, analyze traffic, and personalize content. You can control cookie settings in your browser. Essential cookies are required for platform operation.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">7. Contact</h2>
          <p>
            For privacy-related inquiries, contact us at <strong>privacy@propease.ng</strong> or visit our <a href="/contact" className="text-[var(--color-primary)] hover:underline">Contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
