import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/userSlice"; // Adjust path as needed
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png";

const UserAccountOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Retrieve user, status, and error from Redux store
  const { user, status, error } = useSelector((state) => state.user);

  // Fetch user data if not already loaded
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, status]);

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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-500">
        <p className="text-white text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-500">
        <p className="text-white text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-500">
        <p className="text-white text-lg font-semibold">No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center font-montserrat p-4">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center max-w-md mx-auto transform transition-all hover:scale-105">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <img
            src={userProfilePic}
            alt="User Profile"
            className="w-24 h-24 rounded-full mb-4 border-4 border-green-500 shadow-lg"
          />
          <h2 className="text-2xl font-extrabold text-green-700 mb-2">
            {user.full_name || "N/A"}
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Account Type: {user.account_type || "N/A"}
          </p>
          <p className="text-lg text-gray-600 font-medium">
            Balance: ${Number(user.balance || 0).toFixed(2)}
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
        <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => handleNavigation("/user-dashboard")}
            className="bg-green-700 text-white py-3 px-8 rounded-lg hover:bg-green-500 shadow-md transition text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Go to Dashboard"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => handleNavigation("/transaction-history")}
            className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-500 shadow-md transition text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="View Transaction History"
          >
            Transaction History
          </button>
          <button
            onClick={() => handleNavigation("/refresh-data")}
            className="bg-indigo-700 text-white py-3 px-8 rounded-lg hover:bg-indigo-500 shadow-md transition text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
