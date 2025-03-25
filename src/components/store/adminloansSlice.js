// slices/loansSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLoans = createAsyncThunk("loans/fetchLoans", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/admin/loans", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data.loans;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const approveLoan = createAsyncThunk("loans/approveLoan", async (loanId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/admin/loans/${loanId}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const adminloansSlice = createSlice({
  name: "loans",
  initialState: {
    loans: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loans = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(approveLoan.fulfilled, (state, action) => {
        const index = state.loans.findIndex((loan) => loan.loan_id === action.payload.loan.loan_id);
        if (index !== -1) state.loans[index] = action.payload.loan;
      });
  },
});

export default adminloansSlice.reducer;
