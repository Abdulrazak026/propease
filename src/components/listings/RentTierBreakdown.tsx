import { Listing } from "@/lib/types";
import { formatNaira, rentTierLabels } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface RentTierBreakdownProps {
  listing: Listing;
}

export default function RentTierBreakdown({ listing }: RentTierBreakdownProps) {
  if (listing.listingType !== "rent" || !listing.rentTier) return null;

  const breakdown: { label: string; amount: number; info?: string }[] = [];

  breakdown.push({ label: "Annual Rent", amount: listing.annualRent || 0, info: "Paid yearly upfront" });

  if (listing.rentTier === "damages" || listing.rentTier === "full") {
    breakdown.push({ label: "Damage Deposit", amount: listing.damageDeposit || 0, info: "Refundable" });
  }

  if (listing.rentTier === "full") {
    breakdown.push({ label: "Maintenance Charge", amount: listing.maintenanceCharge || 0, info: "Non-refundable" });
  }

  const total = breakdown.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">Payment Breakdown</h3>
        <Badge variant="info">{rentTierLabels[listing.rentTier]}</Badge>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div>
              <span className="text-sm text-gray-700">{item.label}</span>
              {item.info && (
                <span className="text-xs text-gray-400 ml-1.5">({item.info})</span>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-900">{formatNaira(item.amount)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Total Due on Signing</span>
        <span className="text-lg font-bold text-[var(--color-primary)]">{formatNaira(total)}</span>
      </div>
    </div>
  );
}
