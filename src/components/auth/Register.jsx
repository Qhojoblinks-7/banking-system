import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../store/authSlice";
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

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
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
    if (!formData[currentField.name]) {
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
    setProcessing(true);
    try {
      // Omit confirm_password from registration data
      const { confirm_password, ...registrationData } = formData;
      // Dispatch registration thunk
      await dispatch(registerUser(registrationData)).unwrap();

      // Dispatch login thunk with credentials directly (email & password)
      await dispatch(
        loginUser({ email: registrationData.email, password: registrationData.password })
      ).unwrap();

      showAlert("Registration successful! Redirecting...", "bg-green-100 text-green-700");
      setTimeout(() => {
        navigate("/user-account-overview");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showAlert(`Error: ${error}`, "bg-red-100 text-red-700");
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
                className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
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

export default Register;
