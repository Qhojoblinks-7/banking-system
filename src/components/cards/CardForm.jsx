import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCard } from "../store/cardsSlice"; // Adjust the path as needed
// import logo from "../assets/Layer 2.png";

const CardForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    bank: "Visa",
    cardNumber: "",
    holderName: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Transform the form data to match API expectations
    const cardData = {
      card_number: form.cardNumber,
      cvv: form.cvv,
      expiry_date: form.expiry,
      card_type: "credit", // assuming a default type
      card_provider: form.bank,
      // Optionally include holderName if your API supports it
    };

    try {
      await dispatch(addCard(cardData)).unwrap();
      setForm({
        bank: "Visa",
        cardNumber: "",
        holderName: "",
        expiry: "",
        cvv: "",
      });
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-lg font-bold mb-4">Add New Card</h2>

      <label className="block mb-2">Bank</label>
      <select
        name="bank"
        value={form.bank}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="Visa">Visa</option>
        <option value="MasterCard">MasterCard</option>
      </select>

      <label className="block mt-4 mb-2">Card Number</label>
      <input
        type="text"
        name="cardNumber"
        value={form.cardNumber}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="**** **** **** ****"
      />

      <label className="block mt-4 mb-2">Card Holder</label>
      <input
        type="text"
        name="holderName"
        value={form.holderName}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="John Doe"
      />

      <label className="block mt-4 mb-2">Expiry Date</label>
      <input
        type="text"
        name="expiry"
        value={form.expiry}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="MM/YY"
      />

      <label className="block mt-4 mb-2">CVV</label>
      <input
        type="text"
        name="cvv"
        value={form.cvv}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="***"
      />

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full"
      >
        Add Card
      </button>
    </form>
  );
};

export default CardForm;
