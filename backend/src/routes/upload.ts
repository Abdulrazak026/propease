import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import { authenticate, AuthRequest } from "../middleware/auth";

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = Router();

router.post("/", authenticate, upload.array("files", 10), async (req: AuthRequest, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const urls = files.map((f) => `/uploads/${f.filename}`);
    res.json({ urls, message: `${files.length} files uploaded` });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
