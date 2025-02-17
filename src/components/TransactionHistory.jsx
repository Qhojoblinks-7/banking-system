import userProfilePic from './assets/userProfilePic.png'; // Replace with the path to your profile pic

const TransactionHistory = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-lg">
        <div className="flex items-center space-x-4 mb-4">
          <img src={userProfilePic} alt="User Profile" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p>Account Number: 123456789012345</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Total Expenditure</h3>
          <p className="text-xl font-bold text-red-600">GHC 5,432.75</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Recent Transactions</h3>
          <table className="min-w-full bg-gray-100 rounded-lg">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Description</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">2023-01-25</td>
                <td className="py-2">ATM Withdrawal</td>
                <td className="py-2">-500.00</td>
                <td className="py-2">Completed</td>
              </tr>
              <tr>
                <td className="py-2">2023-01-24</td>
                <td className="py-2">Salary Deposit</td>
                <td className="py-2">+2,000.00</td>
                <td className="py-2">Completed</td>
              </tr>
              <tr>
                <td className="py-2">2023-01-23</td>
                <td className="py-2">Electricity Bill Payment</td>
                <td className="py-2">-250.75</td>
                <td className="py-2">Completed</td>
              </tr>
              <tr>
                <td className="py-2">2023-01-22</td>
                <td className="py-2">Mobile Money Transfer</td>
                <td className="py-2">-120.00</td>
                <td className="py-2">Completed</td>
              </tr>
              <tr>
                <td className="py-2">2023-01-21</td>
                <td className="py-2">Loan Disbursement</td>
                <td className="py-2">+2,000.00</td>
                <td className="py-2">Completed</td>
              </tr>
              <tr>
                <td className="py-2">2023-01-20</td>
                <td className="py-2">Supermarket Purchase (POS)</td>
                <td className="py-2">-150.50</td>
                <td className="py-2">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
