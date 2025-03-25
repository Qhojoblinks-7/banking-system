// slices/adminAccountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==================== Base URL Configuration ====================
const BASE_URL = "http://localhost:3000/api"; // Matches server.js mount point

// ==================== Async Thunks ====================

// Admin Registration
export const createAccount = createAsyncThunk(
  "admin/createAccount",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/register`, adminData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Admin Login
export const login = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Fetch Dashboard Data
export const fetchDashboardData = createAsyncThunk(
  "admin/fetchDashboardData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().adminAccount.token;
      if (!token) {
        return rejectWithValue({ error: "No token found. Please log in." });
      }
      const response = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().adminAccount.token;
      if (!token) {
        return rejectWithValue({ error: "No token found. Please log in." });
      }
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.users; // Extract users array
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Fetch All Loans
export const fetchAllLoans = createAsyncThunk(
  "admin/fetchAllLoans",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().adminAccount.token;
      if (!token) {
        return rejectWithValue({ error: "No token found. Please log in." });
      }
      const response = await axios.get(`${BASE_URL}/loans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.loans; // Extract loans array
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

//fetch All Transactions
export const fetchAllTransactions = createAsyncThunk(
  "admin/fetchAllTransactions",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().adminAccount.token;
      if (!token) {
        return rejectWithValue({ error: "No token found. Please log in." });
      }
      const response = await axios.get(`${BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

//fetch All cards
export const fetchAllCards = createAsyncThunk(
  "admin/fetchAllCards",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().adminAccount.token;
      if (!token) {
        return rejectWithValue({ error: "No token found. Please log in." });
      }
      const response = await axios.get(`${BASE_URL}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.cards;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

//fetch All investments
export const fetchAllInvestments = createAsyncThunk(
  "admin/fetchAllInvestments",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().adminAccount.token;
      if (!token) {
        return rejectWithValue({ error: "No token found. Please log in." });
      }
      const response = await axios.get(`${BASE_URL}/investments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.investments;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// ==================== Admin Account Slice ====================
const adminAccountSlice = createSlice({
  name: "adminAccount",
  initialState: {
    admin: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    token: localStorage.getItem("token") || null,
    dashboardData: null,
    users: [],
    loans: [],
    transactions: [],
    cards: [],
    investments: [],
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.admin = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.dashboardData = null;
      state.users = [];
      state.loans = [];
      state.transactions = [];
      state.cards = [];
      state.investments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Account Creation
      .addCase(createAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Something went wrong";
      })

      
      // Handle Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.admin = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Something went wrong";
      })

      //Handle Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to fetch dashboard data";
      })
      //Handle all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to fetch users";
      })
      //Handle all loans
      .addCase(fetchAllLoans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loans = action.payload;
      })
      .addCase(fetchAllLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to fetch loans";
      })

      //Handle all transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to fetch transactions";
      })

      //Handle all cards
      .addCase(fetchAllCards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to fetch cards";
      })

      //Handle all investments
      .addCase(fetchAllInvestments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllInvestments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.investments = action.payload;
      })
      .addCase(fetchAllInvestments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to fetch investments";
      });
  },
});

// ==================== Exports ====================
export const { logout, clearError } = adminAccountSlice.actions;
export default adminAccountSlice.reducer;