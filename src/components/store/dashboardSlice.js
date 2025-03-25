// slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "../store/authSlice"; // Import the selector

export const fetchDashboardData = createAsyncThunk("dashboard/fetchData", async (_, { getState, rejectWithValue }) => {
  const accessToken = selectSupabaseAccessToken(getState()); // Get the token from the auth state
  try {
    const response = await axios.get("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token in the headers
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    analytics: null,
    totalUsers: 0,
    totalLoans: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analytics = action.payload.analytics;
        state.totalUsers = action.payload.totalUsers;
        state.totalLoans = action.payload.totalLoans;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;