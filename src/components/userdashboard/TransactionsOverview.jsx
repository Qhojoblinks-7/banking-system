import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverview } from "../store/userSlice"; // Adjust path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const TransactionsView = () => {
  const dispatch = useDispatch();
  
  // Redux state: transactions, status, error from user slice
  const { transactions, status, error } = useSelector((state) => state.user);
  
  // Tab state: "all", "expenses", "receives"
  const [activeTab, setActiveTab] = useState("all");

  // On tab change, dispatch fetchOverview with the relevant filter
  useEffect(() => {
    dispatch(fetchOverview(activeTab));
  }, [dispatch, activeTab]);

  // Decide whether to show the top container
  const showContainer = activeTab !== "all";

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-md shadow-md">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "expenses"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "receives"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("receives")}
        >
          Receives
        </button>
      </div>

      {/* Conditional Container at the Top */}
      {showContainer && (
        <div className="p-3 mb-4 bg-sky-50 border border-sky-200 rounded">
          {activeTab === "expenses" ? (
            <p className="text-red-600 font-semibold">
              Currently showing expense transactions
            </p>
          ) : (
            <p className="text-green-600 font-semibold">
              Currently showing received transactions
            </p>
          )}
        </div>
      )}

      {/* Loading / Error States */}
      {status === "loading" && <p className="text-center">Loading transactions...</p>}
      {status === "failed" && (
        <p className="text-red-500 text-center">Error: {error}</p>
      )}

      {/* Transactions List */}
      {transactions && transactions.length > 0 ? (
        transactions.map((tx) => {
          // For demonstration, assume "withdrawal" is expense, "deposit" is receive
          const isExpense = tx.transaction_type === "withdrawal";
          const arrowColor = isExpense ? "text-red-500" : "text-green-500";
          const amountColor = isExpense ? "text-red-600" : "text-green-600";
          const arrowIcon = isExpense ? faArrowDown : faArrowUp;

          return (
            <div
              key={tx.transaction_id}
              className="flex items-center justify-between py-3 border-b last:border-none"
            >
              {/* Left side: Icon + description + date */}
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={arrowIcon} className={`${arrowColor} text-lg`} />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {tx.description || "No Description"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {tx.date || "No Date"}
                  </p>
                </div>
              </div>

              {/* Right side: Amount */}
              <p className={`font-bold ${amountColor}`}>
                £{Number(tx.amount).toLocaleString()}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No transactions available.</p>
      )}
    </div>
  );
};

export default TransactionsView;
