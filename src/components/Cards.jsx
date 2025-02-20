import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Cards= () => {
  // State to store card list
  const [cards, setCards] = useState([]);
  // State for handling the form modal
  const [isAddingCard, setIsAddingCard] = useState(false);
  // Form states
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  // Handle adding a new card
  const handleAddCard = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate card number (must be 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      setError("Card number must be 16 digits.");
      return;
    }
    
    // Validate expiry date (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setError("Expiry date must be in MM/YY format.");
      return;
    }

    // Validate CVV (must be 3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      setError("CVV must be 3 digits.");
      return;
    }

    // Create a new card object
    const newCard = {
      id: Date.now(),
      cardHolder,
      cardNumber: `**** **** **** ${cardNumber.slice(-4)}`, // Masked number
      expiryDate,
    };

    // Update the cards list
    setCards([...cards, newCard]);

    // Reset form fields and close the modal
    setCardHolder("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setIsAddingCard(false);
  };

  // Handle card removal
  const handleRemoveCard = (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Manage Payment Cards
      </h2>

      {/* Card List */}
      {cards.length > 0 ? (
        <ul className="space-y-4">
          {cards.map((card) => (
            <li key={card.id} className="p-4 border rounded-md shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold">{card.cardHolder}</p>
                <p className="text-gray-600">{card.cardNumber}</p>
                <p className="text-gray-500 text-sm">Exp: {card.expiryDate}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveCard(card.id)}
                aria-label="Remove card"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No saved cards.</p>
      )}

      {/* Add Card Button */}
      <button
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
        onClick={() => setIsAddingCard(true)}
      >
        <FaPlus /> Add Card
      </button>

      {/* Add Card Modal */}
      {isAddingCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Card</h3>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {/* Add Card Form */}
            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  maxLength="16"
                  required
                />
              </div>

              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsAddingCard(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
