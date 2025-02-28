import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentOptions } from "../../store/paymentSlice"; // Adjust the path as needed
import logo from "../../assets/Layer 2.png"; // Import the bill payments logo

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
  const dispatch = useDispatch();
  // Retrieve token from auth state and payment-related data from the payments slice
  const token = useSelector((state) => state.auth.token);
  const { paymentData, loading: paymentLoading, error: paymentError } = useSelector(
    (state) => state.payments
  );
  const [selectedTab, setSelectedTab] = useState("Utilities");

  useEffect(() => {
    if (token) {
      dispatch(fetchPaymentOptions());
    }
  }, [token, dispatch]);

  const tabs = Object.keys(paymentData || {});

  if (paymentLoading) {
    return <div className="text-center text-gray-500">Loading payment options...</div>;
  }

  if (paymentError) {
    return <div className="text-red-500 text-center">Error: {paymentError}</div>;
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
        {paymentData && paymentData[selectedTab] && paymentData[selectedTab].length > 0 ? (
          paymentData[selectedTab].map((item, index) => <PaymentCard key={index} {...item} />)
        ) : (
          <p className="text-gray-500 text-center">No payment options available.</p>
        )}
      </div>
    </div>
  );
};

export default BillPayments;
