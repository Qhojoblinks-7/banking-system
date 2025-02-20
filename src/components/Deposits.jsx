import { useState, useEffect } from "react";
import { FaRegCreditCard, FaMobileAlt, FaUniversity } from "react-icons/fa";

const DepositPage = () => {
  // Form state
  const [selectedAccount, setSelectedAccount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [scheduledDate, setScheduledDate] = useState("");

  // Data fetched from API
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [error, setError] = useState("");

  // For simulation messages after deposit submission
  const [simMessage, setSimMessage] = useState("");

  // Use a constant userId (replace with context or auth state as needed)
  const userId = "11111111-1111-1111-1111-111111111111";

  // Fetch current account balance from API (/api/balance)
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/balance", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch balance");
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAccount(false);
      }
    };
    fetchBalance();
  }, []);

  // Fetch recent transactions for the user (/api/transactions/:userId)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions/${userId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to load transactions");
        }
        const data = await response.json();
        // Show the most recent 3 transactions
        const recent = data.transactions?.slice(0, 3) || [];
        setTransactions(recent);
      } catch (err) {
        console.error("Error fetching transactions:", err.message);
        setError(err.message);
      } finally {
        setLoadingTx(false);
      }
    };
    fetchTransactions();
  }, [userId]);

  // Handle deposit form submission
  const handleDeposit = async (e) => {
    e.preventDefault();
    setSimMessage("");
    try {
      // Simulate a deposit using the transfer API.
      // Replace 'EXTERNAL-ACCOUNT-ID' with the source account and 
      // 'YOUR-ACCOUNT-ID' with the user's bank account.
      const payload = {
        from_account: "EXTERNAL-ACCOUNT-ID",
        to_account: "YOUR-ACCOUNT-ID",
        amount: Number(depositAmount),
        description: `Deposit via ${paymentMethod}${scheduledDate ? ` on ${scheduledDate}` : ""}`,
      };

      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Deposit simulation failed");
      }
      const data = await response.json();
      setSimMessage("Deposit transaction successful!");
      // Optionally refresh balance and transactions after deposit
      // For simplicity, we refresh by reloading the page:
      window.location.reload();
    } catch (err) {
      console.error("Deposit simulation failed:", err.message);
      setSimMessage(`Error: ${err.message}`);
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
              <div
                className={`mb-4 p-2 rounded text-center ${
                  simMessage.startsWith("Error")
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
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
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
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
                  className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${
                    paymentMethod === "bank_transfer"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <FaUniversity /> Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${
                    paymentMethod === "credit_card"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <FaRegCreditCard /> Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mobile_money")}
                  className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${
                    paymentMethod === "mobile_money"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Confirm Deposit
              </button>
            </form>
          </div>

          {/* Account Summary Sidebar */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Account Summary</h3>
            {loadingAccount ? (
              <p className="text-sm text-gray-600">Loading balance...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">Current Balance</p>
                <h4 className="text-2xl font-bold text-blue-700">
                  {balance !== null ? `GHS ${balance}` : "N/A"}
                </h4>
              </>
            )}
            <hr className="my-3" />
            <h4 className="font-semibold mb-2">Recent Transactions</h4>
            {loadingTx ? (
              <p className="text-sm text-gray-600">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <ul className="text-sm text-gray-600 space-y-2">
                {transactions.slice(0, 3).map((tx) => (
                  <li key={tx.transaction_id}>
                    {tx.transaction_type === "deposit" ? "Deposit" : "Withdrawal"} - GHS{" "}
                    {tx.amount}{" "}
                    <span className={tx.transaction_type === "deposit" ? "text-green-600" : "text-red-600"}>
                      ✔ Completed
                    </span>
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

export default DepositPage;
