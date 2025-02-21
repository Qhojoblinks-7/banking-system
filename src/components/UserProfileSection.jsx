import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

import Header from './Header';
import MobileSidebar from './MobileSidebar';
import DesktopSidebar from './DesktopSidebar';
import UserProfileSection from './UserProfileSection';
import TransactionsOverview from './TransactionsOverview';
import QuickActions from './QuickActions';
import ChartSection from './ChartSection';
import Footer from './Footer';

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

  // Loading states for user data and transactions
  const [userLoading, setUserLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

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
        const response = await fetch('/api/user/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.accounts && data.accounts.length > 0) {
          const account = data.accounts[0]; // Assuming the user has at least one account
          setUserData({
            account_type: account.account_type || 'N/A',
            account_number: account.account_id || 'N/A',
            balance: account.balance || "0.00",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch transactions data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = '11111111-1111-1111-1111-111111111111';
        const response = await fetch(`/api/transactions/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setTxLoading(false);
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
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    // Outer container with top padding (pt-36) to offset the fixed header 
    // and bottom padding (pb-16) so the footer is always visible.
    <div className="flex flex-col min-h-screen bg-sky-50 font-sans pt-36 pb-16">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      {mobileSidebarOpen && <MobileSidebar toggleMobileSidebar={toggleMobileSidebar} />}
      <div className="flex flex-col md:flex-row flex-grow">
        <DesktopSidebar />
        <main className="flex-1 p-6">
          {userLoading ? (
            <p className="text-center">Loading user data...</p>
          ) : (
            <UserProfileSection 
              userData={userData} 
              balanceVisible={balanceVisible} 
              toggleBalance={toggleBalance} 
            />
          )}
          {txLoading ? (
            <p className="text-center">Loading transactions...</p>
          ) : (
            <TransactionsOverview 
              transactions={transactions} 
              totalExpenditure={totalExpenditure} 
            />
          )}
          <QuickActions />
          <ChartSection lineChartRef={lineChartRef} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
