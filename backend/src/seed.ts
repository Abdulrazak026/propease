import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Skip if admin already exists
  const existing = await prisma.user.findFirst({ where: { email: "admin@mbpproperties.com" } });
  if (existing) {
    console.log("Database already seeded. Skipping.");
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
