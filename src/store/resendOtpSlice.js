import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (emailData) => {
    const response = await axios.post("/api/resend-otp", emailData);
    return response.data;
  }
);

const resendOtpSlice = createSlice({
  name: "resendOtp",
  initialState: {
    message: "",
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(resendOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default resendOtpSlice.reducer;
