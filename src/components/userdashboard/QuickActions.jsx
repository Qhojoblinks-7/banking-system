import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillTransfer, 
  faArrowDown, 
  faArrowUp, 
  faCreditCard, 
  faMoneyCheckAlt, 
  faCog 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useData } from "../context/DataContext"; // Updated to use global DataContext

const QuickActions = () => {
  // Optionally, if needed, you can destructure user info:
  const { user } = useData();

  return (
    <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition">
          <FontAwesomeIcon icon={faMoneyBillTransfer} className="mr-2" />
          <Link to="/transfer-funds">Transfer Funds</Link>
        </button>
        <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition">
          <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
          <Link to="/deposits">Deposit</Link>
        </button>
        <button className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md transition">
          <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
          <Link to="/withdraw">Withdraw</Link>
        </button>
        <button className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md transition">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
          <Link to="/cards">View Cards</Link>
        </button>
        <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition">
          <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-2" />
          <Link to="/loanapplication">Loan Application</Link>
        </button>
        <button className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition">
          <FontAwesomeIcon icon={faCog} className="mr-2" />
          <Link to="/settings">Settings</Link>
        </button>
      </div>
    </section>
  );
};

export default QuickActions;
