import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext"; // Import global user context
import logo from "../assets/Layer 2.png";
import OTPVerification from "./OTPVerification";
import { supabase } from "../supabaseClient"; // Use Supabase client directly

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
  { id: "step9", label: "Confirm Password", type: "password", name: "confirm_password", placeholder: "••••••••" },
];

const CreateAccount = () => {
  const { login } = useUser(); // Access global login function from context
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ message: "", classes: "", visible: false });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    residential_address: "",
    account_type: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const [isOtpVerification, setIsOtpVerification] = useState(false);

  // Retrieve reCAPTCHA site key from environment variables
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_API_KEY;

  // Dynamically load the reCAPTCHA script if not already loaded
  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("reCAPTCHA script loaded");
      };
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script");
      };
      document.body.appendChild(script);
    }
  }, [recaptchaSiteKey]);

  // Helper function to get a reCAPTCHA token
  const getCaptchaToken = () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        return reject(new Error("reCAPTCHA not loaded"));
      }
      // Use grecaptcha.ready to ensure reCAPTCHA is ready
      if (typeof window.grecaptcha.ready === "function") {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(recaptchaSiteKey, { action: "signup" })
            .then(resolve)
            .catch(reject);
        });
      } else if (typeof window.grecaptcha.execute === "function") {
        window.grecaptcha
          .execute(recaptchaSiteKey, { action: "signup" })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error("reCAPTCHA is not properly loaded"));
      }
    });
  };

  // Handle input changes
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Show alert messages for 5 seconds
  const showAlert = (message, classes) => {
    setAlert({ message, classes, visible: true });
    setTimeout(() => setAlert({ message: "", classes: "", visible: false }), 5000);
  };

  // Validate current step
  const validateStep = () => {
    const currentField = stepsConfig[currentStep];
    if (!formData[currentField.name]) {
      showAlert(`${currentField.label} is required.`, "bg-red-100 text-red-700");
      return false;
    }
    return true;
  };

  // Handle navigation between steps
  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // Submit Registration using Supabase client with reCAPTCHA
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      showAlert("Passwords do not match!", "bg-red-100 text-red-700");
      return;
    }
    setProcessing(true);
    try {
      const captchaToken = await getCaptchaToken();
      const { data, error } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          data: {
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            date_of_birth: formData.date_of_birth,
            residential_address: formData.residential_address,
            account_type: formData.account_type,
            username: formData.username,
          },
          captchaToken, // Pass the reCAPTCHA token to Supabase
        }
      );
      if (error) {
        console.error("Supabase signUp error:", error);
        showAlert(`Error: ${error.message}`, "bg-red-100 text-red-700");
      } else {
        showAlert("Registration successful! Please verify your email.", "bg-green-100 text-green-700");
        setIsOtpVerification(true);
        // Optionally, automatically log in the user after verification:
        // await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error("Registration error:", err);
      showAlert(`Error: ${err.message || "Registration failed."}`, "bg-red-100 text-red-700");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-sky-50 font-sans p-4 relative">
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <img src={logo} alt="Processing..." className="w-24 h-24 animate-spin" />
        </div>
      )}
      {isOtpVerification ? (
        <OTPVerification email={formData.email} onSuccess={() => navigate("/user-account-overview")} />
      ) : isSignup ? (
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
        </div>
      ) : (
        <button onClick={() => setIsSignup(true)} className="text-green-700 font-semibold hover:underline">
          Create Account
        </button>
      )}
    </div>
  );
};

export default CreateAccount;
