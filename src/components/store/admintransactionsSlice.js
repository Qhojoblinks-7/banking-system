// slices/transactionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/admin/transactions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data.transactions;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const approveTransaction = createAsyncThunk("transactions/approveTransaction", async (transactionId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/admin/transactions/${transactionId}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const admintransactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(approveTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.transaction_id === action.payload.transaction.transaction_id);
        if (index !== -1) state.transactions[index] = action.payload.transaction;
      });
  },
});

export default admintransactionsSlice.reducer;
