// OTPVerification.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Overlay from "./Overlay";

/**
 * OTPVerification Component
 * 
 * Instead of displaying a form to enter a 6-digit OTP, this component shows a processing overlay
 * while it periodically polls Supabase for an active session (i.e. the user has clicked the verification link).
 * Once the session is detected, it calls the onSuccess callback.
 * 
 * @param {Object} props - Component props
 * @param {function} props.onSuccess - Callback function to call upon successful verification
 */
const OTPVerification = ({ onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get the current auth session from Supabase
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        if (data?.session) {
          // Session exists: user is verified
          setLoading(false);
          onSuccess(data.session);
        } else {
          // No session yet; poll again in 2 seconds
          setTimeout(checkSession, 2000);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkSession();
  }, [onSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-100 p-4">
      {/* Show overlay while loading */}
      <Overlay visible={loading} />
      {!loading && error && (
        <p className="text-red-500 text-center mt-4" role="alert">
          Error: {error}
        </p>
      )}
      {!loading && !error && (
        <p className="text-green-600 text-center mt-4 text-xl">
          Verification complete. Redirecting...
        </p>
      )}
    </div>
  );
};

export default OTPVerification;
