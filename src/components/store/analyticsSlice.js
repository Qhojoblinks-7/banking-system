import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "./authSlice"; // Import the selector

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async (_, { getState }) => { // Added getState as an argument
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token from the auth state
    try {
      const response = await axios.get("/api/analytics", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token in the headers
        },
        withCredentials: true, // Keep this if your backend requires it for other reasons (e.g., cookies)
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    analytics: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analytics = action.payload.analytics;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;