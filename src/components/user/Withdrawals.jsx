import { useState } from "react";
import { useUser } from "../components/UserContext"; // Import Context API
import axios from "axios";

const Withdrawals = () => {
  const { user, transactions, fetchUserData, fetchTransactions } = useUser(); // Use Context
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("ATM Withdrawal");
  const [withdrawDate, setWithdrawDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Select first account by default
  const selectedAccount = user.accounts?.[0] || null;
  const balance = selectedAccount ? selectedAccount.balance : 0;

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedAccount) return setError("No account found.");
    if (withdrawAmount <= 0 || withdrawAmount > balance) return setError("Invalid withdrawal amount.");

    setLoading(true);
    try {
      const response = await axios.post("/api/withdraw", {
        account_number: selectedAccount.account_number,
        amount: withdrawAmount,
        method: withdrawMethod,
        scheduled_date: withdrawDate || null,
      });

      setMessage("✅ Withdrawal successful!");
      setWithdrawAmount("");
      setWithdrawDate("");
      fetchUserData(); // Refresh balance
      fetchTransactions(); // Refresh transactions
    } catch (err) {
      setError("❌ Withdrawal failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Withdraw Funds</h1>
        <p className="text-sm text-gray-500">Home &gt; Dashboard &gt; Withdraw Funds</p>
      </header>

      {/* Withdrawal Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Withdrawal Form</h2>

        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}

        <form onSubmit={handleWithdrawal}>
          {/* Selected Account Info */}
          <div className="p-3 bg-gray-50 rounded-md shadow-sm">
            <h3 className="text-gray-700 font-semibold">Selected Account</h3>
            <p className="text-sm text-gray-600">{selectedAccount?.account_type} - {selectedAccount?.account_number}</p>
            <p className="text-green-700 font-bold">Balance: GHC {balance.toFixed(2)}</p>
          </div>

          {/* Withdrawal Amount */}
          <label className="block text-gray-600 mt-4">Amount</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
            placeholder="Enter amount"
            required
          />

          {/* Withdrawal Method */}
          <label className="block text-gray-600">Withdrawal Method</label>
          <select
            value={withdrawMethod}
            onChange={(e) => setWithdrawMethod(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
          >
            <option value="ATM Withdrawal">ATM Withdrawal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {/* Scheduled Withdrawal (Optional) */}
          <label className="block text-gray-600">Schedule Withdrawal (Optional)</label>
          <input
            type="date"
            value={withdrawDate}
            onChange={(e) => setWithdrawDate(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Withdraw Funds"}
          </button>
        </form>
      </div>

      {/* Recent Transactions */}
      <aside className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Recent Withdrawals</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions.</p>
        ) : (
          <ul className="mt-2">
            {transactions
              .filter(txn => txn.type === "withdrawal")
              .slice(0, 5)
              .map((txn) => (
                <li key={txn.id} className="p-2 border-b last:border-none">
                  <p className="text-gray-800">GHC {txn.amount} - {txn.status}</p>
                  <p className="text-gray-500 text-sm">{txn.date}</p>
                </li>
              ))}
          </ul>
        )}
      </aside>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Need help? <a href="#" className="text-blue-500">Contact Support</a> | <a href="#" className="text-blue-500">FAQs</a></p>
        <p>All transactions are secured with SSL encryption.</p>
      </footer>
    </div>
  );
};

export default Withdrawals;
