import  { useState } from "react";

const CardForm = ({ addCard }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addCard(form);
    setForm({ bank: "Visa", cardNumber: "", holderName: "", expiry: "", cvv: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-96"
    >
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
