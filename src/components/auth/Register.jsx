import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser, selectregisterStatus, selectregisterError, selectLoginStatus, selectLoginError } from "../store/authSlice";
import logo from "../../assets/Layer 2.png";

const stepsConfig = [
  {
    id: "step1",
    label: "Full Name",
    type: "text",
    name: "full_name",
    placeholder: "John Doe",
  },
  {
    id: "step2",
    label: "Email Address",
    type: "email",
    name: "email",
    placeholder: "john@example.com",
  },
  {
    id: "step3",
    label: "Phone Number",
    type: "text",
    name: "phone_number",
    placeholder: "1234567890",
  },
  { id: "step4", label: "Date of Birth", type: "date", name: "date_of_birth" },
  {
    id: "step5",
    label: "Residential Address",
    type: "text",
    name: "residential_address",
    placeholder: "123 Main St",
  },
  {
    id: "step6",
    label: "Account Type",
    type: "select",
    name: "account_type",
    options: ["", "Savings", "Checking", "Business", "Premium"],
  },
  {
    id: "step7",
    label: "Username",
    type: "text",
    name: "username",
    placeholder: "johndoe",
  },
  {
    id: "step8",
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "••••••••",
  },
  {
    id: "step9",
    label: "Confirm Password",
    type: "password",
    name: "confirm_password",
    placeholder: "••••••••",
  },
];

const register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registerStatus = useSelector(selectregisterStatus);
  const registerError = useSelector(selectregisterError);
  const loginStatus = useSelector(selectLoginStatus);
  const loginError = useSelector(selectLoginError);

  const [currentStep, setCurrentStep] = useState(0);
  const [alert, setAlert] = useState({
    message: "",
    classes: "",
    visible: false,
  });
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

  const isProcessing = registerStatus === "loading" || loginStatus === "loading";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, classes) => {
    setAlert({ message, classes, visible: true });
    setTimeout(() => setAlert({ message: "", classes: "", visible: false }), 5000);
  };

  const validateStep = () => {
    const currentField = stepsConfig[currentStep];
    if (!formData[currentField.name] && currentField.type !== "select") {
      showAlert(`${currentField.label} is required.`, "bg-red-100 text-red-700");
      return false;
    }
    if (currentField.type === "select" && formData[currentField.name] === "") {
      showAlert(`${currentField.label} is required.`, "bg-red-100 text-red-700");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < stepsConfig.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      showAlert("Passwords do not match!", "bg-red-100 text-red-700");
      return;
    }
    // Send the entire formData object
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (registerStatus === "succeeded") {
      showAlert("Registration successful! Attempting login...", "bg-green-100 text-green-700");
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else if (registerStatus === "failed" && registerError) {
      showAlert(`Registration failed. ${registerError}`, "bg-red-100 text-red-700");
    }
  }, [registerStatus, registerError, formData.email, formData.password, dispatch, showAlert]);

  useEffect(() => {
    if (loginStatus === "succeeded") {
      showAlert("Login successful! Redirecting...", "bg-green-100 text-green-700");
      setTimeout(() => {
        navigate("/user-account-overview");
      }, 2000);
    } else if (loginStatus === "failed" && loginError) {
      showAlert(`Login failed after registration. ${loginError}`, "bg-red-100 text-red-700");
    }
  }, [loginStatus, loginError, navigate, showAlert]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-sky-50 font-sans p-4 relative">
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <img src={logo} alt="Processing..." className="w-24 h-24 animate-spin" />
        </div>
      )}
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
              style={{
                width: `${((currentStep + 1) / stepsConfig.length) * 100}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
        </div>
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
                  required={step.id !== "step3" && step.id !== "step4" && step.id !== "step5"} // Adjust required fields as needed
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
            {currentStep < stepsConfig.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
              >
                Next
              </button>
            )}
            {currentStep === stepsConfig.length - 1 && (
              <button
                type="submit"
                className={`bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isProcessing}
              >
                Create Account
              </button>
            )}
          </div>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-700 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default register;