import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // This file now handles the base URL (assumed to be /api)


// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    console.log("registerUser thunk dispatched with data:", userData);
    // SECURITY WARNING: DO NOT LOG PASSWORDS OR CONFIRM_PASSWORD IN PRODUCTION
    console.log("registerUser: User data being sent for registration (INCLUDING PASSWORD AND CONFIRM_PASSWORD):", userData);
    try {
      console.log("registerUser: Making API call to /register with data:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("registerUser: API call successful, response data:", response.data);
      return response.data; // Expecting data containing user
    } catch (error) {
      console.error("registerUser: API call failed, error:", error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    console.log("loginUser thunk dispatched with credentials:", credentials);
    try {
      console.log("loginUser: Making API call to /auth/login with credentials:", credentials);
      const response = await api.post("/auth/login", credentials);
      console.log("loginUser: API call successful, response data:", response.data);
      return response.data; // Expecting data containing user and session (including accessToken)
    } catch (error) {
      console.error("loginUser: API call failed, error:", error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  user: null,
  // token: null, // Removed: We're primarily using Supabase's access token
  supabaseAccessToken: null, // To store the Supabase access token
  bankAccount: null,
  status: "idle",
  error: null,
  isAuthenticated: false, // Add isAuthenticated status
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      console.log("authSlice.reducers.logout called");
      state.user = null;
      // state.token = null; // Removed
      state.supabaseAccessToken = null;
      state.bankAccount = null;
      state.status = "idle";
      state.error = null;
      state.isAuthenticated = false;
    },
    // setToken(state, action) { // Removed: No longer primarily using a custom backend token
    //   console.log("authSlice.reducers.setToken called with payload:", action.payload);
    //   state.token = action.payload;
    //   state.isAuthenticated = !!state.token; // Set isAuthenticated based on backend token
    // },
    setAccessToken(state, action) { // Action to set the Supabase access token
      console.log("authSlice.reducers.setAccessToken called with payload:", action.payload);
      state.supabaseAccessToken = action.payload;
      state.isAuthenticated = !!state.supabaseAccessToken; // Set isAuthenticated based on Supabase access token
    },
    clearAccessToken(state) {
      console.log("authSlice.reducers.clearAccessToken called");
      state.supabaseAccessToken = null;
      state.isAuthenticated = false; // Update isAuthenticated when access token is cleared
    },
  },
  extraReducers: (builder) => {
    // register user cases
    builder
      .addCase(registerUser.pending, (state) => {
        console.log("authSlice.extraReducers.registerUser.pending");
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("authSlice.extraReducers.registerUser.fulfilled with payload:", action.payload);
        state.status = "succeeded";
        state.user = action.payload.user;
        // state.token = action.payload.token || null; // Removed
        // state.isAuthenticated = !!state.token; // Removed
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("authSlice.extraReducers.registerUser.rejected with payload:", action.payload);
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        console.log("authSlice.extraReducers.loginUser.pending");
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("authSlice.extraReducers.loginUser.fulfilled with payload:", action.payload);
        state.status = "succeeded";
        state.user = action.payload.data?.user;
        state.supabaseAccessToken = action.payload.data?.session?.access_token || null;
        state.isAuthenticated = !!state.supabaseAccessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("authSlice.extraReducers.loginUser.rejected with payload:", action.payload);
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, setAccessToken, clearAccessToken } = authSlice.actions;

// Selectors
export const selectAuthUser = (state) => state.auth.user;
// export const selectAuthToken = (state) => state.auth.token; // Removed
export const selectSupabaseAccessToken = (state) => state.auth.supabaseAccessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectregisterStatus = (state) => state.auth.status === 'auth/register/pending' ? 'loading' : state.auth.status === 'auth/register/fulfilled' ? 'succeeded' : state.auth.status === 'auth/register/rejected' ? 'failed' : 'idle';
export const selectregisterError = (state) => state.auth.error;
export const selectLoginStatus = (state) => state.auth.status === 'auth/login/pending' ? 'loading' : state.auth.status === 'auth/login/fulfilled' ? 'succeeded' : state.auth.status === 'auth/login/rejected' ? 'failed' : 'idle';
export const selectLoginError = (state) => state.auth.error;

export default authSlice.reducer;