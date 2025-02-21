import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../components/context/DataContext"; // Use global DataContext
import axios from "axios";
import Overlay from "./Overlay"; // Assuming an Overlay component exists

const OTPVerification = () => {
  const { login } = useData(); // Use global login function from DataContext
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/verify-otp", { email, otp });
      setMessage(response.data.message);

      // If the verification returns user and token data, update the global session
      if (response.data.user && response.data.token) {
        // The login function in DataContext should be adapted to accept user and token directly.
        login(response.data.user, response.data.token);
        navigate("/user-account-overview"); // Redirect to dashboard
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
      
      {loading && <Overlay message="Verifying OTP, please wait..." />}
      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.toLowerCase().includes("failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">OTP Code:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
