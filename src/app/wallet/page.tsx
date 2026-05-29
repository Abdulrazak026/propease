"use client";
import { useState, useMemo } from "react";
import { useRole } from "@/context/RoleContext";
import { transactions, users } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type Tab = "overview" | "top-up" | "withdraw";

export default function WalletPage() {
  const { currentUser, setCurrentUser } = useRole();
  const [tab, setTab] = useState<Tab>("overview");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const myTxs = useMemo(() =>
    transactions.filter((t) => t.userId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [currentUser]
  );

  const balance = currentUser?.walletBalance || 0;
  const pending = myTxs.filter((t) => t.status === "pending");
  const completedTx = myTxs.filter((t) => t.status === "completed");

  const handleTopUp = () => {
    if (!topUpAmount || !currentUser) return;
    setShowCardModal(true);
  };

  const confirmTopUp = () => {
    const amount = parseInt(topUpAmount);
    if (!currentUser) return;
    const updated = { ...currentUser, walletBalance: currentUser.walletBalance + amount };
    setCurrentUser(updated);
    setShowCardModal(false);
    setTopUpAmount("");
    setSuccessMsg(`₦${amount.toLocaleString()} added to wallet`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !currentUser) return;
    const amount = parseInt(withdrawAmount);
    if (amount > balance) { alert("Insufficient balance"); return; }
    const updated = { ...currentUser, walletBalance: currentUser.walletBalance - amount };
    setCurrentUser(updated);
    setWithdrawAmount("");
    setSuccessMsg(`Withdrawal of ₦${amount.toLocaleString()} submitted for approval`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Transactions" },
    { key: "top-up", label: "Top Up" },
    { key: "withdraw", label: "Withdraw" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your funds and transactions</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Available Balance</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">{formatNaira(balance)}</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 animate-fade-in-up">
          {successMsg}
        </div>
      )}

      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCardModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Confirm Top-Up</h3>
            <p className="text-sm text-gray-500 mb-4">Simulating card payment of <strong>{formatNaira(parseInt(topUpAmount))}</strong></p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Card</span><span className="text-gray-900">**** 4829</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="text-gray-900 font-medium">{formatNaira(parseInt(topUpAmount))}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Fee</span><span className="text-gray-900">Free</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCardModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={confirmTopUp}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 bg-white rounded-xl border border-gray-200/60 p-1 shadow-sm">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === t.key ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Transaction History</h2>
            {pending.length > 0 && <Badge variant="warning">{pending.length} pending</Badge>}
          </div>
          {myTxs.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {myTxs.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-500">{tx.reference}</td>
                    <td className="px-4 py-3.5 text-xs capitalize text-gray-700">{tx.type.replace("_", " ")}</td>
                    <td className={`px-4 py-3.5 text-sm text-right font-medium ${tx.type === "payment" || tx.type === "withdrawal" ? "text-red-600" : "text-emerald-600"}`}>
                      {tx.type === "payment" || tx.type === "withdrawal" ? "-" : "+"}{formatNaira(tx.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-xs capitalize text-gray-500">{tx.method}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "danger"}>{tx.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-right text-gray-400">{tx.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">No transactions yet</p>
          )}
        </div>
      )}

      {tab === "top-up" && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm max-w-md">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Add Funds</h2>
          <p className="text-xs text-gray-500 mb-4">Enter amount to add to your wallet. Card payment simulation.</p>
          <div className="flex gap-2 mb-3">
            {[10000, 25000, 50000, 100000].map((amt) => (
              <button key={amt} onClick={() => setTopUpAmount(amt.toString())}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${topUpAmount === amt.toString() ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >{formatNaira(amt)}</button>
            ))}
          </div>
          <input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="Or enter custom amount" min="1000"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 mb-4"
          />
          <Button className="w-full" disabled={!topUpAmount || parseInt(topUpAmount) < 1000} onClick={handleTopUp}>
            Add {topUpAmount ? formatNaira(parseInt(topUpAmount)) : "Funds"}
          </Button>
        </div>
      )}

      {tab === "withdraw" && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm max-w-md">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Withdraw Funds</h2>
          <p className="text-xs text-gray-500 mb-4">Request a withdrawal to your bank account. Subject to admin approval.</p>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" min="1000"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
              <p className="text-xs text-gray-400 mt-1">Balance: {formatNaira(balance)}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
              <input defaultValue="GTBank" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
              <input defaultValue="0123456789" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20" />
            </div>
          </div>
          <Button className="w-full" disabled={!withdrawAmount || parseInt(withdrawAmount) < 1000 || parseInt(withdrawAmount) > balance} onClick={handleWithdraw}>
            Request Withdrawal
          </Button>
        </div>
      )}
    </div>
  );
}
