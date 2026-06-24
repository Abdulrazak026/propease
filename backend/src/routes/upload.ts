import { Router, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize, requirePermission } from "../middleware/rbac";
import { logger } from "../lib/logger";

// Lazy-load sharp (may not be available on all platforms)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharpModule: any = null;
try {
  sharpModule = require("sharp");
} catch {
  logger.warn("sharp not available — image optimization disabled");
}

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

// Optimize image with sharp: resize + convert to WebP at best quality
async function optimizeImage(filePath: string): Promise<{ path: string; filename: string; mimeType: string; size: number } | null> {
  if (!sharpModule) return null;
  try {
    const image = sharpModule(filePath);
    const metadata = await image.metadata();

    // Skip non-image files (PDFs, videos)
    if (!metadata.width || !metadata.height) return null;

    // Only resize if wider than 1600px
    let pipeline = image;
    if (metadata.width > 1600) {
      pipeline = pipeline.resize(1600, undefined, { withoutEnlargement: true });
    }

    // Convert to WebP at 90% quality (visually lossless)
    const webpBuffer = await pipeline.webp({ quality: 90 }).toBuffer();

    // Generate new filename
    const newFilename = `${uuidv4()}.webp`;
    const newPath = path.join(uploadsDir, newFilename);

    // Write optimized file
    await fs.promises.writeFile(newPath, webpBuffer);

    // Delete original file
    await fs.promises.unlink(filePath);

    return {
      path: newPath,
      filename: newFilename,
      mimeType: "image/webp",
      size: webpBuffer.length,
    };
  } catch (err) {
    logger.error({ err }, "Image optimization failed — serving original");
    return null;
  }
}

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

// Public file serving — no auth required
router.get("/file/:filename", async (req, res: Response) => {
  try {
    const filename = req.params.filename as string;
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: "Failed to serve file" });
  }
});

router.post("/", authenticate, authorize("head", "ambassador", "agent"), upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    let filePath = req.file.path;
    let filename = req.file.filename;
    let mimeType = req.file.mimetype;
    let fileSize = req.file.size;

    // Optimize images (not videos or PDFs)
    if (mimeType.startsWith("image/") && mimeType !== "image/gif") {
      const optimized = await optimizeImage(filePath);
      if (optimized) {
        filePath = optimized.path;
        filename = optimized.filename;
        mimeType = optimized.mimeType;
        fileSize = optimized.size;
        logger.info({ original: req.file.size, optimized: fileSize, reduction: `${Math.round((1 - fileSize / req.file.size) * 100)}%` }, "Image optimized");
      }
    }

    let url = `/api/upload/file/${filename}`;

    const r2Url = await uploadToR2(filePath, filename, mimeType);
    if (r2Url) url = r2Url;

    await prisma.mediaFile.create({
      data: {
        key: filename,
        url,
        filename: req.file.originalname,
        mimeType,
        size: fileSize,
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