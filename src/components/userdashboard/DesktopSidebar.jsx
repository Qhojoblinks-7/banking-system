import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/Layer 2.png';
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png";

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
  // Fetch user from Redux
  const user = useSelector((state) => state.user.user);
  const userName = user?.full_name || "User"; // Fallback to "User" if name isn't available

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen text-gray-800 p-6 hidden md:flex flex-col">
      {/* Brand / Logo Section */}
      <div className="flex items-center space-x-2">
        <div className="w-20 h-3 flex items-center justify-center rounded-full">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h1 className="text-xl font-bold text-gray-700">FUTURELINK</h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-8 flex-1">
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/transaction-history"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-3" />
              Transactions
            </Link>
          </li>
          <li>
            <Link
              to="/analytics"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-3" />
              Analytics
            </Link>
          </li>
          <li>
            <Link
              to="/cards"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faCreditCard} className="mr-3" />
              Cards
            </Link>
          </li>
          <li>
            <Link
              to="/deposits"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowDown} className="mr-3" />
              Deposits
            </Link>
          </li>
          <li>
            <Link
              to="/withdrawals"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowUp} className="mr-3" />
              Withdrawals
            </Link>
          </li>
          <li>
            <Link
              to="/bill-payments"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-3" />
              Payments
            </Link>
          </li>
          <li>
            <Link
              to="/investments"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faChartPie} className="mr-3" />
              Investments
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faCog} className="mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center space-x-3 px-4">
          <img
            src={userProfilePic}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
