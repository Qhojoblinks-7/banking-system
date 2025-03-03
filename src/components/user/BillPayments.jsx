import { useState, useEffect } from "react";
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
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Utilities");

  // Simulate fetching payment options from an API
  useEffect(() => {
    // Simulate an API call with a timeout
    const fetchData = async () => {
      try {
        // Simulated data (replace with real API call if needed)
        const data = {
          Utilities: [
            {
              title: "Electricity Bill",
              provider: "Electricity Co.",
              link: "https://example.com/pay/electricity",
            },
            {
              title: "Water Bill",
              provider: "Water Inc.",
              link: "https://example.com/pay/water",
            },
          ],
          Internet: [
            {
              title: "Internet Bill",
              provider: "ISP X",
              link: "https://example.com/pay/internet",
            },
          ],
          Mobile: [
            {
              title: "Mobile Bill",
              provider: "Telecom Y",
              link: "https://example.com/pay/mobile",
            },
          ],
        };
        // Simulate network delay
        setTimeout(() => {
          setPaymentData(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load payment options.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = Object.keys(paymentData);

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Loading payment options...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error}
      </div>
    );
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
        {tabs.length > 0 ? (
          tabs.map((tab) => (
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
          ))
        ) : (
          <p className="text-gray-600 text-center">No payment categories found.</p>
        )}
      </div>

      {/* Tab Content */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {selectedTab}
        </h3>
        {paymentData[selectedTab] && paymentData[selectedTab].length > 0 ? (
          paymentData[selectedTab].map((item, index) => (
            <PaymentCard key={index} {...item} />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No payment options available.
          </p>
        )}
      </div>
    </div>
  );
};

export default BillPayments;
