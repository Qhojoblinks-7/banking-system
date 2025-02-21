import { useState, useEffect } from "react";
import { useUser } from "../components/UserContext"; // Import global user context
import axios from "axios";
import logo from "../assets/Layer 2.png"; // Ensure this path is correct

// Payment Card Component
const PaymentCard = ({ title, provider, link }) => (
  <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-3">
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-sm text-gray-600">{provider}</p>
    </div>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
    >
      Pay Now
    </a>
  </div>
);

// Main Bill Payments Component
const BillPayments = () => {
  const { user, token } = useUser(); // Get user data and token from context
  const [selectedTab, setSelectedTab] = useState("Utilities");
  const [paymentData, setPaymentData] = useState({ Utilities: [], "Mobile Recharge": [], "Credit Card Bills": [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      if (!token) return; // Ensure token is available

      try {
        setLoading(true);

        // Fetch user's available payment options (linked accounts, preferences, etc.)
        const response = await axios.get("/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setPaymentData(response.data);
        }
      } catch (err) {
        console.error("Error fetching payment options:", err);
        setError(err.response?.data?.message || "Failed to load payment options.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentOptions();
  }, [token]); // Fetch only when the user logs in

  const tabs = Object.keys(paymentData); // Dynamically generate tabs from API response

  if (loading) {
    return <div className="text-center text-gray-500">Loading payment options...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 mt-6 rounded-lg shadow-xl max-w-xl mx-auto">
      {/* Logo */}
      <div className="flex justify-center">
        <img src={logo} alt="Bill Payments" className="w-20 h-20" />
      </div>

      <h2 className="text-2xl font-bold text-center mt-3 mb-4 text-gray-800">
        Bill Payments
      </h2>

      {/* Tabs Navigation */}
      <div className="flex justify-between bg-gray-200 p-2 rounded-lg mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 py-2 rounded-md transition ${
              selectedTab === tab
                ? "bg-green-600 text-white font-semibold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{selectedTab}</h3>

        {paymentData[selectedTab]?.length > 0 ? (
          paymentData[selectedTab].map((item, index) => <PaymentCard key={index} {...item} />)
        ) : (
          <p className="text-gray-500 text-center">No payment options available.</p>
        )}
      </div>
    </div>
  );
};

export default BillPayments;
