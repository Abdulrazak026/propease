import { Resend } from "resend";

let resendInstance: Resend | null = null;
let lastKey = "";

async function getApiKey(): Promise<string> {
  const envKey = process.env.RESEND_API_KEY;
  if (envKey) return envKey;
  try {
    const prisma = (await import("./prisma")).default;
    const row = await prisma.siteSettings.findUnique({ where: { key: "resend_api_key" } });
    return row?.value || "";
  } catch {
    return "";
  }
}

export async function getResend(): Promise<Resend> {
  const key = await getApiKey();
  if (!key) return new Resend("");
  if (!resendInstance || key !== lastKey) {
    resendInstance = new Resend(key);
    lastKey = key;
  }
  return resendInstance;
}

export const FROM_ADDRESS = "MBPP <support@mbpproperties.com>";
export const SUPPORT_ADDRESS = "support@mbpproperties.com";
