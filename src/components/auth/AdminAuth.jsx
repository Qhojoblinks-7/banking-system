import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import Adminregister from "./AdminCreateAccount";

const AdminAuth = () => {
  const [isSignup, setIsSignup] = useState(false);

  // Toggle between registration and login forms
  const toggleForm = () => {
    setIsSignup((prev) => !prev);
  };

  // Scroll to top when toggling forms (optional)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isSignup]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {isSignup ? <Adminregister /> : <AdminLogin />}
        <div className="mt-4 text-center">
          <button
            onClick={toggleForm}
            className="text-green-700 font-semibold hover:underline"
          >
            {isSignup
              ? "Already have an admin account? Sign In"
              : "Don't have an admin account? Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AdminAuth;
