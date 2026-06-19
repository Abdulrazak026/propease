// One-time migration: assign agents to existing listings and reassign inquiries
// Run on VPS: npx tsx backend/scripts/migrate-agents.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("=== Agent Migration ===");

  const admin = await prisma.user.findFirst({ where: { email: "admin@mbpproperties.com" } });
  let agent = await prisma.user.findFirst({ where: { role: "agent", suspendedAt: null }, orderBy: { createdAt: "asc" } });

  if (!agent) {
    console.log("No agent found in database. Create an agent user first.");
    return;
  }

  console.log(`Using agent: ${agent.name} (${agent.id})`);

  const updatedListings = await prisma.listing.updateMany({
    where: { assignedAgentId: null },
    data: { assignedAgentId: agent.id },
  });
  console.log(`Listings updated with agent: ${updatedListings.count}`);

  const reassignedInquiries = await prisma.inquiry.updateMany({
    where: { assignedAgentId: admin?.id },
    data: { assignedAgentId: agent.id },
  });
  console.log(`Inquiries reassigned from admin to agent: ${reassignedInquiries.count}`);

  const total = await prisma.inquiry.count();
  const withAgent = await prisma.inquiry.count({ where: { assignedAgentId: { not: null } } });
  console.log(`\nSummary: ${total} inquiries total, ${withAgent} have an agent assigned`);
  console.log("Migration complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
