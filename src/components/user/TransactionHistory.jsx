import { useEffect, useState } from "react";
import { useData } from "../context/DataContext"; // Use global DataContext
import userProfilePic from "../assets/avatars-3-d-avatar-210.png"; // Ensure path is correct

const TransactionHistory = () => {
  const { user, token, transactions, fetchTransactions } = useData();
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions when user and token are available
  useEffect(() => {
    if (!user || !token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    const getTransactions = async () => {
      try {
        await fetchTransactions();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, [user, token, fetchTransactions]);

  // Compute total expenditure whenever transactions change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const expenditure = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);
      setTotalExpenditure(expenditure);
    } else {
      setTotalExpenditure(0);
    }
  }, [transactions]);

  if (loading) {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl text-center w-full max-w-lg">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img src={userProfilePic} alt="User Profile" className="w-16 h-16 rounded-full border-2 border-gray-300" />
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800">{user?.name || "User"}</h2>
            <p className="text-gray-600 text-sm">Account Number: {user?.accountNumber || "N/A"}</p>
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
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-300 last:border-none">
                      <td className="py-2 px-3">{transaction.date}</td>
                      <td className="py-2 px-3">{transaction.description}</td>
                      <td
                        className={`py-2 px-3 font-semibold ${
                          transaction.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}
                        {Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{transaction.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
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
