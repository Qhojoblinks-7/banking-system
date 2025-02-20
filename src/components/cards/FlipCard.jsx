import  { useState } from "react";
import visaLogo from '../../assets/Layer 2.png';
import masterCardLogo from "../../assets/Layer 4.png";

const bankLogos = {
  Visa: visaLogo,
  MasterCard: masterCardLogo,
};

const FlipCard = ({ bank, cardNumber, holderName, expiry, cvv, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-80 h-48 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg transition-transform duration-500 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <img src={bankLogos[bank]} alt={bank} className="w-16 h-auto" />
          <div className="text-lg font-bold">{cardNumber}</div>
          <div className="flex justify-between text-sm">
            <span>{holderName}</span>
            <span>{expiry}</span>
          </div>
        </div>
        <div
          className="absolute inset-0 flex justify-center items-center bg-black text-white rounded-xl transform rotate-y-180 backface-hidden"
        >
          <div className="text-lg">CVV: {cvv}</div>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ❌
      </button>
    </div>
  );
};

export default FlipCard;
