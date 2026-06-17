SELECT 
  (SELECT COUNT(*) FROM "SiteSettings") AS settings,
  (SELECT COUNT(*) FROM "User") AS users,
  (SELECT COUNT(*) FROM "Listing") AS listings,
  (SELECT COUNT(*) FROM "MediaFile") AS media;
