export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-US")}`;
}

export function formatNairaPerYear(amount: number): string {
  return `₦${amount.toLocaleString("en-US")}/yr`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const rentTierLabels: Record<string, string> = {
  rent_only: "Rent Only",
  rent_management: "Rent + Management",
  rent_full: "Rent + Management + Inspection",
};

export const propertyTypeLabels: Record<string, string> = {
  house: "House",
  land: "Land",
  flat: "Flat",
  commercial: "Commercial",
  other: "Other",
};

export const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-amber-100 text-amber-800",
  taken: "bg-gray-100 text-gray-800",
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-800",
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  responded: "bg-emerald-100 text-emerald-800",
};

const BACKEND_URL = "https://propease-production.up.railway.app";

export function resolveImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
