SELECT key, LEFT(value, 30) FROM "SiteSettings" WHERE key LIKE '%resend%' OR key LIKE '%email%' OR key LIKE '%mail%' LIMIT 10;
