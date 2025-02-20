import { useState } from "react";
import logo from '../assets/Layer 2.png';

const PaymentCard = ({ title, provider, link }) => (
  <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-lg mb-3">
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{provider}</p>
    </div>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600"
    >
      Pay Now
    </a>
  </div>
);

const BillPayments = () => {
  const [selectedTab, setSelectedTab] = useState("Utilities");

  const tabs = ["Utilities", "Mobile Recharge", "Credit Card Bills"];

  return (
      <div className="bg-white p-6 mt-6 rounded-lg shadow-2xl max-w-xl mx-auto">
        <img src={logo} alt="bill payments" className="w-20 h-20 mx-auto" />
        <h2 className="text-2xl font-bold mb-4 text-center">Bill Payments</h2>

        {/* Tab Navigation */}
        <div className="flex justify-between bg-gray-200 p-2  rounded-lg mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-2 rounded-md ${
                selectedTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {selectedTab === "Utilities" && (
            <div>
              <h3 className="text-lg font-bold mb-3">Utilities</h3>
              <PaymentCard
                title="Electricity Bill"
                provider="Electricity Company of Ghana (ECG)"
                link="https://powerapp.ecg.com.gh/"
              />
              <PaymentCard
                title="Water Bill"
                provider="Ghana Water Company Limited"
                link="https://gwcbilling.com/GWCPortal/"
              />
              <PaymentCard
                title="Internet & Cable TV"
                provider="Vodafone Ghana"
                link="https://vodafone.com.gh"
              />
              <PaymentCard
                title="Telephone Services"
                provider="Vodafone Ghana"
                link="https://vodafone.com.gh"
              />
            </div>
          )}

          {selectedTab === "Mobile Recharge" && (
            <div>
              <h3 className="text-lg font-bold mb-3">Mobile Recharge</h3>
              <PaymentCard
                title="MTN Airtime"
                provider="MTN Ghana"
                link="https://mtn.com.gh"
              />
              <PaymentCard
                title="Vodafone Airtime"
                provider="Vodafone Ghana"
                link="https://vodafone.com.gh"
              />
              <PaymentCard
                title="AirtelTigo Airtime"
                provider="AirtelTigo Ghana"
                link="https://airteltigo.com.gh"
              />
            </div>
          )}

          {selectedTab === "Credit Card Bills" && (
            <div>
              <h3 className="text-lg font-bold mb-3">Credit Card Bills</h3>
              <PaymentCard
                title="Visa Credit Card"
                provider="Standard Chartered Ghana"
                link="https://www.sc.com/gh/"
              />
              <PaymentCard
                title="MasterCard Credit Card"
                provider="Fidelity Bank Ghana"
                link="https://www.fidelitybank.com.gh/"
              />
            </div>
          )}
        </div>
      </div>
  );
};

export default BillPayments;
