import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Create cities
  const cities = await Promise.all([
    prisma.city.create({ data: { name: "Kano Municipal", state: "Kano" } }),
    prisma.city.create({ data: { name: "Fagge", state: "Kano" } }),
    prisma.city.create({ data: { name: "Tarauni", state: "Kano" } }),
    prisma.city.create({ data: { name: "Nassarawa", state: "Kano" } }),
  ]);

  const password = await bcrypt.hash("password123", 12);

  // Create head
  const head = await prisma.user.create({
    data: {
      name: "Sani Abubakar",
      email: "sani@propease.ng",
      password,
      role: "head",
      isApproved: true,
    },
  });

  // Create ambassadors
  const aisha = await prisma.user.create({
    data: {
      name: "Aisha Bello",
      email: "aisha@propease.ng",
      password,
      role: "ambassador",
      city: "Kano Municipal",
      isApproved: true,
      canCreateTasks: true,
    },
  });

  const musa = await prisma.user.create({
    data: {
      name: "Musa Ibrahim",
      email: "musa@propease.ng",
      password,
      role: "ambassador",
      city: "Fagge",
      isApproved: true,
      canCreateTasks: false,
    },
  });

  // Assign ambassadors to cities
  await prisma.userCity.createMany({
    data: [
      { userId: aisha.id, cityId: cities[0].id },
      { userId: aisha.id, cityId: cities[2].id },
      { userId: musa.id, cityId: cities[1].id },
      { userId: musa.id, cityId: cities[3].id },
    ],
  });

  // Create agents
  const fatima = await prisma.user.create({
    data: {
      name: "Fatima Usman",
      email: "fatima@propease.ng",
      password,
      role: "agent",
      city: "Kano Municipal",
      isApproved: true,
      ambassadorId: aisha.id,
      walletBalance: 89000,
    },
  });

  const zainab = await prisma.user.create({
    data: {
      name: "Zainab Adamu",
      email: "zainab@propease.ng",
      password,
      role: "agent",
      city: "Kano Municipal",
      isApproved: true,
      ambassadorId: aisha.id,
      canCloseDeals: true,
      walletBalance: 62000,
    },
  });

  const ahmad = await prisma.user.create({
    data: {
      name: "Ahmad Suleiman",
      email: "ahmad@propease.ng",
      password,
      role: "agent",
      city: "Fagge",
      isApproved: true,
      ambassadorId: musa.id,
      walletBalance: 45000,
    },
  });

  const halima = await prisma.user.create({
    data: {
      name: "Halima Garba",
      email: "halima@propease.ng",
      password,
      role: "agent",
      city: "Fagge",
      isApproved: true,
      ambassadorId: musa.id,
      walletBalance: 31000,
    },
  });

  // Create commission rates
  await prisma.commissionRate.createMany({
    data: [
      { dealType: "rent_normal", totalRate: 5, ambassadorRate: 3, agentRate: 2 },
      { dealType: "rent_damages", totalRate: 8, ambassadorRate: 5, agentRate: 3 },
      { dealType: "rent_full", totalRate: 10, ambassadorRate: 6, agentRate: 4 },
      { dealType: "sale", totalRate: 6, ambassadorRate: 3.5, agentRate: 2.5 },
      { dealType: "partnership", totalRate: 15, ambassadorRate: 8, agentRate: 5 },
    ],
  });

  // Create listings
  const listing1 = await prisma.listing.create({
    data: {
      title: "4-Bedroom Duplex — Kano Municipal",
      description: "A spacious 4-bedroom duplex in the heart of Kano Municipal. Features include borehole, 24/7 security, and parking.",
      propertyType: "house",
      listingType: "rent",
      rentTier: "full",
      annualRent: 1800000,
      damageDeposit: 200000,
      maintenanceCharge: 100000,
      status: "available",
      category: "portfolio",
      lat: 12.001, lng: 8.5245,
      address: "No. 15 Sultan Road, Kano Municipal",
      city: "Kano Municipal",
      bedrooms: 4, bathrooms: 4, sqft: 2800,
      price: 1800000,
      postedById: head.id,
      assignedAgentId: fatima.id,
    },
  });

  const listing5 = await prisma.listing.create({
    data: {
      title: "Luxury 5-Bedroom Villa — Nassarawa",
      description: "Premium villa in Nassarawa GRA. Italian marble, central AC, pool, staff quarters.",
      propertyType: "house",
      listingType: "rent",
      rentTier: "full",
      annualRent: 5000000,
      damageDeposit: 500000,
      maintenanceCharge: 250000,
      status: "available",
      category: "portfolio",
      lat: 11.983, lng: 8.512,
      address: "No. 8 GRA Road, Nassarawa",
      city: "Nassarawa",
      bedrooms: 5, bathrooms: 5, sqft: 4500,
      price: 5000000,
      postedById: musa.id,
    },
  });

  // Create tasks
  await prisma.task.create({
    data: {
      title: "Find 3-bedroom house in Kano Municipal",
      description: "Client looking for a 3-bedroom house for rent. Budget up to ₦1.5M/yr.",
      propertyType: "house",
      area: "Kano Municipal",
      budget: 1500000,
      deadline: new Date("2026-06-15"),
      notes: "Quiet neighborhood, good schools nearby.",
      status: "in_progress",
      createdById: aisha.id,
      assignedToId: fatima.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Land plot for client in Tarauni",
      description: "Client wants to buy land in Tarauni for residential construction. C of O required.",
      propertyType: "land",
      area: "Tarauni",
      budget: 7000000,
      deadline: new Date("2026-06-30"),
      status: "open",
      source: "client_request",
      createdById: aisha.id,
      assignedToId: zainab.id,
    },
  });

  // Create a commission record for demo
  await prisma.commission.create({
    data: {
      dealId: "demo-deal-1",
      dealTitle: "Warehouse Space — Fagge",
      dealType: "rent_damages",
      totalAmount: 2400000,
      ambassadorRate: 8,
      ambassadorCut: 192000,
      agentRate: 5,
      agentCut: 120000,
      companyCut: 2088000,
      ambassadorId: musa.id,
      agentId: zainab.id,
    },
  });

  // Create inquiries
  await prisma.inquiry.create({
    data: {
      clientName: "Dr. Amina Yusuf",
      clientContact: "0803 123 4567",
      message: "Is the 4-bedroom duplex still available? Would like to schedule a viewing.",
      listingId: listing1.id,
      assignedAgentId: fatima.id,
      status: "new",
    },
  });

  console.log("Seed complete!");
  console.log("Demo accounts (password: password123):");
  console.log("  sani@propease.ng (head)");
  console.log("  aisha@propease.ng (ambassador)");
  console.log("  fatima@propease.ng (agent)");
  console.log("  zainab@propease.ng (agent)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
