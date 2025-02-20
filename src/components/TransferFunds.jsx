import { useState } from "react";
import { FaUniversity, FaRegCreditCard, FaMobileAlt } from "react-icons/fa";
import logo from "../assets/Layer 2.png";

// Mock bank options
const banks = [
  { id: "boa", name: "Bank of Africa" },
  { id: "gtb", name: "GTBank" },
  { id: "ecobank", name: "Ecobank" },
];

const TransferFunds = () => {
  // Form State
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");

  // Validate form fields
  const validateForm = () => {
    if (!recipientName.trim()) {
      setError("Recipient name is required.");
      return false;
    }
    if (!accountNumber.match(/^\d{10}$/)) {
      setError("Account number must be 10 digits.");
      return false;
    }
    if (!bank) {
      setError("Please select a bank.");
      return false;
    }
    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleTransfer = (e) => {
    e.preventDefault();
    setError("");
    setTransactionStatus("");

    if (!validateForm()) return;

    setShowOtpModal(true); // Show OTP modal for verification
  };

  // Handle OTP Submission
  const confirmTransfer = async () => {
    if (otp.length !== 6) {
      setError("Invalid OTP. Must be 6 digits.");
      return;
    }

    setLoading(true);
    setTransactionStatus("Processing transaction...");

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        body: JSON.stringify({ recipientName, accountNumber, bank, amount, paymentMethod, otp }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Transaction failed");

      const data = await response.json();
      if (data.success) {
        setTransactionStatus("Transfer Successful ✅");
      } else {
        setError("Transfer failed. Please try again.");
      }
    } catch (err) {
      setError("Error processing transaction.");
    } finally {
      setLoading(false);
      setShowOtpModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
      <img src={logo}alt="transfer" className="w-20 h-20 mx-auto" />
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Transfer Funds
        </h2>

        {/* Error or Success Messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {transactionStatus && <p className="text-green-500 text-sm text-center">{transactionStatus}</p>}

        {/* Transfer Form */}
        <form onSubmit={handleTransfer} className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block text-gray-700 font-medium">Recipient’s Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-gray-700 font-medium">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              maxLength="10"
              required
            />
          </div>

          {/* Bank Selection */}
          <div>
            <label className="block text-gray-700 font-medium">Select Bank</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Bank --</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-gray-700 font-medium">Amount (GHS)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          {/* Payment Method Options */}
          <label className="block font-medium">Payment Method</label>
          <div className="flex gap-3 mt-2 mb-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("bank_transfer")}
              className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${
                paymentMethod === "bank_transfer"
                  ? "bg-green-600 text-white"
                  : "bg-sky-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaUniversity /> Bank Transfer
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("credit_card")}
              className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${
                paymentMethod === "credit_card"
                  ? "bg-green-600 text-white"
                  : "bg-sky-300 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaRegCreditCard /> Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("mobile_money")}
              className={`flex items-center gap-2 p-2 border rounded-md transition duration-200 ${
                paymentMethod === "mobile_money"
                  ? "bg-green-600 text-white"
                  : "bg-sky-300 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaMobileAlt /> Mobile Money
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-400 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferFunds;
