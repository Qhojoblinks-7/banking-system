import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/adminAccountSlice"; // Use the same authSlice for admins if applicable
import logo from "../../assets/Layer 2.png";

const AdminLogin = () => {
  const [adminLoginData, setAdminLoginData] = useState({ email: "", password: "" });
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    classes: "",
    visible: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLoginChange = (e) => {
    const { name, value } = e.target;
    setAdminLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, classes) => {
    setAlert({ message, classes, visible: true });
    setTimeout(() => setAlert({ message: "", classes: "", visible: false }), 5000);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      // Dispatch loginUser with credentials, handle admin login separately if necessary
      await dispatch(loginUser(adminLoginData)).unwrap();
      showAlert("Admin login successful! Redirecting...", "bg-green-100 text-green-700");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Admin login error:", error);
      showAlert("Login failed. Invalid email or password.", "bg-red-100 text-red-700");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 font-sans p-4 relative">
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <img src={logo} alt="Processing..." className="w-24 h-24 animate-spin" />
        </div>
      )}
      <div className="w-full max-w-md mx-auto gradient-border shadow-lg bg-white p-6">
        <div className="mb-4 text-center">
          <img src={logo} alt="FutureLink Bank Logo" className="mx-auto mb-2 h-12" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
        </div>
        {alert.visible && (
          <div className={`mt-4 p-3 rounded text-center ${alert.classes}`}>
            {alert.message}
          </div>
        )}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label htmlFor="adminLoginEmail" className="block text-gray-700 font-medium mb-1">
              Admin Email:
            </label>
            <input
              type="email"
              id="adminLoginEmail"
              name="email"
              value={adminLoginData.email}
              onChange={handleAdminLoginChange}
              placeholder="admin@example.com"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
            />
          </div>
          <div>
            <label htmlFor="adminLoginPassword" className="block text-gray-700 font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              id="adminLoginPassword"
              name="password"
              value={adminLoginData.password}
              onChange={handleAdminLoginChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-700 text-white font-semibold rounded px-4 py-2 hover:bg-green-800"
              aria-label="Login"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Not an Admin?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-700 font-semibold hover:underline focus:outline-none"
          >
            User Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
