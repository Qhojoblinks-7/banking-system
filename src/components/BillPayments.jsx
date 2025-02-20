import { useState } from "react";
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
  const [selectedTab, setSelectedTab] = useState("Utilities");

  const tabs = ["Utilities", "Mobile Recharge", "Credit Card Bills"];

  // Data for each payment category
  const paymentData = {
    Utilities: [
      {
        title: "Electricity Bill",
        provider: "Electricity Company of Ghana (ECG)",
        link: "https://powerapp.ecg.com.gh/",
      },
      {
        title: "Water Bill",
        provider: "Ghana Water Company Limited",
        link: "https://gwcbilling.com/GWCPortal/",
      },
      {
        title: "Internet & Cable TV",
        provider: "Vodafone Ghana",
        link: "https://vodafone.com.gh",
      },
      {
        title: "Telephone Services",
        provider: "Vodafone Ghana",
        link: "https://vodafone.com.gh",
      },
    ],
    "Mobile Recharge": [
      {
        title: "MTN Airtime",
        provider: "MTN Ghana",
        link: "https://mtn.com.gh",
      },
      {
        title: "Vodafone Airtime",
        provider: "Vodafone Ghana",
        link: "https://vodafone.com.gh",
      },
      {
        title: "AirtelTigo Airtime",
        provider: "AirtelTigo Ghana",
        link: "https://airteltigo.com.gh",
      },
    ],
    "Credit Card Bills": [
      {
        title: "Visa Credit Card",
        provider: "Standard Chartered Ghana",
        link: "https://www.sc.com/gh/",
      },
      {
        title: "MasterCard Credit Card",
        provider: "Fidelity Bank Ghana",
        link: "https://www.fidelitybank.com.gh/",
      },
    ],
  };

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
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {selectedTab}
        </h3>

        {paymentData[selectedTab]?.length > 0 ? (
          paymentData[selectedTab].map((item, index) => (
            <PaymentCard key={index} {...item} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No payment options available.</p>
        )}
      </div>
    </div>
  );
};

export default BillPayments;
