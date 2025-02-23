import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Removed Link import

import { useData } from "../context/DataContext"; // Use global DataContext
import Header from "../Header";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import UserProfileSection from "./UserProfileSection";
import TransactionsOverview from "./TransactionsOverview";
import QuickActions from "./QuickActions";
import ChartSection from "./ChartSection";
import Footer from "../Footer";

const UserDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Retrieve global state and functions from DataContext
  const { user, transactions, totalExpenditure } = useData();

  // UI toggles
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  // Ref for Chart.js canvas (passed to ChartSection)
  const lineChartRef = useRef(null);

  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const toggleBalance = () => setBalanceVisible((prev) => !prev);

  // If user data is not loaded, display a loading message
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <p className="text-center text-gray-700 text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 font-sans pt-36 pb-16">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      {mobileSidebarOpen && <MobileSidebar toggleMobileSidebar={toggleMobileSidebar} />}
      <div className="flex flex-col md:flex-row flex-grow">
        <DesktopSidebar />
        <main className="flex-1 p-6">
          <UserProfileSection 
            userData={user} 
            balanceVisible={balanceVisible} 
            toggleBalance={toggleBalance} 
          />
          <TransactionsOverview 
            transactions={transactions} 
            totalExpenditure={totalExpenditure} 
          />
          <QuickActions />
          <ChartSection lineChartRef={lineChartRef} />
          <button
            onClick={() => navigate("/some-path")} // Example navigation
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Go to Some Path
          </button>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
