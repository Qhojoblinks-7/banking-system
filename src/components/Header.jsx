import { Link } from 'react-router-dom';
import logo from '../assets/Layer 2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Header = ({ toggleMobileSidebar }) => {
  return (
    <header className="bg-white fixed top-0 left-0 w-full h-36 shadow-md p-4 flex justify-between items-center z-50">
      <div className="flex items-center space-x-4">
        <div>
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-teal-900 font-medium hover:text-blue-700">Home</Link>
          <Link to="/transaction-history" className="text-teal-900 font-medium hover:text-blue-700">Transactions</Link>
          <Link to="/analytics" className="text-teal-900 font-medium hover:text-blue-700">Analytics</Link>
          <Link to="/cards" className="text-teal-900 font-medium hover:text-blue-700">Cards</Link>
          <Link to="/payments" className="text-teal-900 font-medium hover:text-blue-700">Payments</Link>
          <Link to="/investments" className="text-teal-900 font-medium hover:text-blue-700">Investments</Link>
          <Link to="/settings" className="text-teal-900 font-medium hover:text-blue-700">Settings</Link>
        </nav>
      </div>
      <button
        onClick={toggleMobileSidebar}
        type="button"
        title="Open Menu"
        className="md:hidden text-green-800 text-2xl"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </header>
  );
};

export default Header;
