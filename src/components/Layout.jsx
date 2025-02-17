// Layout.js
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-900 text-white flex flex-col">
        <div className="p-4 text-center font-bold text-xl border-b border-teal-700">
          User Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2">
              <Link to="/account-overview" className="hover:text-gray-300">
                Account Overview
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bill-payments" className="hover:text-gray-300">
                Transactions
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bill-payments" className="hover:text-gray-300">
                Transfer Funds
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bill-payments" className="hover:text-gray-300">
                Loan Application
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bill-payments" className="hover:text-gray-300">
                Investment Opportunities
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bill-payments" className="hover:text-gray-300">
                Settings
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bill-payments" className="hover:text-gray-300">
                Logout
              </Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
        <footer className="p-4 text-center border-t border-teal-700">
          &copy; {new Date().getFullYear()} User Dashboard. All Rights Reserved.
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
