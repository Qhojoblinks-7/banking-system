import logo from '../assets/Layer 2.png';

const Overlay = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <img src={logo} alt="Processing..." className="w-24 h-24 animate-spin" />
    </div>
  );
};

export default Overlay;
