import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInvestment, fetchInvestmentOptions } from "../store/investmentsSlice"; // Adjust the path as needed

const Investments = () => {
  const dispatch = useDispatch();

  // Retrieve data from Redux store
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth.token);
  const investments = useSelector((state) => state.investments.investments);
  const investmentOptions = useSelector((state) => state.investments.investmentOptions);

  const [amount, setAmount] = useState("");
  const [investmentType, setInvestmentType] = useState("Fixed Deposit");
  const [duration, setDuration] = useState(12); // Default 12 months
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && token) {
      dispatch(fetchInvestmentOptions());
    }
  }, [user, token, dispatch]);

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      setMessage("User not authenticated.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        user_id: user.user_id,
        amount: Number(amount),
        investment_type: investmentType,
        duration: Number(duration),
      };

      await dispatch(addInvestment(payload)).unwrap();
      setMessage("✅ Investment Created Successfully!");
      setAmount("");
    } catch (error) {
      setMessage("❌ Failed to create investment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800">Investment Dashboard</h1>

      {/* Create Investment Form */}
      <form
        className="mt-6 bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleCreateInvestment}
      >
        <h2 className="text-lg font-semibold mb-4">Create Investment</h2>
        <label className="block text-gray-600">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md mt-2 mb-4"
          required
        />

        <label className="block text-gray-600">Investment Type</label>
        <select
          value={investmentType}
          onChange={(e) => setInvestmentType(e.target.value)}
          className="w-full p-2 border rounded-md mt-2 mb-4"
        >
          {investmentOptions.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>

        <label className="block text-gray-600">Duration (Months)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded-md mt-2 mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Investment"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-500">{message}</p>}

      {/* Investments List */}
      <h2 className="text-xl font-semibold mt-8 mb-4">My Investments</h2>
      {investments.length === 0 ? (
        <p className="text-gray-500">No investments found.</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {investments.map((investment) => (
            <div key={investment.investment_id} className="p-4 border-b last:border-none">
              <h3 className="text-lg font-semibold">{investment.investment_type}</h3>
              <p className="text-gray-600">Amount: GHS {investment.amount}</p>
              <p className="text-gray-600">Duration: {investment.duration} months</p>
              <p className="text-gray-600">Status: {investment.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Investments;
