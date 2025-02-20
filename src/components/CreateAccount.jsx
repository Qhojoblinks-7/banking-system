import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/Layer 2.png";

// Multi-step form configuration for sign-up
const stepsConfig = [
  { id: "step1", label: "Full Name", type: "text", name: "full_name", placeholder: "John Doe" },
  { id: "step2", label: "Email Address", type: "email", name: "email", placeholder: "john@example.com" },
  { id: "step3", label: "Phone Number", type: "text", name: "phone_number", placeholder: "1234567890" },
  { id: "step4", label: "Date of Birth", type: "date", name: "date_of_birth" },
  { id: "step5", label: "Residential Address", type: "text", name: "residential_address", placeholder: "123 Main St" },
  { id: "step6", label: "Account Type", type: "select", name: "account_type", options: ["", "Savings", "Checking", "Business", "Premium"] },
  { id: "step7", label: "Username", type: "text", name: "username", placeholder: "johndoe" },
  { id: "step8", label: "Password", type: "password", name: "password", placeholder: "••••••••" },
  { id: "step9", label: "Confirm Password", type: "password", name: "confirmPassword", placeholder: "••••••••" },
];

const CreateAccount = () => {
  // Toggle between Sign Up and Sign In forms
  const [isSignup, setIsSignup] = useState(true);
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(0);
  // Alert state for messages
  const [alert, setAlert] = useState({ message: "", classes: "", visible: false });
  // Processing state to show overlay
  const [processing, setProcessing] = useState(false);
  // Registration form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    residential_address: "",
    account_type: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  // Login form data
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  // State to hold user credentials after successful registration or login
  const [userCredentials, setUserCredentials] = useState(null);

  const navigate = useNavigate();

  // Calculate progress for the multi-step form
  const updateProgress = () => ((currentStep + 1) / stepsConfig.length) * 100;

  // Handle input changes for registration form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for login form
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Display alert messages for 5 seconds
  const showAlert = (message, classes) => {
    setAlert({ message, classes, visible: true });
    setTimeout(() => setAlert({ message: "", classes: "", visible: false }), 5000);
  };

  // Validate the current step's field
  const validateStep = () => {
    const currentField = stepsConfig[currentStep];
    if (!formData[currentField.name]) {
      showAlert(`${currentField.label} is required.`, "bg-red-100 text-red-700");
      return false;
    }
    return true;
  };

  // Navigate to the next step if valid
  const handleNext = () => {
    if (validateStep() && currentStep < stepsConfig.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Navigate to the previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handle registration submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match!", "bg-red-100 text-red-700");
      return;
    }
    setProcessing(true);
    try {
      // Insert new user record into Supabase
      const { error, data } = await supabase
        .from("user_accounts")
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
          residential_address: formData.residential_address,
          account_type: formData.account_type,
          username: formData.username,
          password: formData.password, // In production, hash the password server-side
        }])
        .single();

      if (error) throw error;

      // Save credentials in state
      setUserCredentials(data);
      showAlert("Registration successful! Redirecting...", "bg-green-100 text-green-700");
      // Redirect and pass user credentials in state
      setTimeout(() => {
        navigate("/user-account-overview", { state: { user: data } });
      }, 2000);
    } catch (error) {
      showAlert(`Error: ${error.message}`, "bg-red-100 text-red-700");
    } finally {
      setProcessing(false);
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("username", loginData.username)
        .eq("password", loginData.password)
        .single();

      if (error || !data) {
        showAlert("Invalid username or password.", "bg-red-100 text-red-700");
      } else {
        setUserCredentials(data);
        showAlert("Login successful! Redirecting...", "bg-green-100 text-green-700");
        setTimeout(() => {
          navigate("/user-account-overview", { state: { user: data } });
        }, 2000);
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "bg-red-100 text-red-700");
    } finally {
      setProcessing(false);
    }
  };

  // Toggle between Sign Up and Sign In forms
  const toggleForm = () => setIsSignup((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-sky-50 font-sans p-4 relative">
      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <img src={logo} alt="Processing..." className="w-24 h-24 animate-spin" />
        </div>
      )}

      {isSignup ? (
        <div className="w-full max-w-md mx-auto gradient-border shadow-lg bg-white p-6">
          <div className="mb-4 text-center">
            <img src={logo} alt="FutureLink Bank Logo" className="mx-auto mb-2 h-12" />
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          </div>

          {alert.visible && (
            <div className={`mt-4 p-3 rounded text-center ${alert.classes}`}>
              {alert.message}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-green-400"
                style={{ width: `${updateProgress()}%`, transition: "width 0.5s ease-in-out" }}
              ></div>
            </div>
          </div>

          {/* Multi-step Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {stepsConfig.map((step, index) => (
              <div key={step.id} className={index === currentStep ? "" : "hidden"}>
                <label htmlFor={step.id} className="block text-gray-700 font-medium mb-1">
                  {step.label}:
                </label>
                {step.type !== "select" ? (
                  <input
                    type={step.type}
                    id={step.id}
                    name={step.name}
                    value={formData[step.name]}
                    onChange={handleChange}
                    placeholder={step.placeholder || ""}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  />
                ) : (
                  <select
                    id={step.id}
                    name={step.name}
                    value={formData[step.name]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  >
                    {step.options.map((option, idx) => (
                      <option key={idx} value={option} disabled={option === ""}>
                        {option === "" ? "Select your account type" : option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-gray-500 text-white font-semibold rounded px-4 py-2 hover:bg-gray-600"
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
              >
                Next
              </button>
              {currentStep === stepsConfig.length - 1 && (
                <button
                  type="submit"
                  className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
                >
                  Create Account
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button onClick={toggleForm} className="text-green-700 font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto gradient-border shadow-lg bg-white p-6">
          <div className="mb-4 text-center">
            <img src={logo} alt="FutureLink Bank Logo" className="mx-auto mb-2 h-12" />
            <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
          </div>

          {alert.visible && (
            <div className={`mt-4 p-3 rounded text-center ${alert.classes}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="loginUsername" className="block text-gray-700 font-medium mb-1">
                Username:
              </label>
              <input
                type="text"
                id="loginUsername"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                placeholder="johndoe"
                required
              />
            </div>
            <div>
              <label htmlFor="loginPassword" className="block text-gray-700 font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
              >
                Login
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <button onClick={toggleForm} className="text-green-700 font-semibold hover:underline">
              Create Account
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
