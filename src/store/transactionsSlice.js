import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async () => {
    const response = await axios.get("/api/transactions", {
      withCredentials: true,
    });
    return response.data;
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transactionData) => {
    const response = await axios.post("/api/transactions", transactionData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    fetchStatus: "idle",
    createStatus: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(createTransaction.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.transactions.push(action.payload.transaction);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default transactionsSlice.reducer;
