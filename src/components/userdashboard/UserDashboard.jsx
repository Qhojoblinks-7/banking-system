import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "../Header";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import UserProfileSection from "./UserProfileSection";
import TransactionsOverview from "./TransactionsOverview";
import QuickActions from "./QuickActions";
import ChartSection from "./ChartSection";
import Footer from "../Footer";
import { fetchUser } from "../store/userSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve user from Redux store (user data now includes account_number and balance)
  const user = useSelector((state) => state.user.user);

  // UI toggles for mobile sidebar and balance visibility
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  // Ref for Chart.js canvas (passed to ChartSection)
  const lineChartRef = useRef(null);

  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const toggleBalance = () => setBalanceVisible((prev) => !prev);

  // Fetch user data if not already loaded
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // If user data is not loaded, display a loading message
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <p className="text-center text-gray-700 text-lg font-semibold">
          Loading user data...
        </p>
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
          {/* Pass user data as userData prop */}
          <UserProfileSection 
            userData={user} 
            balanceVisible={balanceVisible} 
            toggleBalance={toggleBalance} 
          />
          <TransactionsOverview />
          <QuickActions />
          <ChartSection lineChartRef={lineChartRef} />
          <button
            onClick={() => navigate("/some-path")}
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
