import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/loginSlice";
import logo from "../assets/Layer 2.png";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    classes: "",
    visible: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, classes) => {
    setAlert({ message, classes, visible: true });
    setTimeout(() => setAlert({ message: "", classes: "", visible: false }), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const result = await dispatch(loginUser({ user: loginData })).unwrap();
      showAlert("Login successful! Redirecting...", "bg-green-100 text-green-700");
      setTimeout(() => {
        navigate("/user-account-overview");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      showAlert("Login failed. Invalid email or password.", "bg-red-100 text-red-700");
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
          <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
        </div>
        {alert.visible && (
          <div className={`mt-4 p-3 rounded text-center ${alert.classes}`}>
            {alert.message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="loginEmail" className="block text-gray-700 font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
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
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
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
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-700 font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
