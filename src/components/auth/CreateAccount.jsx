import { useState, useEffect } from "react";
import Register from "./Register";
import Login from "./Login";

const CreateAccount = () => {
  const [isSignup, setIsSignup] = useState(true);

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
        {isSignup ? <Register /> : <Login />}
        <div className="mt-4 text-center">
          <button
            onClick={toggleForm}
            className="text-green-700 font-semibold hover:underline"
          >
            {isSignup
              ? "Already have an account? Sign In"
              : "Don't have an account? Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreateAccount;
