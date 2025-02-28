import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async () => {
    const response = await axios.get("/api/analytics", {
      withCredentials: true,
    });
    return response.data;
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
