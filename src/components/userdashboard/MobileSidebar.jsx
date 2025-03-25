import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 text-gray-800 p-6 z-50">
      {/* Close Button */}
      <button
        onClick={toggleMobileSidebar}
        type="button"
        title="Close Menu"
        className="absolute top-4 right-4 text-gray-800 text-2xl"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      {/* Brand / Logo Section */}
      <div className="flex items-center space-x-2">
        <div className="bg-red-600 w-8 h-8 flex items-center justify-center rounded-full">
          <span className="text-white font-bold">H</span>
        </div>
        <h1 className="text-xl font-bold text-gray-700">HSBC UK</h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-8 space-y-1">
        <Link 
          to="/" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faHome} className="mr-3" /> Dashboard
        </Link>
        <Link 
          to="/account-overview" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faMoneyBill} className="mr-3" /> Accounts
        </Link>
        <Link 
          to="/transaction-history" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-3" /> Transactions
        </Link>
        <Link 
          to="/analytics" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-3" /> Analytics
        </Link>
        <Link 
          to="/transfer" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faMoneyBillTransfer} className="mr-3" /> Transfer Funds
        </Link>
        <Link 
          to="/loan" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Loans
        </Link>
        <Link 
          to="/cards" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faCreditCard} className="mr-3" /> Cards
        </Link>
        <Link 
          to="/deposits" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowDown} className="mr-3" /> Deposits
        </Link>
        <Link 
          to="/withdrawals" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowUp} className="mr-3" /> Withdrawals
        </Link>
        <Link 
          to="/bill-payments" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-3" /> Payments
        </Link>
        <Link 
          to="/investments" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faChartPie} className="mr-3" /> Investments
        </Link>
        <Link 
          to="/settings" 
          onClick={toggleMobileSidebar}
          className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faCog} className="mr-3" /> Settings
        </Link>
      </nav>
    </aside>
  );
};

MobileSidebar.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired,
};

export default MobileSidebar;
