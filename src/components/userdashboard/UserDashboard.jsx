import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Your custom components
import Header from "../Header";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import UserProfileSection from "./UserProfileSection";
import TransactionsOverview from "./TransactionsOverview";
import QuickActions from "./QuickActions";
import ChartSection from "./ChartSection";

// Redux action
import { fetchUser } from "../store/userSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve user and status from Redux
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);

  // UI toggles for mobile sidebar and balance visibility
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  // Toggle handlers
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const toggleBalance = () => setBalanceVisible((prev) => !prev);

  // Fetch user data on mount if not already loaded
  useEffect(() => {
    if (!user && status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, user, status]);

  // Loading state
  if (!user && status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <p className="text-center text-gray-700 text-lg font-semibold">
          Loading user data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {/* Mobile Sidebar (overlays content on mobile) */}
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      {mobileSidebarOpen && (
        <MobileSidebar toggleMobileSidebar={toggleMobileSidebar} />
      )}

      {/* Main layout: Sidebar + Content */}
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar (visible on md and above) */}
        <div className="hidden md:block w-64">
          <DesktopSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4  space-y-6">
          {/* Summary Boxes: grid becomes single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Premier Account */}
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Premier Account</p>
              <p className="text-2xl font-bold text-gray-700">£50,090</p>
            </div>
            {/* ISA Savings */}
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">ISA Savings</p>
              <p className="text-2xl font-bold text-gray-700">£9,900</p>
            </div>
            {/* Other Savings */}
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Other Savings</p>
              <p className="text-2xl font-bold text-gray-700">£120,012</p>
            </div>
            {/* Mortgage */}
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Mortgage</p>
              <p className="text-2xl font-bold text-gray-700">£3,681,233</p>
            </div>
          </div>

          {/* Middle row: Chart Section + Quick Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <ChartSection />
            </div>
            <div className="w-full md:w-1/3">
                <QuickActions />
            </div>
          </div>

          {/* Transactions List */}
            <TransactionsOverview />

          {/* User Profile Section */}
          {user && (
              <UserProfileSection
                userData={user}
                balanceVisible={balanceVisible}
                toggleBalance={toggleBalance}
              />
          )}

          {/* Navigation Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow-md transition duration-300 hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
