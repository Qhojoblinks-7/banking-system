// UserAccountOverview.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverview } from "../store/userSlice";
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCopy, faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { selectAuthUser, selectIsAuthenticated } from "../store/authSlice"; // Import the selector

const UserAccountOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authUser = useSelector(selectAuthUser);
  const { user: userDetails, account, transactions, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Is Authenticated:", isAuthenticated); // Debugging log
    console.log("UserSlice Status:", status); // Debugging log
    if (isAuthenticated && status === "idle") {
      console.log("About to dispatch fetchOverview..."); // NEW DEBUGGING LOG
      dispatch(fetchOverview("all"));
    }
  }, [dispatch, status, isAuthenticated]);

  useEffect(() => {
    console.log("User data from Redux (authSlice):", authUser); // Debugging log for auth user
    console.log("User data from Redux (userSlice):", { user: userDetails, account, transactions, status, error }); // Debugging log for user slice data
  }, [authUser, userDetails, account, transactions, status, error]);

  const accountNumber = useMemo(() => account?.account_number, [account]);
  const full_name = userDetails?.full_name; // Get full_name from userSlice's user
  const balance = account?.balance; // Get balance from userSlice's account

  const copyAccountNumber = async () => {
    if (!accountNumber) {
      console.error("Account number is not available."); // Debugging log
      return toast.error("Account number is not available");
    }
    try {
      await navigator.clipboard.writeText(accountNumber);
      toast.success("Account number copied!");
    } catch (err) {
      console.error("Failed to copy account number:", err); // Debugging log
      toast.error("Failed to copy.");
    }
  };

  const todayDate = new Date().toLocaleDateString();

  const filteredTransactions = transactions.filter((txn) => {
    if (activeTab === "all") return true;
    if (activeTab === "expenses") return txn.type === "expense";
    if (activeTab === "receives") return txn.type === "receive";
    return false;
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2 text-white">Loading user data...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-md p-4">
        <h1 className="text-lg font-semibold">Hello, {full_name || "User"}</h1>
        <img src={userProfilePic} alt="Profile" className="w-10 h-10 rounded-full" />
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-3xl font-bold">
          {balance ? balance.toLocaleString() : "0.00"}
          <span className="text-lg">.00</span>
        </h2>

        {/* Account Number with Eye Icon Toggle */}
        <div className="flex items-center mt-2">
          <p className="opacity-70">
            {showAccountNumber
              ? accountNumber || "0000 0000 0000 0000"
              : `•••• •••• •••• ${accountNumber?.slice(-4) || "0000"}`}
          </p>
          <button onClick={() => setShowAccountNumber(!showAccountNumber)} className="ml-2 text-white">
            <FontAwesomeIcon icon={showAccountNumber ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* Today's Date as Expiry Date */}
        <p className="text-xs opacity-70 mt-2">VALID THRU {todayDate}</p>

        {/* Copy Button */}
        <button onClick={copyAccountNumber} className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md">
          <FontAwesomeIcon icon={faCopy} className="text-gray-600" />
        </button>
      </div>

      {/* Transactions Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Transaction List</h3>

        {/* Tab Navigation */}
        <div className="flex justify-around mb-3 border-b pb-2">
          <button
            className={`px-4 py-2 rounded-md font-semibold ${activeTab === "all" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${activeTab === "expenses" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("expenses")}
          >
            Expenses
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${activeTab === "receives" ? "text-green-500 border-b-2 border-green-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("receives")}
          >
            Receives
          </button>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions available.</p>
        ) : (
          filteredTransactions.map((txn, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="text-sm text-gray-500">{txn.time || "N/A"}</p>
                <p className="font-medium">{txn.name || "Unknown"}</p>
              </div>
              <p className={`font-bold ${txn.type === "expense" ? "text-red-500" : "text-green-500"}`}>
                <FontAwesomeIcon icon={txn.type === "expense" ? faArrowDown : faArrowUp} />
                ${txn.amount?.toFixed(2) || "0.00"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Navigate to Dashboard Button */}
      <button
        onClick={() => navigate("/user-dashboard")}
        className="mt-6 bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 hover:bg-blue-600"
      >
        Go to Dashboard
      </button>

      <ToastContainer />
    </div>
  );
};

export default UserAccountOverview;