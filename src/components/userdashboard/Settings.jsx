import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout";
import PropTypes from "prop-types";

// Import Redux actions from your slices (adjust paths as needed)
import { updateProfile, changePassword, updateSecurityQuestions } from "../store/userSlice";
import { toggleTheme } from "../store/uiSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth.token);

  // Local state for alerts and forms
  const [alert, setAlert] = useState(null);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [password, setPassword] = useState({ current: "", new: "" });
  const [notifications, setNotifications] = useState(
    user?.notifications || { email: true, sms: false }
  );
  const [securityQuestions, setSecurityQuestions] = useState(
    user?.securityQuestions || { question1: "", answer1: "", question2: "", answer2: "" }
  );

  // Update local profile state when user data changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setNotifications(user.notifications || { email: true, sms: false });
      setSecurityQuestions(user.securityQuestions || { question1: "", answer1: "", question2: "", answer2: "" });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profile)).unwrap();
      setAlert({ type: "success", message: "Profile updated successfully" });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(changePassword(password)).unwrap();
      setAlert({ type: "success", message: "Password changed successfully" });
      setPassword({ current: "", new: "" });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    }
  };

  const handleNotificationsToggle = (e) => {
    const updatedNotifications = { ...notifications, [e.target.name]: e.target.checked };
    setNotifications(updatedNotifications);
    // Immediately update the global state
    dispatch(updateProfile({ notifications: updatedNotifications }));
  };

  const handleSecurityQuestionsSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateSecurityQuestions(securityQuestions)).unwrap();
      setAlert({ type: "success", message: "Security questions updated successfully" });
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
      {alert && (
        <div
          className={`p-3 mb-4 text-center rounded ${
            alert.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Profile Update Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Save Profile
        </button>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          name="current"
          placeholder="Current Password"
          value={password.current}
          onChange={(e) => setPassword({ ...password, current: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          name="new"
          placeholder="New Password"
          value={password.new}
          onChange={(e) => setPassword({ ...password, new: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Change Password
        </button>
      </form>

      {/* Notifications Settings */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Notification Settings</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationsToggle}
            />
            <span className="ml-2">Email Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="sms"
              checked={notifications.sms}
              onChange={handleNotificationsToggle}
            />
            <span className="ml-2">SMS Notifications</span>
          </label>
        </div>
      </div>

      {/* Security Questions Form */}
      <form onSubmit={handleSecurityQuestionsSubmit} className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Security Questions</h2>
        <input
          type="text"
          name="question1"
          placeholder="Security Question 1"
          value={securityQuestions.question1}
          onChange={(e) =>
            setSecurityQuestions({ ...securityQuestions, question1: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="answer1"
          placeholder="Answer 1"
          value={securityQuestions.answer1}
          onChange={(e) =>
            setSecurityQuestions({ ...securityQuestions, answer1: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="question2"
          placeholder="Security Question 2"
          value={securityQuestions.question2}
          onChange={(e) =>
            setSecurityQuestions({ ...securityQuestions, question2: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="answer2"
          placeholder="Answer 2"
          value={securityQuestions.answer2}
          onChange={(e) =>
            setSecurityQuestions({ ...securityQuestions, answer2: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Save Security Questions
        </button>
      </form>

      {/* Theme Toggle */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <button onClick={() => dispatch(toggleTheme())} className="bg-gray-600 text-white px-4 py-2 rounded">
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default Settings;
