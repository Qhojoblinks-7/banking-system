import { useState } from "react";
import visaLogo from "../../assets/Layer 2.png";
import masterCardLogo from "../../assets/Layer 4.png";

const bankLogos = {
  Visa: visaLogo,
  MasterCard: masterCardLogo,
};

const FlipCard = ({ bank, cardNumber, holderName, expiry, cvv, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardContainerStyle = {
    transformStyle: "preserve-3d",
  };

  const cardFaceStyle = {
    backfaceVisibility: "hidden",
  };

  return (
    <div
      className="relative w-80 h-48 cursor-pointer group"
      style={cardContainerStyle}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className="w-full h-full rounded-xl shadow-lg transition-transform duration-500 transform"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
          color: "white",
        }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 flex flex-col justify-between p-4" style={cardFaceStyle}>
          <img src={bankLogos[bank]} alt={`${bank} logo`} className="w-16 h-auto" />
          <div className="text-lg font-bold">{cardNumber}</div>
          <div className="flex justify-between text-sm">
            <span>{holderName}</span>
            <span>{expiry}</span>
          </div>
        </div>
        {/* Back Face */}
        <div
          className="absolute inset-0 flex justify-center items-center rounded-xl"
          style={{
            ...cardFaceStyle,
            backgroundColor: "black",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-lg">CVV: {cvv}</div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ❌
      </button>
    </div>
  );
};

export default FlipCard;
