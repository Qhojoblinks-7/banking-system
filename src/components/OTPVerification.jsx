import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "./store/verifyOtpSlice"; // Adjust the path as needed
import Overlay from "./Overlay"; // Assuming an Overlay component exists
import logo from "../assets/Layer 2.png"

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useData(); // Global login function
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // Get status and error from the verifyOtp slice
  const { status, error } = useSelector((state) => state.verifyOtp);
  const isLoading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Dispatch the verifyOtp thunk with email and OTP
      const result = await dispatch(verifyOtp({ email, otp })).unwrap();
      setMessage(result.message);
      
      // If the response returns both user and token, log in and redirect
      if (result.user && result.token) {
        login(result.user, result.token);
        navigate("/user-account-overview");
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <img src={logo} alt="FutureLink Bank Logo" className="mx-auto mb-4 h-12" />
      <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
      
      {isLoading && <Overlay message="Verifying OTP, please wait..." />}
      
      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.toLowerCase().includes("failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
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
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
