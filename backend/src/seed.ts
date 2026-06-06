import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Always seed/update site settings (runs every deploy)
  const settings = {
    site_name: "MBPP",
    site_tagline: "Find Your Dream Property in Kano",
    primary_color: "#0d6e4e",
    secondary_color: "#f97316",
    accent_color: "#facc15",
    heading_font: "Inter",
    body_font: "Inter",
    meta_title: "MBPP — Real Estate Marketplace, Kano",
    meta_description: "Find verified houses, land, flats and commercial properties for rent and sale in Kano, Nigeria. Your trusted real estate marketplace.",
    support_email: "support@mbpproperties.com",
    support_phone: "",
    support_whatsapp: "",
    office_address: "Kano Municipal, Kano State, Nigeria",
    business_hours: "Mon–Fri 8AM–6PM, Sat 9AM–2PM",
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
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // Skip user seeding if admin already exists
  const existing = await prisma.user.findFirst({ where: { email: "admin@mbpproperties.com" } });
  if (existing) {
    console.log("Database already seeded. Skipping user/commission creation.");
    return;
  }

  // Update any old @propease.ng users
  const oldUsers = await prisma.user.findMany({ where: { email: { contains: "@propease.ng" } } });
  for (const u of oldUsers) {
    const newEmail = u.email.replace("@propease.ng", "@mbpproperties.com").replace("sani@", "admin@");
    await prisma.user.update({ where: { id: u.id }, data: { email: newEmail } });
  }

  // Create cities
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

  // Create only admin user
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@mbpproperties.com",
      password,
      role: "head",
      isApproved: true,
    },
  });

  // Commission rates
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
