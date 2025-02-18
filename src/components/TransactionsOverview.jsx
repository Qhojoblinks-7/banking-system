const TransactionsOverview = ({ transactions, totalExpenditure }) => {
  return (
    <section className="mt-8 space-y-6 bg-sky-100 w-full p-6 rounded-lg shadow-md">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-bold text-gray-700">Total Expenditure</h3>
        <p className="text-3xl font-semibold text-red-600">₵{totalExpenditure}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white text-center shadow-md rounded-lg">
          <thead className="flex justify-between">
            <tr className="bg-sky-100 text-white w-full">
              <th className="py-3 px-4 text-black text-left">Date</th>
              <th className="py-3 px-4 text-black text-left">Description</th>
              <th className="py-3 px-4 text-black text-right">Amount</th>
              <th className="py-3 px-4 text-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 w-full">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No recent transactions available
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.transaction_id} className="border-b">
                  <td className="py-2 px-4">{tx.date || ''}</td>
                  <td className="py-2 px-4">{tx.description || ''}</td>
                  <td className="py-2 px-4 text-right">{tx.amount || ''}</td>
                  <td className="py-2 px-4 text-right">{tx.status || ''}</td>
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
