import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "./authSlice"; // Import the selector

export const fetchBalance = createAsyncThunk("balance/fetch", async (_, { getState }) => {
  const accessToken = selectSupabaseAccessToken(getState()); // Get the token from the auth state
  try {
    const response = await axios.get("/api/balance", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token in the headers
      },
      withCredentials: true, // Keep this if your backend requires it for other reasons (e.g., cookies)
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    balance: 0,
    accountNumber: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload.balance;
        state.accountNumber = action.payload.account_number;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default balanceSlice.reducer;