import userProfilePic from '../assets/avatars-3-d-avatar-210.png'; // Replace with the path to your profile pic

const TransactionHistory = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl text-center w-full max-w-lg">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img src={userProfilePic} alt="User Profile" className="w-16 h-16 rounded-full border-2 border-gray-300" />
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
            <p className="text-gray-600 text-sm">Account Number: 123456789012345</p>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-red-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Expenditure</h3>
          <p className="text-2xl font-bold text-red-600">GHC 5,432.75</p>
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
                {[
                  { date: "2023-01-25", desc: "ATM Withdrawal", amount: "-500.00", status: "Completed" },
                  { date: "2023-01-24", desc: "Salary Deposit", amount: "+2,000.00", status: "Completed" },
                  { date: "2023-01-23", desc: "Electricity Bill Payment", amount: "-250.75", status: "Completed" },
                  { date: "2023-01-22", desc: "Mobile Money Transfer", amount: "-120.00", status: "Completed" },
                  { date: "2023-01-21", desc: "Loan Disbursement", amount: "+2,000.00", status: "Completed" },
                  { date: "2023-01-20", desc: "Supermarket Purchase (POS)", amount: "-150.50", status: "Completed" },
                ].map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-300 last:border-none">
                    <td className="py-2 px-3">{transaction.date}</td>
                    <td className="py-2 px-3">{transaction.desc}</td>
                    <td className={`py-2 px-3 font-semibold ${transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.amount}
                    </td>
                    <td className="py-2 px-3 text-gray-600">{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
