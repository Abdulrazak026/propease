import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@mbpproperties.com";

async function seedSettings() {
  const settings: Record<string, string> = {
    site_name: "MBPP",
    site_tagline: "Find Your Dream Property in Kano",
    primary_color: "#0d6e4e",
    secondary_color: "#f97316",
    accent_color: "#facc15",
    heading_font: "Inter",
    body_font: "Inter",
    meta_title: "MBPP \u2014 Real Estate Marketplace, Kano",
    meta_description: "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria. Your trusted real estate marketplace.",
    support_email: "support@mbpproperties.com",
    support_phone: "",
    support_whatsapp: "",
    office_address: "Kano Municipal, Kano State, Nigeria",
    business_hours: "Mon\u2013Fri 8AM\u20136PM, Sat 9AM\u20132PM",
    robots_txt: "User-agent: *\nAllow: /\nSitemap: https://mbpproperties.com/sitemap.xml",
    measurement: "sqft",
    currency: "NGN",
    currency_pos: "left",
    property_statuses: "For Sale,For Rent,Sold,Rented",
    property_types: "House,Flat,Land,Commercial,Shop,Warehouse",
    amenities: "Pool,Gym,Security,Parking,Borehole,Solar,Furnished,CCTV",
    cookie_text: "We use cookies to improve your experience. By continuing to browse, you agree to our use of cookies.",
    agent_dir_visible: "true",
    maintenance_mode: "false",
    timezone: "Africa/Lagos",
    date_format: "DD/MM/YYYY",
    available_cities: "Kano Municipal, Kano State; Bichi, Kano State; Rano, Kano State; Wudil, Kano State; Gwarzo, Kano State; Dambatta, Kano State; Karaye, Kano State; Tudun Wada, Kano State; Doguwa, Kano State; Dawakin Tofa, Kano State; Dawakin Kudu, Kano State; Kura, Kano State; Madobi, Kano State; Gezawa, Kano State; Minjibir, Kano State; Fagge, Kano State; Dala, Kano State; Gwale, Kano State; Nasarawa, Kano State; Tarauni, Kano State; Ungogo, Kano State; Kumbotso, Kano State; Bebeji, Kano State; Bunkure, Kano State; Garko, Kano State; Garun Mallam, Kano State; Kibiya, Kano State; Kiru, Kano State; Rogo, Kano State; Sumaila, Kano State; Takai, Kano State; Ajingi, Kano State; Bagwai, Kano State; Gabasawa, Kano State; Kunchi, Kano State; Makoda, Kano State; Rimin Gado, Kano State; Shanono, Kano State; Tofa, Kano State; Tsanyawa, Kano State; Gaya, Kano State; Albasu, Kano State; Babura, Kano State",
    terms_of_service: `# Terms of Service

**Last updated: June 2026**

## 1. Acceptance of Terms
By accessing or using MBPP Properties (the "Platform"), operated by SAVANNIX TECHNOLOGIES LTD (RC 1234567), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.

## 2. Services
MBPP provides a real estate marketplace connecting property seekers with verified listings in Kano, Nigeria. Services include property browsing, tenant applications, agent management, and transaction facilitation.

## 3. User Accounts
You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. MBPP reserves the right to suspend accounts that violate these terms.

## 4. Property Listings
All listings must be accurate and truthful in accordance with the Estate Surveyors and Valuers Registration Board of Nigeria (ESVARBON) Act and Kano State land administration laws. MBPP reserves the right to remove any listing that contains misleading information or violates applicable laws.

## 5. Payments and Transactions
All payments are processed securely through authorized payment providers (Paystack). MBPP is not liable for payment disputes between buyers, sellers, landlords, or tenants. Commission structures are governed by separate agreements with agents and ambassadors.

## 6. Commission and Fees
Agents and ambassadors agree to the commission rates published on the Platform at the time of transaction. Listing publication fees, withdrawal fees, and platform commission deductions are clearly displayed before any transaction is confirmed.

## 7. Dispute Resolution
Any dispute arising from the use of this Platform shall first be resolved through mediation. If mediation fails, disputes shall be referred to arbitration in Kano State under the Arbitration and Conciliation Act, Cap A18, Laws of the Federation of Nigeria, 2004.

## 8. Limitation of Liability
MBPP shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of or inability to use the Platform. Properties listed are the responsibility of their respective owners or agents.

## 9. Intellectual Property
All content on the Platform, including text, graphics, logos, icons, and software, is the property of SAVANNIX TECHNOLOGIES LTD and is protected by Nigerian copyright laws.

## 10. Termination
MBPP reserves the right to terminate or suspend your account at any time for violation of these Terms. Upon termination, your right to use the Platform will immediately cease.

## 11. Governing Law
These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.

## 12. Contact
For questions about these terms, contact: support@mbpproperties.com`,
    privacy_policy: `# Privacy Policy

**Last updated: June 2026**

## 1. Introduction
MBPP Properties ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. We comply with the Nigeria Data Protection Regulation (NDPR) 2019 and the Nigeria Data Protection Act 2023.

## 2. Information We Collect

### 2.1 Personal Information
- Full name, email address, phone number, and WhatsApp contact when you register or create a listing
- Physical address and identification documents when you apply as an agent or request verification
- Bank account details when requesting withdrawals
- Payment information processed securely through Paystack (we do not store your full card details)

### 2.2 Automatically Collected Information
- IP address, browser type, operating system, device information
- Pages visited, time spent, and navigation patterns
- Referral source and search queries

### 2.3 Property and Transaction Data
- Property search preferences and criteria
- Listing details you create or modify
- Transaction history, wallet balance, and commission records

## 3. How We Use Your Information
- To create and manage your account
- To match property seekers with relevant listings
- To process transactions, commissions, and withdrawals
- To communicate about inquiries, applications, and agreements
- To send service notifications and updates
- To improve the Platform and user experience
- To comply with legal obligations

## 4. Data Sharing
We may share your information with:
- Agents and ambassadors involved in your transaction
- Payment processors (Paystack) for transaction processing
- Email service providers (Resend) for communications
- Law enforcement authorities when required by law
- Professional advisers (auditors, legal counsel)

We never sell your personal data to third parties.

## 5. Data Protection Rights
Under the NDPR, you have the right to:
- Request access to your personal data
- Request correction of inaccurate data
- Request deletion of your data ("right to be forgotten")
- Restrict or object to processing of your data
- Data portability \u2014 receive your data in a structured format
- Withdraw consent at any time

To exercise these rights, contact our Data Protection Officer at admin@mbpproperties.com.

## 6. Data Retention
We retain your personal data for as long as your account is active or as needed to provide services. Transaction records are retained for a minimum of 7 years as required by Nigerian tax laws. Upon account deletion, personal data is removed within 30 days, except where retention is required by law.

## 7. Security Measures
We implement appropriate technical and organizational measures including:
- HTTPS encryption for all data transmission
- bcrypt password hashing (12 rounds)
- JWT-based authentication with refresh token rotation
- Access token blacklisting on logout
- Database connection encryption
- Regular security audits

## 8. Cookies
We use essential session cookies for authentication and security. Analytics cookies are used only if you consent. You can manage cookie preferences in your browser settings.

## 9. Third-Party Services
Our Platform integrates with:
- Paystack \u2014 for payment processing (see Paystack Privacy Policy)
- Resend \u2014 for email delivery (see Resend Privacy Policy)
- Google Analytics \u2014 for usage analytics (if configured)

These services have their own privacy policies and data handling practices.

## 10. Children's Privacy
The Platform is not intended for individuals under 18 years of age. We do not knowingly collect data from children.

## 11. International Transfers
Your data is primarily stored and processed in Nigeria. Where international transfers are necessary, we ensure appropriate safeguards are in place.

## 12. Changes to This Policy
We may update this Privacy Policy periodically. Material changes will be notified via email and a prominent notice on the Platform.

## 13. Contact
Data Protection Officer: admin@mbpproperties.com
Registered Office: SAVANNIX TECHNOLOGIES LTD, Kano Municipal, Kano State, Nigeria`,
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSettings.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
}

async function seedAdminPermissions() {
  await prisma.user.updateMany({
    where: { email: ADMIN_EMAIL },
    data: {
      canCreateTasks: true, canCloseDeals: true,
      canCreateListings: true, canManageUsers: true,
      canManageContent: true, canViewAnalytics: true, canManageAgreements: true,
    },
  });
}

async function seedBlogPosts() {
  const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (!admin) return;

  const posts = [
    {
      title: "How to Buy Land in Kano: A Complete Guide",
      slug: "how-to-buy-land-in-kano",
      excerpt: "Everything you need to know about purchasing land in Kano \u2014 from verifying titles to understanding customary land rights.",
      content: `<h2>Understanding Land Ownership in Kano</h2>
<p>Kano State has a rich history of land administration blending customary law with statutory provisions. Whether you're buying for residential, commercial, or agricultural purposes, understanding the land ownership structure is critical.</p>
<h2>Step 1: Identify the Type of Land Title</h2>
<p>In Kano, land can be held under:</p>
<ul><li><strong>Certificate of Occupancy (C of O)</strong> \u2014 issued by the Kano State Governor, the strongest form of title</li><li><strong>Customary Right of Occupancy</strong> \u2014 granted under local customary law, common in rural areas</li><li><strong>Deed of Assignment</strong> \u2014 transfer of interest from a previous owner</li><li><strong>Registered Conveyance</strong> \u2014 formal transfer registered at the Land Registry</li></ul>
<h2>Step 2: Conduct Due Diligence</h2>
<p>Before paying for any land:</p>
<ul><li>Visit the Kano State Geographic Information System (KANGIS) to verify the title</li><li>Confirm the seller is the legitimate owner</li><li>Check for encumbrances, liens, or pending litigation</li><li>Engage a licensed surveyor to confirm boundaries</li><li>Verify with the local community that there are no customary claims</li></ul>
<h2>Step 3: Negotiate and Document</h2>
<p>Once satisfied with due diligence, negotiate the price and ensure all agreements are documented. Key documents include:</p>
<ul><li>Deed of Assignment or Conveyance</li><li>Survey Plan</li><li>Receipt of Payment</li><li>Letter of Consent (where applicable)</li></ul>
<h2>Step 4: Register the Transaction</h2>
<p>Register your interest at the Kano State Land Registry. This protects your ownership rights and prevents future disputes.</p>
<h2>Common Pitfalls to Avoid</h2>
<ul><li>Buying from someone who does not have valid title</li><li>Failing to conduct a physical inspection of the land</li><li>Not involving a licensed surveyor</li><li>Ignoring community or family claims</li><li>Paying cash without proper receipts</li></ul>
<p>MBPP helps you find verified lands with clear titles listed by trusted agents. Always use our platform to connect with verified professionals.</p>`,
      coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    },
    {
      title: "Understanding Rent Agreements in Nigeria",
      slug: "understanding-rent-agreements-in-nigeria",
      excerpt: "A comprehensive guide to tenancy agreements, landlord obligations, and tenant rights under Nigerian law.",
      content: `<h2>The Importance of a Written Agreement</h2>
<p>In Nigeria, while oral tenancy agreements are legally recognized, a written agreement provides clear evidence of the terms agreed upon and protects both parties in case of disputes.</p>
<h2>Key Elements of a Valid Tenancy Agreement</h2>
<ul><li><strong>Parties:</strong> Full names and addresses of landlord and tenant</li><li><strong>Property Description:</strong> Detailed address and description of the premises</li><li><strong>Term:</strong> Start and end dates of the tenancy</li><li><strong>Rent:</strong> Amount, payment frequency, due date, and method</li><li><strong>Deposit:</strong> Security/damage deposit amount and refund conditions</li><li><strong>Service Charges:</strong> Any additional fees for maintenance, security, utilities</li><li><strong>Notice Period:</strong> Required notice for termination (usually 30-90 days)</li><li><strong>Renewal Terms:</strong> Conditions for renewing the tenancy</li><li><strong>Signatures:</strong> Both parties must sign and date the agreement</li></ul>
<h2>Landlord Obligations</h2>
<p>Under the Rent Control and Recovery of Premises Laws applicable in Kano State:</p>
<ul><li>Provide the premises in a habitable condition</li><li>Carry out necessary repairs (except damage caused by tenant)</li><li>Not disturb the tenant's quiet enjoyment of the property</li><li>Give proper notice before entry (usually 24 hours)</li><li>Issue receipts for all payments received</li><li>Return the security deposit within a reasonable time after tenancy ends</li></ul>
<h2>Tenant Obligations</h2>
<ul><li>Pay rent as and when due</li><li>Keep the premises clean and in good repair (reasonable wear and tear excepted)</li><li>Not sublet without landlord's written consent</li><li>Not use the premises for illegal purposes</li><li>Give proper notice before vacating</li><li>Allow reasonable access for repairs and inspections</li></ul>
<h2>Using MBPP's Digital Agreement System</h2>
<p>MBPP offers a digital tenancy agreement system where both parties can review and sign the agreement electronically. Our system creates a legally binding document that includes all the elements required under Nigerian law, with digital signatures that are admissible as evidence.</p>`,
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    },
    {
      title: "Property Investment Guide: Kano Real Estate Market",
      slug: "property-investment-guide-kano",
      excerpt: "Why Kano is one of Nigeria's most promising real estate markets and how to start investing profitably.",
      content: `<h2>Why Invest in Kano Real Estate?</h2>
<p>Kano is Nigeria's second-largest city and the commercial hub of Northern Nigeria. With a population exceeding 4 million and growing at approximately 3% annually, the demand for housing, commercial space, and industrial land continues to rise.</p>
<h2>Key Investment Areas</h2>
<ul><li><strong>Kano Municipal:</strong> Premium residential, government offices, commercial headquarters. High capital appreciation.</li><li><strong>Fagge:</strong> Mixed residential-commercial, near Sabon Gari market. Strong rental yields.</li><li><strong>Tarauni:</strong> Developing residential area, proximity to Bayero University. Student housing demand.</li><li><strong>Nassarawa:</strong> Government residential area (GRA), high-value properties.</li></ul>
<h2>Investment Strategies</h2>
<h3>1. Buy and Hold</h3>
<p>Purchase residential properties in developing areas like Tarauni. Hold for 3-5 years as infrastructure improves. Capital appreciation of 15-25% per year is achievable in well-selected locations.</p>
<h3>2. Rental Income</h3>
<p>Flats and multi-unit properties near commercial areas can yield 8-12% annual rental returns. A well-maintained 3-bedroom flat in Kano Municipal rents for N2M-N3.5M per year.</p>
<h3>3. Land Banking</h3>
<p>Purchase undeveloped land in growth corridors. Areas with planned road expansions or new government facilities see the fastest appreciation. Entry prices range from N500,000 to N5M per plot depending on location.</p>
<h3>4. Commercial Property</h3>
<p>Shops and office spaces near markets and business districts offer higher rental yields but require more management.</p>
<h2>Financing Your Investment</h2>
<ul><li>Federal Mortgage Bank of Nigeria (FMBN) \u2014 offers mortgage loans to contributors of the National Housing Fund</li><li>Commercial bank mortgage products \u2014 typically require 20-30% down payment</li><li>Developer financing \u2014 some developers offer installment payment plans</li><li>Partnership \u2014 pool resources with trusted partners for larger investments</li></ul>
<h2>Risk Management</h2>
<ul><li>Always verify title documents through KANGIS</li><li>Use MBPP-verified agents with proven track records</li><li>Insure your properties against fire, flood, and other risks</li><li>Diversify across different locations and property types</li><li>Keep adequate reserves for maintenance and vacancy periods</li></ul>`,
      coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    },
    {
      title: "Agent Commission Structure Explained",
      slug: "agent-commission-structure",
      excerpt: "How commissions are calculated, split between agents and ambassadors, and when you get paid on MBPP.",
      content: `<h2>How MBPP Commissions Work</h2>
<p>MBPP uses a transparent commission system where every deal is recorded and all parties can see their earnings. Commission rates are configured by the platform admin and apply consistently across all transactions.</p>
<h2>Commission Rates</h2>
<table>
<tr><th>Deal Type</th><th>Total Rate</th><th>Ambassador Share</th><th>Agent Share</th></tr>
<tr><td>Rent (Normal)</td><td>5%</td><td>3%</td><td>2%</td></tr>
<tr><td>Rent (With Damages)</td><td>8%</td><td>5%</td><td>3%</td></tr>
<tr><td>Rent (Full Package)</td><td>10%</td><td>6%</td><td>4%</td></tr>
<tr><td>Property Sale</td><td>6%</td><td>3.5%</td><td>2.5%</td></tr>
<tr><td>Partnership Deals</td><td>15%</td><td>8%</td><td>5%</td></tr>
</table>
<h2>Example Calculation</h2>
<p>For a full-package rental deal of N2,000,000/year:</p>
<ul><li>Total commission: 10% x N2,000,000 = N200,000</li><li>Ambassador's cut: 6% = N120,000</li><li>Agent's cut: 4% = N80,000</li></ul>
<h2>When Commissions Are Paid</h2>
<ul><li>Rental deals: Upon completion of the signed tenancy agreement by both landlord and tenant</li><li>Sale deals: Upon completion of property transfer and full payment</li><li>Partnership deals: Per the terms of the partnership agreement</li></ul>
<h2>Payout Process</h2>
<ol><li>Deal is closed and commission is calculated automatically</li><li>Commission is credited to your wallet immediately</li><li>You can withdraw funds to your bank account at any time (subject to admin approval)</li><li>Withdrawal requests are processed within 1-2 business days</li></ol>
<h2>Tips for Maximizing Your Earnings</h2>
<ul><li>Focus on full-package deals \u2014 they have the highest commission rates</li><li>Build a strong portfolio of properties in high-demand areas</li><li>Respond quickly to inquiries \u2014 first to respond often closes the deal</li><li>Leverage the ambassador network to get more leads</li><li>Keep your profile verified to build trust with clients</li></ul>`,
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    },
    {
      title: "Tenant Rights in Nigeria: What Every Renter Should Know",
      slug: "tenant-rights-in-nigeria",
      excerpt: "Know your rights as a tenant under Nigerian law before signing any tenancy agreement.",
      content: `<h2>Your Rights as a Tenant</h2>
<p>Under the various Rent Control and Recovery of Premises Laws applicable across Nigerian states, tenants have specific rights that landlords must respect. Understanding these rights protects you from exploitation and ensures a fair tenancy.</p>
<h2>Right to Written Agreement</h2>
<p>You have the right to a written tenancy agreement that clearly states all terms, including rent amount, payment schedule, deposit conditions, and notice period. Never accept a verbal-only agreement.</p>
<h2>Right to Receipts</h2>
<p>Your landlord must issue receipts for every payment you make, including rent, service charges, and deposits. These receipts are your proof of payment and protect you from false claims of non-payment.</p>
<h2>Right to Privacy and Quiet Enjoyment</h2>
<p>Your landlord cannot enter your rented premises without reasonable notice (usually 24 hours) except in emergencies. You have the right to enjoy the property without unreasonable disturbance.</p>
<h2>Right to Habitable Premises</h2>
<p>The property must be fit for habitation. This includes working plumbing, electricity, adequate ventilation, and structural safety. The landlord must carry out necessary repairs.</p>
<h2>Protection from Arbitrary Eviction</h2>
<p>Your landlord cannot evict you without following proper legal procedures, which include:</p>
<ul><li>Issuing a valid notice to quit</li><li>Allowing the notice period to expire</li><li>Obtaining a court order if you do not vacate</li></ul>
<p>Self-help eviction (changing locks, removing your belongings, cutting utilities) is illegal.</p>
<h2>Protection from Rent Gouging</h2>
<p>Some states have rent control laws that limit how much and how often rent can be increased. Check the applicable laws in your state.</p>
<h2>Security Deposit Return</h2>
<p>Your security deposit should be returned within a reasonable time after the tenancy ends, less any legitimate deductions for damages beyond normal wear and tear. The landlord must provide an itemized list of any deductions.</p>
<h2>What to Do If Your Rights Are Violated</h2>
<ol><li>Document everything \u2014 keep receipts, photos, and written communication</li><li>Send a formal written complaint to the landlord</li><li>Contact relevant tenants' associations or legal aid organizations</li><li>Report to the Kano State Rent Tribunal if applicable</li><li>Consult a lawyer for serious violations</li></ol>
<p>MBPP helps protect tenants by verifying landlords and agents, providing digital tenancy agreements, and maintaining records of all transactions on the platform.</p>`,
      coverImage: "https://images.unsplash.com/photo-1582407949804-0e0a2a0a0a0a?w=800",
    },
    {
      title: "First-Time Home Buyer Tips for Kano Residents",
      slug: "first-time-home-buyer-tips",
      excerpt: "Practical advice for first-time property buyers in Kano \u2014 from budgeting to closing the deal.",
      content: `<h2>Start with a Realistic Budget</h2>
<p>Before you start looking at properties, determine what you can afford. In Kano, prices vary significantly by location and property type:</p>
<ul><li>2-bedroom flat: N12M - N25M</li><li>3-bedroom bungalow: N15M - N45M</li><li>4-bedroom duplex: N30M - N80M+</li><li>Plot of land (500sqm): N2M - N10M depending on location</li></ul>
<h2>Get Pre-Approved for Financing</h2>
<p>If you're not paying cash, get pre-approved for a mortgage before you start shopping. The Federal Mortgage Bank of Nigeria (FMBN) offers loans through the National Housing Fund. Commercial banks also offer mortgage products with varying terms.</p>
<h2>Choose the Right Location</h2>
<p>Consider these factors when choosing a location:</p>
<ul><li><strong>Proximity to work/school:</strong> Kano traffic is manageable but growing</li><li><strong>Infrastructure:</strong> Access to water, electricity, and good roads</li><li><strong>Security:</strong> Research the neighborhood's safety record</li><li><strong>Future development:</strong> Areas with planned infrastructure improvements appreciate faster</li><li><strong>Community:</strong> Visit at different times of day to understand the neighborhood</li></ul>
<h2>Work with Verified Agents</h2>
<p>MBPP's verified agents have been vetted and have documented track records. An experienced agent will:</p>
<ul><li>Help you find properties matching your criteria</li><li>Negotiate on your behalf</li><li>Guide you through the due diligence process</li><li>Connect you with reliable surveyors and lawyers</li></ul>
<h2>Conduct Thorough Inspections</h2>
<p>Before making an offer:</p>
<ul><li>Inspect the property during the day AND evening</li><li>Check water pressure, electrical wiring, and plumbing</li><li>Look for cracks, dampness, and signs of structural issues</li><li>Ask neighbors about the area and the property history</li><li>Engage a professional inspector for high-value purchases</li></ul>
<h2>Understand ALL Costs</h2>
<p>Beyond the purchase price, budget for:</p>
<ul><li>Legal fees (typically 5-10% of purchase price)</li><li>Survey and valuation fees</li><li>Registration fees at KANGIS</li><li>Agency/commission fees</li><li>Renovation and furnishing costs</li><li>First-year property taxes</li></ul>
<h2>Close the Deal Properly</h2>
<p>The closing process should include:</p>
<ol><li>Final verification of all title documents</li><li>Execution of the Deed of Assignment/Conveyance</li><li>Payment (through traceable means, not cash)</li><li>Registration of your interest at the Land Registry</li><li>Collection of all original documents and keys</li></ol>
<p>MBPP's platform helps you find verified properties and connect with trusted professionals for every step of your home-buying journey.</p>`,
      coverImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    },
  ];

  const authorId = admin.id;
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { title: post.title, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage },
      create: { ...post, authorId, published: true, publishedAt: new Date() },
    });
  }
  console.log(`Seeded ${posts.length} blog posts`);
}

async function seedFaqs() {

  const faqs = [
    { question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we will send you a reset link. The link expires in 15 minutes. If you don't see the email, check your spam folder or contact support@mbpproperties.com.", order: 1 },
    { question: "How do I schedule a property viewing?", answer: "Click 'Inquire' on any property page, fill in your name and contact details, and the assigned agent will contact you within 24 hours to arrange a physical or virtual viewing of the property.", order: 2 },
    { question: "What happens after I sign a tenancy agreement?", answer: "Once both you and the landlord sign the agreement digitally on MBPP, it becomes legally binding. You will receive a copy via email. The agent's commission is processed, and you can move in on the agreed start date.", order: 3 },
    { question: "How do I withdraw money from my wallet?", answer: "Go to your Wallet page, click the 'Withdraw' tab, enter the amount and your bank account details, then submit. Withdrawal requests are reviewed by our admin team and processed within 1-2 business days. Minimum withdrawal is N1,000.", order: 4 },
    { question: "Is my personal data safe on MBPP?", answer: "Yes. We comply with the Nigeria Data Protection Regulation (NDPR 2019). Your data is encrypted, stored securely, and never sold to third parties. You can request deletion of your data at any time by contacting admin@mbpproperties.com.", order: 5 },
    { question: "How much does it cost to list a property?", answer: "Listing a property on MBPP costs N5,000 for publication. This one-time fee covers the listing until the property is sold or rented. Featured and premium listing options are available for additional visibility.", order: 6 },
    { question: "How do I become a verified agent?", answer: "Go to the 'Apply as Agent' page, fill in your personal and professional details, and submit your application. Our team reviews all applications and verifies credentials. Approved agents get a verified badge and access to the agent dashboard.", order: 7 },
    { question: "What should I check during a property inspection?", answer: "Check water pressure and quality, electrical wiring and outlets, plumbing for leaks, walls and ceilings for cracks or dampness, doors and windows for proper fitting, security features, and the general condition of the neighborhood. Take photos and notes during the inspection.", order: 8 },
    { question: "What payment methods are accepted?", answer: "We accept payments through Paystack, which supports debit cards (Visa, Mastercard, Verve), bank transfers, and USSD. All transactions are in Nigerian Naira (NGN). Wallet top-ups are instant, while withdrawals take 1-2 business days.", order: 9 },
    { question: "How are disputes between landlords and tenants resolved?", answer: "MBPP encourages direct communication between parties first. If unresolved, our support team can mediate. For serious disputes, the matter may be referred to the Kano State Rent Tribunal or resolved through arbitration under Nigerian law as specified in your tenancy agreement.", order: 10 },
  ];

  for (const faq of faqs) {
    const exists = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!exists) await prisma.faq.create({ data: faq });
  }
  console.log(`Seeded ${faqs.length} FAQs`);
}

async function seedListings() {
  const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (!admin) return;

  const listings = [
    { title: "3-Bedroom Bungalow with Borehole \u2014 Kano Municipal", description: "Spacious 3-bedroom bungalow in a serene environment. Features include a living room, dining area, kitchen, three bedrooms (one en-suite), borehole water supply, and ample parking. Close to Aminu Kano Teaching Hospital.", propertyType: "house", listingType: "sale", city: "Kano Municipal", address: "No. 15 Zaria Road, Kano Municipal", price: 35000000, salePrice: 35000000, bedrooms: 3, bathrooms: 2, sqft: 1800, status: "approved", category: "portfolio", features: ["Borehole", "Parking", "Security"], lat: 12.0022, lng: 8.5387 },
    { title: "Modern 4-Bedroom Duplex \u2014 Nassarawa GRA", description: "Brand new 4-bedroom duplex in Nassarawa GRA. Premium finishes, all rooms en-suite, 2 living rooms, modern kitchen, swimming pool, fully fenced with CCTV security. Perfect for a large family or corporate residence.", propertyType: "house", listingType: "sale", city: "Nassarawa", address: "Block 7, GRA Extension, Nassarawa", price: 65000000, salePrice: 65000000, bedrooms: 4, bathrooms: 5, sqft: 3200, status: "approved", category: "portfolio", features: ["Pool", "CCTV", "Furnished", "Security"], lat: 11.9972, lng: 8.5127 },
    { title: "2-Bedroom Flat for Rent \u2014 Fagge", description: "Well-maintained 2-bedroom flat in Fagge. Close to Sabon Gari market and major roads. Includes water supply, prepaid meter, tiled floors, and a balcony. Ideal for working professionals or small families.", propertyType: "flat", listingType: "rent", city: "Fagge", address: "Block C, Ibrahim Taiwo Road, Fagge", price: 1200000, annualRent: 1200000, rentTier: "rent_only", bedrooms: 2, bathrooms: 1, sqft: 950, status: "approved", category: "portfolio", features: ["Parking", "Security"], lat: 11.9944, lng: 8.5339 },
    { title: "3-Bedroom Flat Near Bayero University \u2014 Tarauni", description: "Modern 3-bedroom flat minutes from Bayero University Kano. Perfect for staff or student accommodation. Features spacious rooms, fitted kitchen, constant water supply, and secure compound. Strong rental income potential.", propertyType: "flat", listingType: "rent", city: "Tarauni", address: "Gidan Murtala, off Bayero University Road, Tarauni", price: 1800000, annualRent: 1800000, rentTier: "rent_damages", bedrooms: 3, bathrooms: 2, sqft: 1400, status: "approved", category: "portfolio", features: ["Borehole", "Security", "Parking"], lat: 11.9810, lng: 8.4833 },
    { title: "2-Bedroom Bungalow for Rent \u2014 Kano Municipal", description: "Cozy 2-bedroom bungalow in a quiet neighborhood in Kano Municipal. Features living room, kitchen, 2 bedrooms, bathroom, and a small garden. Walking distance to local markets and schools. Affordable and well-maintained.", propertyType: "house", listingType: "rent", city: "Kano Municipal", address: "No. 42 Bompai Road, Kano Municipal", price: 800000, annualRent: 800000, rentTier: "rent_only", bedrooms: 2, bathrooms: 1, sqft: 750, status: "approved", category: "portfolio", features: [], lat: 12.0100, lng: 8.5300 },
    { title: "Plot of Land \u2014 Residential Zone, Tarauni", description: "Prime 600sqm plot of land in a fast-developing residential area of Tarauni. Close to new road developments and Bayero University. Ideal for building a residential property or as a land banking investment. Clear C of O available.", propertyType: "land", listingType: "sale", city: "Tarauni", address: "Plot 89, New Layout, Tarauni", price: 4500000, salePrice: 4500000, sqft: 6458, status: "approved", category: "portfolio", features: [], lat: 11.9750, lng: 8.4900 },
    { title: "Commercial Shop Space \u2014 Sabon Gari Market Area, Fagge", description: "Prime commercial shop space on a busy road near Sabon Gari Market. High foot traffic area suitable for retail, wholesale, or office use. Includes storage room, toilet, and secure rolling shutters. 24/7 security in the complex.", propertyType: "commercial", listingType: "rent", city: "Fagge", address: "Shop 12, Alhaji Plaza, Sabon Gari, Fagge", price: 2500000, annualRent: 2500000, rentTier: "rent_full", bedrooms: 0, bathrooms: 1, sqft: 500, status: "approved", category: "portfolio", features: ["Security", "CCTV"], lat: 11.9977, lng: 8.5199 },
    { title: "Half-Acre Farmland \u2014 Outskirts of Kano Municipal", description: "Half-acre of agricultural land with access to irrigation. Suitable for farming, poultry, or fish farming. Located on the outskirts of Kano Municipal with good road access. Ideal for agribusiness investment.", propertyType: "land", listingType: "sale", city: "Kano Municipal", address: "Along Zaria Expressway, Kano Municipal", price: 2200000, salePrice: 2200000, sqft: 21780, status: "approved", category: "portfolio", features: ["Borehole"], lat: 12.0500, lng: 8.6000 },
  ];

  for (const l of listings) {
    const exists = await prisma.listing.findFirst({ where: { title: l.title } });
    if (!exists) {
      await prisma.listing.create({
        data: { ...l, postedById: admin.id } as any,
      });
    }
  }
  console.log(`Seeded ${listings.length} listings`);
}

async function seedAuditLogs() {
  const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (!admin) return;
  const existing = await prisma.auditLog.count();
  if (existing >= 3) return;

  const logs = [
    { action: "SEED_DATABASE", entity: "System", entityId: "seed", userId: admin.id, details: { version: "1.0" } },
    { action: "INITIAL_SETUP", entity: "Settings", entityId: "brand", userId: admin.id, details: { colors: "#0d6e4e, #f97316, #facc15" } },
    { action: "USER_CREATED", entity: "User", entityId: admin.id, userId: admin.id, details: { role: "head", email: ADMIN_EMAIL } },
    { action: "COMMISSION_RATES_SEEDED", entity: "CommissionRate", entityId: "rates", userId: admin.id, details: { count: 5 } },
  ];
  for (const log of logs) {
    await prisma.auditLog.create({ data: log });
  }
  console.log(`Seeded ${logs.length} audit logs`);
}

async function main() {
  console.log("Seeding database...");

  // Always run these
  await seedSettings();
  await seedAdminPermissions();
  await seedBlogPosts();
  await seedFaqs();
  await seedListings();
  await seedAuditLogs();

  // Skip user creation if admin exists
  const existing = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log("Admin already exists. Skipping user/commission creation.");
    console.log("Seed complete!");
    return;
  }

  // First-time setup below
  const oldUsers = await prisma.user.findMany({ where: { email: { contains: "@propease.ng" } } });
  for (const u of oldUsers) {
    const newEmail = u.email.replace("@propease.ng", "@mbpproperties.com").replace("sani@", "admin@");
    await prisma.user.update({ where: { id: u.id }, data: { email: newEmail } });
  }

  const cityData = [
    { name: "Kano Municipal", state: "Kano" },
    { name: "Fagge", state: "Kano" },
    { name: "Tarauni", state: "Kano" },
    { name: "Nassarawa", state: "Kano" },
  ];
  for (const c of cityData) {
    await prisma.city.upsert({ where: { name_state: c }, update: {}, create: c });
  }

  const password = await bcrypt.hash("password123", 12);
  await prisma.user.create({
    data: {
      name: "Admin", email: ADMIN_EMAIL, password, role: "head", isApproved: true,
      canCreateTasks: true, canCloseDeals: true, canCreateListings: true,
      canManageUsers: true, canManageContent: true, canViewAnalytics: true, canManageAgreements: true,
    },
  });

  await prisma.commissionRate.createMany({
    data: [
      { dealType: "rent_normal", totalRate: 5, ambassadorRate: 3, agentRate: 2 },
      { dealType: "rent_damages", totalRate: 8, ambassadorRate: 5, agentRate: 3 },
      { dealType: "rent_full", totalRate: 10, ambassadorRate: 6, agentRate: 4 },
      { dealType: "sale", totalRate: 6, ambassadorRate: 3.5, agentRate: 2.5 },
      { dealType: "partnership", totalRate: 15, ambassadorRate: 8, agentRate: 5 },
    ],
  });

  console.log("Seed complete!");
  console.log("Admin account: admin@mbpproperties.com / password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
