import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/Layer 2.png';

const Header = ({ toggleMobileSidebar }) => {
  return (
    <header className="bg-sky-50 h-36 fixed  w-screen shadow-md p-4 flex items-center">
      <div className="flex items-center space-x-4 flex-1">
        <img src={logo} alt="Logo" className="h-16" />
        {/* Navigation links aligned to the left */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Home</a>
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Transactions</a>
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Analytics</a>
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Cards</a>
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Payments</a>
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Investments</a>
          <a href="#" className="text-teal-900 font-medium hover:text-blue-700">Settings</a>
        </nav>
      </div>
      {/* Mobile burger menu */}
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
