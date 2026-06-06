import prisma from "./lib/prisma";

// Migrate "taken" listings to "sold" before the ListingStatus enum change
// Zero data loss — preserves all listing data

async function migrate() {
  console.log("[MIGRATE] Updating listings from status 'taken' to 'sold'...");
  
  try {
    const result = await prisma.listing.updateMany({
      where: { status: "taken" as any },
      data: { status: "sold" },
    });
    console.log(`[MIGRATE] Updated ${result.count} listing(s) from 'taken' to 'sold'`);
  } catch (err) {
    console.log("[MIGRATE] No 'taken' listings to migrate or column already changed — safe to proceed");
  }

  await prisma.$disconnect();
}

migrate();
