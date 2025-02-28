import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData) => {
    const response = await axios.post("/api/verify-otp", otpData);
    return response.data;
  }
);

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default verifyOtpSlice.reducer;
