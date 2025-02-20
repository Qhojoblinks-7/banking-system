import { useState, useEffect } from "react";
import axios from "axios";

const Withdrawals = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("ATM Withdrawal");
  const [withdrawDate, setWithdrawDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/api/balance");
      setAccounts(response.data.accounts || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const userId = "USER_ID_HERE"; // Replace with actual user ID
      const response = await axios.get(`/api/transactions/${userId}`);
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleAccountChange = (e) => {
    const selected = accounts.find(acc => acc.account_number === e.target.value);
    setSelectedAccount(selected);
    setBalance(selected ? selected.balance : 0);
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!selectedAccount) return setError("Please select an account.");
    if (withdrawAmount <= 0 || withdrawAmount > balance) return setError("Invalid withdrawal amount.");

    setLoading(true);
    try {
      const response = await axios.post("/api/withdraw", {
        account_number: selectedAccount.account_number,
        amount: withdrawAmount,
        method: withdrawMethod,
        scheduled_date: withdrawDate || null,
      });

      setMessage("Withdrawal successful!");
      setWithdrawAmount("");
      setWithdrawDate("");
      fetchAccounts();
      fetchTransactions();
    } catch (err) {
      setError("Withdrawal failed. Please try again.");
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
          {/* Account Selection */}
          <label className="block text-gray-600">Select Account</label>
          <select
            onChange={handleAccountChange}
            className="w-full p-2 border rounded-md mt-2 mb-4"
          >
            <option value="">-- Select an account --</option>
            {accounts.map((acc) => (
              <option key={acc.account_number} value={acc.account_number}>
                {acc.account_type} - {acc.account_number} (Balance: ${acc.balance})
              </option>
            ))}
          </select>

          {/* Withdrawal Amount */}
          <label className="block text-gray-600">Amount</label>
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

      {/* Account Summary Sidebar */}
      <aside className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Account Summary</h2>
        <p className="text-gray-600">Current Balance: <span className="font-bold">${balance}</span></p>

        <h3 className="text-lg font-semibold mt-4">Recent Withdrawals</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions.</p>
        ) : (
          <ul className="mt-2">
            {transactions.slice(0, 5).map((txn) => (
              <li key={txn.id} className="p-2 border-b last:border-none">
                <p className="text-gray-800">${txn.amount} - {txn.status}</p>
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
