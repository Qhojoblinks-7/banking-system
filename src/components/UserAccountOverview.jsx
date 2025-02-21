import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import userProfilePic from "../assets/avatars-3-d-avatar-210.png";

// A simple collapsible component for extra details
const CollapsibleDetails = ({ details }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-blue-600 font-semibold focus:outline-none focus:underline"
        aria-expanded={open}
        aria-controls="additional-details"
      >
        {open ? "Hide Details" : "Show More Details"}
      </button>
      {open && (
        <div id="additional-details" className="mt-2 p-4 bg-gray-100 rounded">
          {details}
        </div>
      )}
    </div>
  );
};

const UserAccountOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get user data from navigation state if available
  const stateUser = location.state?.user;

  // Initialize state with navigation state or default placeholders
  const [userData, setUserData] = useState(
    stateUser || {
      full_name: "Loading...",
      account_type: "N/A",
      balance: 0.0,
      accountNumber: "N/A",
      created_at: "N/A",
      contact: "N/A",
    }
  );
  const [loading, setLoading] = useState(!stateUser);
  const [error, setError] = useState(null);

  // Fetch user data from the API if not provided via navigation state
  useEffect(() => {
    if (stateUser) return; // No need to fetch if we already have data

    const fetchUserData = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          throw new Error("User ID is required but not available. Please log in.");
        }
        console.log(`Fetching data for user ID: ${storedUserId}`);
        const response = await axios.get(`/api/user/accounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
          },
        });
        console.log("Response data:", response.data);

        if (response.data && response.data.accounts && response.data.accounts.length > 0) {
          const account = response.data.accounts[0]; // Assuming the user has at least one account
          setUserData({
            full_name: account.full_name || "N/A",
            account_type: account.account_type || "N/A",
            balance: account.balance || 0.0,
            accountNumber: account.account_id || "N/A",
            created_at: account.created_at || "N/A",
            contact: account.contact || "N/A",
          });
        } else {
          throw new Error("User data not found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [stateUser]);

  // Function to refresh the user data manually
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUserId = localStorage.getItem("userId");

      if (!storedUserId) {
        throw new Error("User ID is required but not available. Please log in.");
      }

      console.log(`Fetching updated data for user ID: ${storedUserId}`);

      const response = await axios.get(`/api/user/accounts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
        },
      });

      if (response.data && response.data.accounts && response.data.accounts.length > 0) {
        const account = response.data.accounts[0]; // Assuming the user has at least one account
        setUserData({
          full_name: account.full_name || "N/A",
          account_type: account.account_type || "N/A",
          balance: account.balance || 0.0,
          accountNumber: account.account_id || "N/A",
          created_at: account.created_at || "N/A",
          contact: account.contact || "N/A",
        });
        console.log("User data updated:", response.data.accounts[0]);
      } else {
        throw new Error("Failed to refresh user data.");
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError(err.message || "Failed to refresh data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to copy account number to clipboard
  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(userData.accountNumber);
      alert("Account number copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy account number.");
    }
  };

  // Handler for navigation to dashboard or transaction history
  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
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
            {userData.full_name}
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Account Type: {userData.account_type}
          </p>
          <p className="text-lg text-gray-600 font-medium">
            Balance: ${Number(userData.balance).toFixed(2)}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <p className="text-gray-600 font-medium">
              Account Number: {userData.accountNumber || "N/A"}
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

        {/* Collapsible Details (Additional User Info) */}
        <CollapsibleDetails
          details={
            <>
              <p className="text-gray-600">
                <span className="font-bold">Account Created:</span> {userData.created_at || "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Contact:</span> {userData.contact || "N/A"}
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
