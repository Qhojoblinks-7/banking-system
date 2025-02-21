import { useRef, useState } from "react";
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
import Header from "../Header";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import UserProfileSection from "./UserProfileSection";
import TransactionsOverview from "./TransactionsOverview";
import QuickActions from "./QuickActions";
import ChartSection from "./ChartSection";
import Footer from "../Footer";
import { useData } from "../context/DataContext";

const UserDashboard = () => {
  const navigate = useNavigate();

  // Retrieve global state and functions from DataContext
  const { user, balance, transactions, totalExpenditure, fetchUserData, fetchTransactions } = useData();

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
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
