import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../store/adminAccountSlice";
import logo from "../../assets/Layer 2.png";
import bcrypt from "bcryptjs";

// Step configurations for only the required fields
const stepsConfig = [
  { id: "step1", label: "Full Name", type: "text", name: "full_name", placeholder: "John Doe" },
  { id: "step2", label: "Email Address", type: "email", name: "email", placeholder: "john@example.com" },
  { 
    id: "step3", 
    label: "Account Type", 
    type: "select", 
    name: "primary_account_type", 
    options: ["", "Super Admin", "Manager", "Support Staff"] 
  },
  { id: "step4", label: "Username", type: "text", name: "username", placeholder: "johndoe" },
  { id: "step5", label: "Password", type: "password", name: "password", placeholder: "••••••••" },
  { id: "step6", label: "Confirm Password", type: "password", name: "confirm_password", placeholder: "••••••••" },
];

const AdminCreateAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ message: "", classes: "", visible: false });

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    primary_account_type: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Show Alert
  const showAlert = (message, classes) => {
    setAlert({ message, classes, visible: true });
    setTimeout(() => setAlert({ message: "", classes: "", visible: false }), 5000);
  };

  // Validate each step before proceeding
  const validateStep = () => {
    const currentField = stepsConfig[currentStep];
    if (!formData[currentField.name]) {
      showAlert(`${currentField.label} is required.`, "bg-red-100 text-red-700");
      return false;
    }
    return true;
  };

  // Handle next and previous steps
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

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      showAlert("Passwords do not match!", "bg-red-100 text-red-700");
      return;
    }

    setProcessing(true);
    try {
      // Hash the password before sending
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const { confirm_password, password, ...registrationData } = formData;

      const finalData = {
        ...registrationData,
        password_hash: hashedPassword, // Send the hashed password as password_hash
      };

      // Dispatch actions
      await dispatch(registerUser(finalData)).unwrap();
      await dispatch(loginUser({ email: registrationData.email, password: formData.password })).unwrap();

      showAlert("Registration successful! Redirecting...", "bg-green-100 text-green-700");
      setTimeout(() => navigate("/components/admin/AdminDashboard"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      showAlert(`Error: ${error.message || error}`, "bg-red-100 text-red-700");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-sky-50 font-sans p-4 relative">
      {/* Processing Indicator */}
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <img src={logo} alt="Processing..." className="w-24 h-24 animate-spin" />
        </div>
      )}

      {/* Form Container */}
      <div className="w-full max-w-md mx-auto gradient-border shadow-lg bg-white p-6">
        {/* Logo and Header */}
        <div className="mb-4 text-center">
          <img src={logo} alt="FutureLink Bank Logo" className="mx-auto mb-2 h-12" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Create Account</h1>
        </div>

        {/* Alert Message */}
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

        {/* Form */}
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
                      {option === "" ? "Select account type" : option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
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
            {currentStep < stepsConfig.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
              >
                Next
              </button>
            ) : (
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
    </div>
  );
};

export default AdminCreateAccount;
