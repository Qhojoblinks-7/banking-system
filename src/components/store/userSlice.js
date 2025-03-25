import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { supabase } from "../../supabaseClient"; // Assuming your adminSupabaseClient.js is in the parent directory

// API Base URL
const BASE_URL = "/api";

// Async thunk to fetch user details
export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return rejectWithValue("Could not retrieve session. Please log in again.");
      }

      const token = session?.access_token;

      if (!token) {
        return rejectWithValue("Authentication token not found. Please log in.");
      }

      console.log("Using token:", token);

      const { data } = await axios.get(`${BASE_URL}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // updateProfile cases

      return {
        user: data.user || null,
        accountNumber: data.account_number || null, // Changed 'account' to 'accountNumber' to match backend response
        accounts:[], // Backend '/api/user' doesn't return all accounts in this structure
        transactions:[], // Backend '/api/user' doesn't return transactions
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch user details.");
    }
  }
);

// Async thunk to fetch overview data
export const fetchOverview = createAsyncThunk(
  "user/fetchOverview",
  async (filter = "all", { rejectWithValue }) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return rejectWithValue("Could not retrieve session. Please log in again.");
      }

      const token = session?.access_token;

      if (!token) {
        return rejectWithValue("Authentication token not found. Please log in.");
      }

      console.log("Supabase Session in fetchOverview:", session);
      console.log("Supabase Session Error in fetchOverview:", sessionError);

      const { data } = await axios.get(`${BASE_URL}/overview?filter=${filter}`, { // Changed '/user/overview' to '/overview'
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        user: data.user || null,
        account: data.account || null,
        transactions: data.transactions ||[],
      };
    } catch (error) {
      console.error("Error fetching overview data:", error);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch overview data."
      );
    }
  }
);

// Async thunk to update user profile (Needs corresponding backend route)
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return rejectWithValue("Could not retrieve session. Please log in again.");
      }

      const token = session?.access_token;

      if (!token) {
        return rejectWithValue("Authentication token not found. Please log in.");
      }
      const { data } = await axios.post(`${BASE_URL}/update-profile`, profileData, { // Ensure this route exists in your backend
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return rejectWithValue(
        error.response?.data?.error || "Profile update failed."
      );
    }
  }
);

// Async thunk to change password (Needs corresponding backend route)
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return rejectWithValue("Could not retrieve session. Please log in again.");
      }

      const token = session?.access_token;

      if (!token) {
        return rejectWithValue("Authentication token not found. Please log in.");
      }
      const { data } = await axios.post(`${BASE_URL}/change-password`, passwordData, { // Ensure this route exists in your backend
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error changing password:", error);
      return rejectWithValue(
        error.response?.data?.error || "Password change failed."
      );
    }
  }
);

// Async thunk to update security questions (Needs corresponding backend route)
export const updateSecurityQuestions = createAsyncThunk(
  "user/updateSecurityQuestions",
  async (questionsData, { rejectWithValue }) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return rejectWithValue("Could not retrieve session. Please log in again.");
      }

      const token = session?.access_token;

      if (!token) {
        return rejectWithValue("Authentication token not found. Please log in.");
      }
      const { data } = await axios.post(`${BASE_URL}/update-security-questions`, questionsData, { // Ensure this route exists in your backend
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error updating security questions:", error);
      return rejectWithValue(
        error.response?.data?.error || "Updating security questions failed."
      );
    }
  }
);

const initialState = {
  user: null,
  accountNumber: null, // Changed 'account' to 'accountNumber'
  account: null, // Keep 'account' for the overview data
  accounts:[],
  transactions:[],
  status: "idle",
  error: null,
  loading: {
    fetchUser: false,
    fetchOverview: false,
    updateProfile: false,
    changePassword: false,
    updateSecurityQuestions: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    clearUser(state) {
      state.user = null;
      state.accountNumber = null; // Clear accountNumber
      state.account = null;
      state.accounts =[];
      state.transactions =[];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser cases
      .addCase(fetchUser.pending, (state) => {
        state.loading.fetchUser = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading.fetchUser = false;
        state.user = action.payload.user;
        state.accountNumber = action.payload.accountNumber; // Store account number
        state.accounts = action.payload.accounts;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading.fetchUser = false;
        state.error = action.payload;
      })

      // fetchOverview cases
      .addCase(fetchOverview.pending, (state) => {
        console.log("userSlice.extraReducers.fetchOverview.pending");
        state.loading.fetchOverview = true;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        console.log("userSlice.extraReducers.fetchOverview.fulfilled with payload:", action.payload);
        state.loading.fetchOverview = false;
        state.user = action.payload.user;
        state.account = action.payload.account;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        console.error("userSlice.extraReducers.fetchOverview.rejected with payload:", action.payload);
        state.loading.fetchOverview = false;
        state.error = action.payload;
      })

      // updateProfile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading.updateProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.user = { ...state.user, ...action.payload.user };
        state.account = action.payload.account; // Update account if provided
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.error = action.payload;
      })

      // changePassword cases
      .addCase(changePassword.pending, (state) => {
        state.loading.changePassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.changePassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.changePassword = false;
        state.error = action.payload;
      })

      // updateSecurityQuestions cases
      .addCase(updateSecurityQuestions.pending, (state) => {
        state.loading.updateSecurityQuestions = true;
        state.error = null;
      })
      .addCase(updateSecurityQuestions.fulfilled, (state, action) => {
        state.loading.updateSecurityQuestions = false;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(updateSecurityQuestions.rejected, (state, action) => {
        state.loading.updateSecurityQuestions = false;
        state.error = action.payload;
      });
  }
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;