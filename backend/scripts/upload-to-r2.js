// Upload a file to Cloudflare R2 — used by backup.sh
// Usage: node scripts/upload-to-r2.js <localPath> <remoteKey>

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { readFileSync, statSync } = require("fs");

(async () => {
  const [,, localPath, remoteKey] = process.argv;
  if (!localPath || !remoteKey) {
    console.error("Usage: node upload-to-r2.js <localPath> <remoteKey>");
    process.exit(1);
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BACKUP_BUCKET || process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKey || !secretKey || !bucket) {
    console.error("Missing R2 credentials in environment");
    process.exit(1);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });

  const fileContent = readFileSync(localPath);
  const size = statSync(localPath).size;

  console.log(`[R2] Uploading ${remoteKey} (${(size / 1024 / 1024).toFixed(1)}MB)`);

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: remoteKey,
    Body: fileContent,
    ContentType: "application/gzip",
  }));

  console.log("[R2] Upload complete");
})();
