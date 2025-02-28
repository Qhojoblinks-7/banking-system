import { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const CreateAccount = () => {
  const [isSignup, setIsSignup] = useState(true);

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {isSignup ? <Register /> : <Login />}
      <div className="mt-4">
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
  );
};

export default CreateAccount;
