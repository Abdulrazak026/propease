SELECT lp.url, l.title FROM "ListingPhoto" lp JOIN "Listing" l ON lp."listingId" = l.id LIMIT 20;
