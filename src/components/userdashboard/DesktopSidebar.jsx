import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faMoneyBillWave, 
  faChartLine, 
  faCreditCard, 
  faArrowDown, 
  faArrowUp, 
  faMoneyCheckAlt, 
  faChartPie, 
  faCog 
} from '@fortawesome/free-solid-svg-icons';

const DesktopSidebar = () => {
  return (
    <aside className="w-64 bg-green-700 fixed h-screen text-white p-6 hidden md:block">
      <nav className="mt-6 space-y-4 h-full">
        <Link to="/" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faHome} /> Dashboard
        </Link>
        <Link to="/transaction-history" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faMoneyBillWave} /> Transactions
        </Link>
        <Link to="/analytics" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faChartLine} /> Analytics
        </Link>
        <Link to="/cards" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faCreditCard} /> Cards
        </Link>
        <Link to="/deposits" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faArrowDown} /> Deposits
        </Link>
        <Link to="/withdrawals" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faArrowUp} /> Withdrawals
        </Link>
        <Link to="/bill-payments" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faMoneyCheckAlt} /> Payments
        </Link>
        <Link to="/investments" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faChartPie} /> Investments
        </Link>
        <Link to="/settings" className="block text-sky-50 hover:text-white">
          <FontAwesomeIcon icon={faCog} /> Settings
        </Link>
      </nav>
    </aside>
  );
};

export default DesktopSidebar;
