import logo from "../assets/Layer 2.png";

const Overlay = ({ visible, message = "Processing..." }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
      <img src={logo} alt="Loading..." className="w-24 h-24 animate-spin mb-4" />
      <p className="text-white text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Overlay;
