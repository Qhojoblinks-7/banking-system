import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Chart from "chart.js/auto";
import logo from "../assets/Layer 2.png";
import userProfilePic from "../assets/avatars-3-d-avatar-210.png"; // Adjust path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import QuickActions from "./QuickActions";
import { useData } from "../context/DataContext"; // Use global DataContext

const UserDashboard = () => {
  const navigate = useNavigate();
  // Retrieve global state and functions from DataContext
  const { 
    user, 
    balance, 
    transactions, 
    totalExpenditure, 
    fetchUserData, 
    fetchTransactions 
  } = useData();

  // UI toggles
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  // Refs for Chart.js canvas and instance
  const lineChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const toggleBalance = () => setBalanceVisible((prev) => !prev);

  // Fetch user data if not already loaded
  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  // Fetch transactions if not already loaded
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      fetchTransactions();
    }
  }, [transactions, fetchTransactions]);

  // Initialize Chart.js line chart for Dollar Rate Trend
  useEffect(() => {
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext("2d");

      // Destroy previous chart instance if it exists (prevents duplicate charts)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar"],
          datasets: [
            {
              label: "Dollar Rate",
              data: [1.2, 1.3, 1.15],
              borderColor: "blue",
              fill: false,
            },
          ],
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
          <img src={logo} alt="Logo" className="h-16" />
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-teal-900 font-medium hover:text-blue-700">Home</Link>
            <Link to="/transaction-history" className="text-teal-900 font-medium hover:text-blue-700">Transactions</Link>
            <Link to="/analytics" className="text-teal-900 font-medium hover:text-blue-700">Analytics</Link>
            <Link to="/cards" className="text-teal-900 font-medium hover:text-blue-700">Cards</Link>
            <Link to="/payments" className="text-teal-900 font-medium hover:text-blue-700">Payments</Link>
            <Link to="/investments" className="text-teal-900 font-medium hover:text-blue-700">Investments</Link>
            <Link to="/settings" className="text-teal-900 font-medium hover:text-blue-700">Settings</Link>
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
        <aside className="fixed top-0 left-0 min-h-screen w-[30%] bg-green-500 text-white p-6 z-50">
          <button
            onClick={toggleMobileSidebar}
            type="button"
            title="Close Menu"
            className="absolute top-4 right-4 text-white text-2xl"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <nav className="mt-6 space-y-4">
            <Link to="/" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </Link>
            <Link to="/account-overview" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faMoneyBill} /> Accounts
            </Link>
            <Link to="/transaction-history" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faMoneyBillWave} /> Transactions
            </Link>
            <Link to="/analytics" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </Link>
            <Link to="/cards" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faCreditCard} /> Cards
            </Link>
            <Link to="/deposits" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faArrowDown} /> Deposits
            </Link>
            <Link to="/withdrawals" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faArrowUp} /> Withdrawals
            </Link>
            <Link to="/bill-payments" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faMoneyCheckAlt} /> Payments
            </Link>
            <Link to="/investments" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faChartPie} /> Investments
            </Link>
            <Link to="/settings" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
          </nav>
        </aside>
      )}

      <div className="flex flex-col md:flex-row">
        {/* MAIN SIDEBAR (Desktop) */}
        <aside className="w-64 bg-green-700 text-white p-6 hidden md:block">
          <nav className="mt-6 space-y-4 h-full">
            <Link to="/" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </Link>
            <Link to="/transaction-history" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Transactions
            </Link>
            <Link to="/analytics" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </Link>
            <Link to="/cards" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faCreditCard} /> Cards
            </Link>
            <Link to="/deposits" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faArrowDown} /> Deposits
            </Link>
            <Link to="/withdrawals" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faArrowUp} /> Withdrawals
            </Link>
            <Link to="/bill-payments" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faMoneyCheckAlt} /> Payments
            </Link>
            <Link to="/investments" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faChartPie} /> Investments
            </Link>
            <Link to="/settings" className="block text-sky-50 hover:text-white">
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
          </nav>
        </aside>
        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {/* SECTION 1: User Profile, Account Info, Balance Card */}
          <section className="space-y-6 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Account Type */}
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold text-gray-700 text-center md:text-left">
                  Account Type:
                </span>
                <span className="text-gray-600 text-center md:text-left">
                  {user?.account_type || "N/A"}
                </span>
              </div>
              {/* Right: Profile Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-700">Account Number:</span>
                  <span className="text-gray-600">{user?.account_number || "N/A"}</span>
                </div>
                <img src={userProfilePic} alt="User Profile" className="h-16 w-16 rounded-full object-cover" />
              </div>
            </div>
            {/* Row 2: Balance Card with Toggle */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-700">Balance</h3>
                <p className="text-2xl font-semibold text-blue-700">
                  {balanceVisible ? `₵${balance}` : "₵****.**"}
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
              <p className="text-3xl font-semibold text-red-600">₵{totalExpenditure || "0.00"}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white text-center shadow-md rounded-lg">
                <thead className="flex justify-between">
                  <tr className="bg-sky-100 text-white">
                    <th className="py-3 px-4 text-black text-left">Date</th>
                    <th className="py-3 px-4 text-black text-left">Description</th>
                    <th className="py-3 px-4 text-black text-right">Amount</th>
                    <th className="py-3 px-4 text-black text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {transactions && transactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No recent transactions available
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.transaction_id}>
                        <td className="py-2 px-4">{tx.date || ""}</td>
                        <td className="py-2 px-4">{tx.description || ""}</td>
                        <td className="py-2 px-4 text-right">{tx.amount || ""}</td>
                        <td className="py-2 px-4 text-right">{tx.status || ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3: Custom Section (Quick Actions) */}
          <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <QuickActions />
            {/* Additional content goes here */}
          </section>

          {/* SECTION 4: Dollar Rate Trend Graph */}
          <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900">Dollar Rate Trend</h2>
            <div className="relative" style={{ height: "300px" }}>
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
