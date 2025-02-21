import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create User Context
const UserContext = createContext();

// Provide User Data Globally
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [loading, setLoading] = useState(true);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalExpenditure, setTotalExpenditure] = useState(0);

  // Fetch user details when the access token is available
  useEffect(() => {
    if (accessToken) {
      fetchUserData();
      fetchTransactions();
    }
    setLoading(false);
  }, [accessToken]);

  // Auto-refresh access token before expiry (every 14 minutes)
  useEffect(() => {
    if (accessToken) {
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 14 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [accessToken, refreshToken]);

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    const resetTimer = () => setInactiveTime(0);
    const logoutTimer = setInterval(() => {
      setInactiveTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= 30) logout();
        return newTime;
      });
    }, 60 * 1000);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      clearInterval(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      refreshAccessToken();
    }
  };

  // Fetch transactions data from API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTransactions(response.data.transactions || []);
      const expenditure = response.data.transactions.reduce((total, tx) => total + (tx.amount < 0 ? Math.abs(tx.amount) : 0), 0);
      setTotalExpenditure(expenditure);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Refresh Access Token using the refresh token
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const response = await axios.post("/api/refresh-token", { refreshToken });
      setAccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      fetchUserData();
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  // Login: store both access & refresh tokens (accepts email and password)
  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/login", { email, password });
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw new Error(error.response?.data?.error || "Login failed.");
    }
  };

  // Logout: remove tokens and clear user state
  const logout = async () => {
    try {
      await axios.post("/api/logout", { refreshToken });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        fetchUserData,
        refreshAccessToken,
        loading,
        transactions,
        totalExpenditure,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to use User Context
export const useUser = () => useContext(UserContext);
