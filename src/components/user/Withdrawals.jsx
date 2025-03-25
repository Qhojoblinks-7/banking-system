import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdraw } from "../store/withdrawSlice";
import { fetchUser } from "../store/userSlice";
import { addTransaction } from "../store/transactionsSlice"; // Assuming this slice exists

const Withdrawals = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const user = useSelector((state) => state.user.user);
  const accounts = useSelector((state) => state.user.accounts);
  const withdrawStatus = useSelector((state) => state.withdraw.status);
  const withdrawError = useSelector((state) => state.withdraw.error);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("ATM Withdrawal");
  const [withdrawDate, setWithdrawDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);

  useEffect(() => {
    if (accounts?.length > 0) {
      setSelectedAccount(accounts[0].account_number);
    }
  }, [accounts]);

  useEffect(() => {
    if (selectedAccount) {
      const accountDetails = accounts?.find(
        (acc) => acc.account_number === selectedAccount
      );
      setSelectedAccountDetails(accountDetails);
    } else {
      setSelectedAccountDetails(null);
    }
  }, [selectedAccount, accounts]);

  useEffect(() => {
    if (withdrawStatus === "loading") {
      setLoading(true);
      setMessage("");
      setError("");
    } else if (withdrawStatus === "succeeded") {
      setLoading(false);
      setMessage("✅ Withdrawal successful!");
      setWithdrawAmount("");
      setWithdrawDate("");
      dispatch(fetchUser()); // Refetch user data to update balance
    } else if (withdrawStatus === "failed") {
      setLoading(false);
      setError(`❌ Withdrawal failed. ${withdrawError || "Please try again."}`);
    }
  }, [withdrawStatus, withdrawError, dispatch]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const account = accounts.find((acc) => acc.account_number === selectedAccount);
    if (!account) {
      setError("No account found.");
      return;
    }
    if (withdrawAmount <= 0 || withdrawAmount > account.balance) {
      setError("Invalid withdrawal amount.");
      return;
    }

    const payload = {
      account_number: account.account_number,
      amount: Number(withdrawAmount),
      method: withdrawMethod,
      scheduled_date: withdrawDate || null,
    };

    dispatch(withdraw(payload));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Withdraw Funds</h1>
        <p className="text-sm text-gray-500">
          Home &gt; Dashboard &gt; Withdraw Funds
        </p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Withdrawal Form</h2>

        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}

        <form onSubmit={handleWithdrawal}>
          <label className="block text-gray-600 mt-4">Select Account</label>
          <select
            value={selectedAccount || ""}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
          >
            {accounts?.map((acc) => (
              <option key={acc.account_number} value={acc.account_number}>
                {acc.account_type}
              </option>
            ))}
          </select>

          {selectedAccountDetails && (
            <div className="mt-2">
              <p>
                {selectedAccountDetails.account_type} - GHC{" "}
                {selectedAccountDetails.balance?.toFixed(2)}
              </p>
            </div>
          )}

          <label className="block text-gray-600">Amount</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
            placeholder="Enter amount"
            required
          />

          <label className="block text-gray-600">Withdrawal Method</label>
          <select
            value={withdrawMethod}
            onChange={(e) => setWithdrawMethod(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
          >
            <option value="ATM Withdrawal">ATM Withdrawal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <label className="block text-gray-600">
            Schedule Withdrawal (Optional)
          </label>
          <input
            type="date"
            value={withdrawDate}
            onChange={(e) => setWithdrawDate(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 mb-4"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Withdraw Funds"}
          </button>
        </form>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Need help?{" "}
          <a href="#" className="text-blue-500">
            Contact Support
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-500">
            FAQs
          </a>
        </p>
        <p>All transactions are secured with SSL encryption.</p>
      </footer>
    </div>
  );
};

export default Withdrawals;