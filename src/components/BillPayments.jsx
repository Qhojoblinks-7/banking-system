// BillPayments.js
import { useState } from 'react';
import Layout from './Layout'; 

const BillPayments = () => {
  const [selectedTab, setSelectedTab] = useState('Utilities');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Bill Payments</h2>
        <div className="mb-4">
          <button
            className={`px-4 py-2 ${
              selectedTab === 'Utilities' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-lg`}
            onClick={() => handleTabClick('Utilities')}
          >
            Utilities
          </button>
          <button
            className={`ml-2 px-4 py-2 ${
              selectedTab === 'Mobile Recharge' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-lg`}
            onClick={() => handleTabClick('Mobile Recharge')}
          >
            Mobile Recharge
          </button>
          <button
            className={`ml-2 px-4 py-2 ${
              selectedTab === 'Credit Card Bills' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-lg`}
            onClick={() => handleTabClick('Credit Card Bills')}
          >
            Credit Card Bills
          </button>
        </div>

        {selectedTab === 'Utilities' && (
          <div>
            <h3 className="text-lg font-bold mb-2">Utilities</h3>
            <p className="mb-2">
              Electricity Bill (ECG):{' '}
              <a
                href="https://powerapp.ecg.com.gh/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-1 px-2 rounded"
              >
                Pay Now
              </a>
            </p>
            <p className="mb-2">
              Water Bill (Ghana Water Company):{' '}
              <a
                href="https://gwcbilling.com/GWCPortal/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-1 px-2 rounded"
              >
                Pay Now
              </a>
            </p>
            <p className="mb-2">
              Internet and Cable TV (Vodafone):{' '}
              <a
                href="https://vodafone.com.gh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-1 px-2 rounded"
              >
                Pay Now
              </a>
            </p>
            <p className="mb-2">
              Telephone Services (Vodafone):{' '}
              <a
                href="https://vodafone.com.gh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-1 px-2 rounded"
              >
                Pay Now
              </a>
            </p>
          </div>
        )}

        {selectedTab === 'Mobile Recharge' && (
          <div>
            <h3 className="text-lg font-bold mb-2">Mobile Recharge</h3>
            {/* Add options for mobile recharge */}
          </div>
        )}

        {selectedTab === 'Credit Card Bills' && (
          <div>
            <h3 className="text-lg font-bold mb-2">Credit Card Bills</h3>
            {/* Add options for credit card bill payments */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BillPayments;
