import { useState } from "react";
import { supabase } from "../supabaseClient";

const OTPVerification = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const verifyOTP = async () => {
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMessage("OTP verified successfully!");
      onSuccess(data); // Proceed to the next step after OTP verification
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setResendMessage("OTP resent successfully!");
    } catch (error) {
      setResendMessage(`Error: ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-semibold">Verify Your Email</h2>
      <p className="text-gray-600">Enter the OTP sent to {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 w-full rounded mt-2"
      />
      <button
        onClick={verifyOTP}
        className="bg-green-600 text-white p-2 rounded w-full mt-2"
      >
        Verify OTP
      </button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
      <button
        onClick={resendOTP}
        className="bg-blue-600 text-white p-2 rounded w-full mt-2"
        disabled={isResending}
      >
        {isResending ? "Resending..." : "Resend OTP"}
      </button>
      {resendMessage && <p className="text-red-500 mt-2">{resendMessage}</p>}
    </div>
  );
};

export default OTPVerification;
