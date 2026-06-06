import { Router, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize, requirePermission } from "../middleware/rbac";
import { logger } from "../lib/logger";

const router = Router();

// Local uploads directory as fallback
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

async function uploadToR2(filePath: string, fileName: string, mimeType: string): Promise<string | null> {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKey || !secretKey || !bucket) return null;

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    });

    const fileContent = await fs.promises.readFile(filePath);
    const key = `uploads/${fileName}`;

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileContent,
      ContentType: mimeType,
    }));

    return `${process.env.R2_PUBLIC_URL || `https://pub-${accountId}.r2.dev`}/${key}`;
  } catch (err) {
    logger.error({ err }, "R2 upload failed");
    return null;
  }
}

router.post("/", authenticate, authorize("head", "ambassador"), requirePermission("canManageContent"), upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    let url = `/uploads/${req.file.filename}`;

    const r2Url = await uploadToR2(req.file.path, req.file.filename, req.file.mimetype);
    if (r2Url) url = r2Url;

    await prisma.mediaFile.create({
      data: {
        key: req.file.filename,
        url,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user!.id,
      },
    });

    res.json({ url, filename: req.file.originalname });
  } catch (error) {
    logger.error({ err: error }, "Upload error");
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/", authenticate, authorize("head"), requirePermission("canManageContent"), async (_req: AuthRequest, res: Response) => {
  try {
    const files = await prisma.mediaFile.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

router.delete("/:id", authenticate, authorize("head"), requirePermission("canManageContent"), async (req: AuthRequest, res: Response) => {
  try {
    const file = await prisma.mediaFile.findUnique({ where: { id: req.params.id as string } });
    if (!file) return res.status(404).json({ error: "File not found" });

    const localPath = path.join(uploadsDir, file.key);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    await prisma.mediaFile.delete({ where: { id: file.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;