import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext"; // Use global DataContext
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png";

const UserAccountOverview = () => {
  const { user, fetchUserData } = useData(); // Get global user data and fetch function
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data if not available
  useEffect(() => {
    if (!user) {
      fetchUserData().catch((err) => setError(err.message));
    }
  }, [user, fetchUserData]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchUserData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(user?.account_number || "");
      alert("Account number copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy account number.");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-500">
        <p className="text-white text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-500">
        <p className="text-white text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center font-montserrat p-4">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center max-w-2xl transform transition-all hover:scale-105">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={userProfilePic}
            alt="User Profile"
            className="w-24 h-24 rounded-full mb-4 border-4 border-green-500 shadow-2xl"
          />
          <h2 className="text-2xl font-extrabold text-green-700 mb-2">
            {user.full_name}
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Account Type: {user.account_type}
          </p>
          <p className="text-lg text-gray-600 font-medium">
            Balance: ${Number(user.balance).toFixed(2)}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <p className="text-gray-600 font-medium">
              Account Number: {user.account_number || "N/A"}
            </p>
            <button
              onClick={copyAccountNumber}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label="Copy Account Number"
            >
              [Copy]
            </button>
          </div>
        </div>

        {/* Collapsible Details */}
        <CollapsibleDetails
          details={
            <>
              <p className="text-gray-600">
                <span className="font-bold">Account Created:</span> {user.created_at || "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Contact:</span> {user.contact || "N/A"}
              </p>
            </>
          }
        />

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => handleNavigation("/user-dashboard")}
            className="bg-green-700 text-white py-3 px-8 rounded-lg hover:bg-green-500 shadow-md transition duration-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Go to Dashboard"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => handleNavigation("/transaction-history")}
            className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-500 shadow-md transition duration-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="View Transaction History"
          >
            Transaction History
          </button>
          <button
            onClick={handleRefresh}
            className="bg-indigo-700 text-white py-3 px-8 rounded-lg hover:bg-indigo-500 shadow-md transition duration-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Refresh Data"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccountOverview;
