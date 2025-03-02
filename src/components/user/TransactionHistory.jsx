import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../store/transactionsSlice"; // Adjust the path as needed
import { fetchUser } from "../store/userSlice"; // Import from userSlice
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png";

const TransactionHistory = () => {
  const dispatch = useDispatch();
  
  // Retrieve user data from the userSlice (account_number is merged into user)
  const { user, status: userStatus } = useSelector((state) => state.user);
  // Retrieve transactions data from transactionsSlice
  const { transactions, loading, error } = useSelector((state) => state.transactions);

  const [totalExpenditure, setTotalExpenditure] = useState(0);

  // Fetch user data if not already loaded
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Fetch transactions when user is available
  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions());
    }
  }, [user, dispatch]);

  // Compute total expenditure whenever transactions change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const expenditure = transactions
        .filter((tx) => tx.amount < 0)
        .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
      setTotalExpenditure(expenditure);
    } else {
      setTotalExpenditure(0);
    }
  }, [transactions]);

  const copyAccountNumber = async () => {
    if (!user?.account_number) {
      alert("Account number is not available");
      return;
    }
    try {
      await navigator.clipboard.writeText(user.account_number);
      alert("Account number copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy account number.");
    }
  };

  // Handle loading and error states from both slices
  if (loading || userStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-gray-700 text-lg font-semibold">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 p-4">
        <p className="text-red-700 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-500">
        <p className="text-white text-lg font-semibold">No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl text-center w-full max-w-lg">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={userProfilePic}
            alt="User Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-300"
          />
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800">{user.full_name || "User"}</h2>
            <p className="text-gray-600 text-sm">
              Account Number: {user.account_number || "N/A"}
            </p>
            <button
              onClick={copyAccountNumber}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label="Copy Account Number"
            >
              [Copy]
            </button>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-red-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Expenditure</h3>
          <p className="text-2xl font-bold text-red-600">GHC {totalExpenditure.toFixed(2)}</p>
        </div>

        {/* Recent Transactions */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-100 rounded-lg text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No recent transactions available
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 last:border-none hover:bg-gray-100 transition"
                    >
                      <td className="py-2 px-4">{tx.date || "N/A"}</td>
                      <td className="py-2 px-4">{tx.description || "No Description"}</td>
                      <td
                        className={`py-2 px-4 text-right font-semibold ${
                          tx.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {tx.amount < 0 ? "-" : "+"}
                        {Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">{tx.status || "Pending"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
