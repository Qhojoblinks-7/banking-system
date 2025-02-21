import { useState } from "react";
import { useUser } from "../components/UserContext"; // Import global user context
import { FaRegCreditCard, FaMobileAlt, FaUniversity } from "react-icons/fa";

const Deposits = () => {
  const { user, token } = useUser(); // Get user data and token from context
  const [selectedAccount, setSelectedAccount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [scheduledDate, setScheduledDate] = useState("");
  const [simMessage, setSimMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch balance and transactions from global state
  const balance = user?.balance || 0;
  const transactions = user?.transactions || [];

  // Handle deposit form submission
  const handleDeposit = async (e) => {
    e.preventDefault();
    setSimMessage("");
    setLoading(true);

    try {
      const payload = {
        from_account: "EXTERNAL-ACCOUNT-ID",
        to_account: user.account_id, // Get user account ID from context
        amount: Number(depositAmount),
        description: `Deposit via ${paymentMethod}${scheduledDate ? ` on ${scheduledDate}` : ""}`,
      };

      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Deposit simulation failed");
      }

      setSimMessage("✅ Deposit transaction successful!");
      // Update user state globally instead of reloading the page
      user.balance += Number(depositAmount);
    } catch (err) {
      setSimMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Deposit Funds</h2>
        <p className="text-sm text-gray-500">Securely add funds to your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deposit Form */}
        <div className="md:col-span-2 bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Deposit Details</h3>
          {simMessage && (
            <div className={`mb-4 p-2 rounded text-center ${simMessage.startsWith("❌") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
              {simMessage}
            </div>
          )}
          <form onSubmit={handleDeposit}>
            {/* Account Selection */}
            <label className="block font-medium">Select Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-2 mt-1 mb-3 border rounded-lg"
              required
            >
              <option value="">-- Choose Account --</option>
              {user?.accounts?.map((acc) => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_type} ({acc.account_number})
                </option>
              ))}
            </select>

            {/* Deposit Amount */}
            <label className="block font-medium">Deposit Amount</label>
            <input
              type="number"
              placeholder="Enter amount (GHS)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2 mt-1 mb-3 border rounded-lg"
              required
            />

            {/* Payment Method Options */}
            <label className="block font-medium">Payment Method</label>
            <div className="flex gap-3 mt-2 mb-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${paymentMethod === "bank_transfer" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                <FaUniversity /> Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("credit_card")}
                className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${paymentMethod === "credit_card" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                <FaRegCreditCard /> Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${paymentMethod === "mobile_money" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                <FaMobileAlt /> Mobile Money
              </button>
            </div>

            {/* Date Picker */}
            <label className="block font-medium">Schedule Deposit</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full p-2 mt-1 mb-4 border rounded-lg"
            />

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700" disabled={loading}>
              {loading ? "Processing..." : "Confirm Deposit"}
            </button>
          </form>
        </div>

        {/* Account Summary Sidebar */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Account Summary</h3>
          <p className="text-sm text-gray-600">Current Balance</p>
          <h4 className="text-2xl font-bold text-blue-700">
            {balance !== null ? `GHS ${balance.toFixed(2)}` : "N/A"}
          </h4>
          <hr className="my-3" />
          <h4 className="font-semibold mb-2">Recent Transactions</h4>
          {transactions.length > 0 ? (
            <ul className="text-sm text-gray-600 space-y-2">
              {transactions.slice(0, 3).map((tx) => (
                <li key={tx.transaction_id}>
                  {tx.transaction_type === "deposit" ? "Deposit" : "Withdrawal"} - GHS {tx.amount}{" "}
                  <span className={tx.transaction_type === "deposit" ? "text-green-600" : "text-red-600"}>✔ Completed</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No recent transactions found.</p>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need help? <a href="#" className="text-blue-600">Contact Support</a>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          All transactions are secured with SSL encryption.
        </p>
      </div>
    </div>
  );
};

export default Deposits;
