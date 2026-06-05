import { Router, Response } from "express";

const router = Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_API = "https://api.paystack.co";

router.post("/initialize", async (req, res: Response) => {
  try {
    const { email, amount, metadata } = req.body;
    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        currency: "NGN",
        metadata,
        callback_url: `${req.headers.origin}/wallet?paystack_callback=1`,
      }),
    });
    const data = await response.json();
    if (!data.status) return res.status(400).json({ error: data.message });
    res.json(data.data);
  } catch (error) {
    console.error("Paystack init error:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

router.get("/verify/:reference", async (req, res: Response) => {
  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/verify/${req.params.reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json();
    if (!data.status) return res.status(400).json({ error: data.message });
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
