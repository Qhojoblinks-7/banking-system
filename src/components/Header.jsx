import logo from '../assets/Layer 2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


const Header = ({ toggleMobileSidebar }) => {
  return (
    <header className="bg-transparent fixed top-0 left-0 w-full h-20  p-4 flex justify-between items-center z-50">
      <div className="flex items-center space-x-4">

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
