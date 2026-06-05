export default function TermsPage() {
 return (
 <div className="flex-1 py-16 px-4">
 <div className="max-w-3xl mx-auto">
 <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
 <p className="text-sm text-gray-500 mb-8">Last updated: 1 June 2026</p>

 <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
 <p>
 By accessing or using MBPP ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">1. Definitions</h2>
 <ul className="list-disc pl-6 space-y-1">
 <li><strong>Platform</strong> — MBPP website and associated services</li>
 <li><strong>User</strong> — any person or entity accessing the Platform</li>
 <li><strong>Agent</strong> — field personnel who perform tasks and show properties</li>
 <li><strong>Ambassador</strong> — city-level manager who oversees agents and listings</li>
 <li><strong>Head/Admin</strong> — platform administrator with full system access</li>
 <li><strong>Listing</strong> — a property advertised on the Platform</li>
 </ul>

 <h2 className="text-lg font-semibold text-gray-900">2. User Accounts</h2>
 <p>
 Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials. MBPP reserves the right to suspend or terminate accounts that violate these terms.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">3. Roles & Responsibilities</h2>
 <p>
 <strong>Agents:</strong> Agents are independent contractors who use the Platform to receive tasks, show properties, and earn commissions. Agents must conduct themselves professionally and accurately report task status.
 </p>
 <p>
 <strong>Ambassadors:</strong> Ambassadors manage city operations, create listings, assign tasks to agents, and oversee local performance. Ambassadors are responsible for the accuracy of listings in their city.
 </p>
 <p>
 <strong>Head/Admin:</strong> Platform administrators have full access to manage users, configure commission rates, audit activity, and maintain platform settings.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">4. Listings & Transactions</h2>
 <p>
 Property listings are provided by ambassadors and verified agents. MBPP facilitates connections but does not guarantee the accuracy of all listing details. Users should verify property information independently before making commitments.
 </p>
 <p>
 All prices are in Nigerian Naira (₦). Rent tiers are as described on each listing. Holding deposits are refundable per the terms specified on the reservation.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">5. Commissions & Wallet</h2>
 <p>
 Commissions are calculated based on the rates configured by the platform admin. Agents and ambassadors earn splits as defined in the commission settings. Wallet balances can be withdrawn subject to approval by platform administrators.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">6. Prohibited Conduct</h2>
 <ul className="list-disc pl-6 space-y-1">
 <li>Misrepresenting property details or pricing</li>
 <li>Circumventing platform fees or commissions</li>
 <li>Harassing other users, agents, or clients</li>
 <li>Using the platform for unlawful purposes</li>
 <li>Attempting to breach platform security</li>
 </ul>

 <h2 className="text-lg font-semibold text-gray-900">7. Limitation of Liability</h2>
 <p>
 MBPP is a marketplace platform and is not a party to any transaction between users. We are not liable for disputes between landlords, tenants, agents, or ambassadors. Our liability is limited to the maximum extent permitted by Nigerian law.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">8. Termination</h2>
 <p>
 Either party may terminate this agreement at any time. Upon termination, your access to the Platform will be revoked. Outstanding commissions or wallet balances will be settled per platform policy.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">9. Changes to Terms</h2>
 <p>
 We reserve the right to modify these terms at any time. Users will be notified of material changes. Continued use after changes constitutes acceptance of the new terms.
 </p>

 <h2 className="text-lg font-semibold text-gray-900">10. Governing Law</h2>
 <p>
 These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Kano State.
 </p>
 </div>
 </div>
 </div>
 );
}
