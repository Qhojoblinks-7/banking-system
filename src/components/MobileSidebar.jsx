import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faMoneyBill, 
  faMoneyBillWave, 
  faChartLine, 
  faMoneyBillTransfer, 
  faCreditCard, 
  faArrowDown, 
  faArrowUp, 
  faMoneyCheckAlt, 
  faChartPie, 
  faCog, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const MobileSidebar = ({ toggleMobileSidebar }) => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-emerald-600 text-white p-6 z-50">
      <button
        onClick={toggleMobileSidebar}
        type="button"
        title="Close Menu"
        className="absolute top-4 right-4 text-white text-2xl"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <nav className="mt-6 space-y-4">
        <Link to="/" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faHome} /> Dashboard
        </Link>
        <Link to="/account-overview" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faMoneyBill} /> Accounts
        </Link>
        <Link to="/transaction-history" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faMoneyBillWave} /> Transactions
        </Link>
        <Link to="/analytics" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faChartLine} /> Analytics
        </Link>
        <Link to="/transfer" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faMoneyBillTransfer} /> Transfer Funds
        </Link>
        <Link to="/loan" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          Loans
        </Link>
        <Link to="/cards" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faCreditCard} /> Cards
        </Link>
        <Link to="/deposits" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faArrowDown} /> Deposits
        </Link>
        <Link to="/withdrawals" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faArrowUp} /> Withdrawals
        </Link>
        <Link to="/bill-payments" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faMoneyCheckAlt} /> Payments
        </Link>
        <Link to="/investments" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faChartPie} /> Investments
        </Link>
        <Link to="/settings" className="block text-sky-50 hover:text-white" onClick={toggleMobileSidebar}>
          <FontAwesomeIcon icon={faCog} /> Settings
        </Link>
      </nav>
    </aside>
  );
};

export default MobileSidebar;
