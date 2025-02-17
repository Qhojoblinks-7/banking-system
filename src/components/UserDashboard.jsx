import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faHome, 
  faMoneyBill,
  faMoneyBillWave, 
  faChartLine, 
  faCreditCard, 
  faArrowDown, 
  faArrowUp, 
  faMoneyCheckAlt, 
  faChartPie, 
  faCog, 
  faEye, 
  faEyeSlash 
} from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const navigate = useNavigate();

  // State for user data, transactions, and total expenditure
  const [userData, setUserData] = useState({
    account_type: 'Loading...',
    account_number: 'Loading...',
    balance: '0.00',
  });
  const [transactions, setTransactions] = useState([]);
  const [totalExpenditure, setTotalExpenditure] = useState("0.00");

  // State for UI toggles
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  // Refs for Chart.js canvas and instance
  const lineChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);

  // Toggle balance visibility
  const toggleBalance = () => setBalanceVisible((prev) => !prev);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with actual user id
        const userId = '11111111-1111-1111-1111-111111111111';
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();
        if (data.user) {
          setUserData((prev) => ({
            ...prev,
            ...data.user,
            balance: data.user.balance || "0.00",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch transactions data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace with actual user id as needed
        const userId = '11111111-1111-1111-1111-111111111111';
        const response = await fetch(`/api/transactions/${userId}`);
        const data = await response.json();
        const tx = data.transactions || [];
        setTransactions(tx);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Initialize Chart.js line chart for Dollar Rate Trend
  useEffect(() => {
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar"],
          datasets: [{
            label: "Dollar Rate",
            data: [1.2, 1.3, 1.15],
            borderColor: "blue",
            fill: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
    // Cleanup Chart instance on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {/* HEADER */}
      <header className="bg-sky-50 h-36 shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <img src="adobe-express-file-4-10.png" alt="Logo" className="h-10" />
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Home</a>
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Transactions</a>
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Analytics</a>
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Cards</a>
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Payments</a>
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Investments</a>
            <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Settings</a>
          </nav>
        </div>
        {/* Mobile menu open button */}
        <button
          onClick={toggleMobileSidebar}
          type="button"
          title="Open Menu"
          className="md:hidden text-green-800 text-2xl"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>

      {/* MOBILE SIDEBAR */}
      {mobileSidebarOpen && (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-emerald-600 text-white p-6 z-50">
          <button
            onClick={toggleMobileSidebar}
            type="button"
            title="Close Menu"
            className="absolute top-4 right-4 text-white text-2xl"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <nav className="mt-6 space-y-4">
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </a>
            <a href="./AccountOverview.jsx" className="block text-sky-50 hover:text-white">
                <FontAwesomeIcon icon={faMoneyBill} /> Accounts
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Transactions
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faCreditCard} /> Cards
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faArrowDown} /> Deposits
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faArrowUp} /> Withdrawals
            </a>
            <a href="./BillPayments.jsx" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faMoneyCheckAlt} /> Payments
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faChartPie} /> Investments
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faCog} /> Settings
            </a>
          </nav>
        </aside>
      )}

      <div className="flex flex-col md:flex-row">
        {/* MAIN SIDEBAR (Desktop) */}
        <aside className="w-64 bg-green-700 text-white p-6 hidden md:block">
          <nav className="mt-6 space-y-4 h-full">
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Transactions
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faCreditCard} /> Cards
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faArrowDown} /> Deposits
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faArrowUp} /> Withdrawals
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faMoneyCheckAlt} /> Payments
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faChartPie} /> Investments
            </a>
            <a href="#" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faCog} /> Settings
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {/* SECTION 1: User Profile, Account ID & Account Type, Balance Card */}
          <section className="space-y-6 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Account Type */}
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold text-gray-700 text-center md:text-left">Account Type:</span>
                <span className="text-gray-600 text-center md:text-left">{userData.account_type}</span>
              </div>
              {/* Right: Profile Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-700">Account Number:</span>
                  <span className="text-gray-600">{userData.account_number}</span>
                </div>
                <img src="avatars-3-d-avatar-210.png" alt="User Profile" className="h-16 w-16 rounded-full object-cover" />
              </div>
            </div>
            {/* Row 2: Balance Card with Toggle */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-700">Balance</h3>
                <p className="text-2xl font-semibold text-blue-700">
                  {balanceVisible ? `₵${userData.balance}` : "₵****.**"}
                </p>
              </div>
              <button
                type="button"
                title="Toggle Balance"
                className="text-gray-600 text-2xl"
                onClick={toggleBalance}
              >
                <FontAwesomeIcon icon={balanceVisible ? faEyeSlash : faEye} />
              </button>
            </div>
          </section>

          {/* SECTION 2: Transactions Overview */}
          <section className="mt-8 space-y-6 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-bold text-gray-700">Total Expenditure</h3>
              <p className="text-3xl font-semibold text-red-600">₵{totalExpenditure}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No recent transactions available</td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.transaction_id}>
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

          {/* SECTION 3: Custom Section (Placeholder) */}
          <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900">Your Custom Section</h2>
            {/* Additional content goes here */}
          </section>

          {/* SECTION 4: Dollar Rate Trend Graph */}
          <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900">Dollar Rate Trend</h2>
            <div className="relative" style={{ height: '300px' }}>
              <canvas ref={lineChartRef} className="bg-white p-4 shadow-md rounded-lg"></canvas>
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
  <footer className="bg-teal-900 h-36 text-white text-center p-4">
    <p>&copy; {new Date().getFullYear()} User Dashboard. All Rights Reserved.</p>
  </footer>
</div>
  );
};

export default UserDashboard;
