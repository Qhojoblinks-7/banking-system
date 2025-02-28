import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBalance = createAsyncThunk("balance/fetch", async () => {
  const response = await axios.get("/api/balance", { withCredentials: true });
  return response.data;
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
