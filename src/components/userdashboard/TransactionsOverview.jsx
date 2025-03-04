import { useSelector } from "react-redux";

const TransactionsOverview = () => {
  // Retrieve transactions from the Redux store
  const transactions = useSelector((state) => state.transactions.transactions);

  // Compute total expenditure from transactions with negative amounts
  const totalExpenditure = transactions.reduce(
    (acc, tx) => (tx.amount < 0 ? acc + Math.abs(tx.amount) : acc),
    0
  );

  return (
    <section className="mt-8 space-y-6 bg-sky-100 w-full p-6 rounded-lg shadow-md">
      {/* Total Expenditure Card */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-bold text-gray-700">Total Expenditure</h3>
        <p className="text-3xl font-semibold text-red-600">
          {transactions.length > 0 ? `₵${totalExpenditure.toFixed(2)}` : "₵0.00"}
        </p>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-sky-100 text-gray-800">
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
              transactions.map((tx) => (
                <tr
                  key={tx.transaction_id}
                  className="border-b border-gray-300 last:border-none hover:bg-gray-100 transition"
                >
                  <td className="py-2 px-4">{tx.date || "N/A"}</td>
                  <td className="py-2 px-4">
                    {tx.description || "No Description"}
                  </td>
                  <td
                    className={`py-2 px-4 text-right font-semibold ${
                      tx.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tx.amount < 0
                      ? `-₵${Math.abs(tx.amount).toFixed(2)}`
                      : `₵${tx.amount.toFixed(2)}`}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {tx.status || "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionsOverview;
