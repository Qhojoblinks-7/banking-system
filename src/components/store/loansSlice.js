import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "../store/authSlice"; // Import the selector

export const submitLoanRequest = createAsyncThunk(
  "loans/submit",
  async (loanData, { getState }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    try {
      const response = await axios.post("/api/loans", loanData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchLoans = createAsyncThunk("loans/fetch", async (_, { getState }) => { // Added getState
  const accessToken = selectSupabaseAccessToken(getState()); // Get the token
  try {
    const response = await axios.get("/api/loans", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

const loansSlice = createSlice({
  name: "loans",
  initialState: {
    loans:[],
    submitStatus: "idle",
    fetchStatus: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLoanRequest.pending, (state) => {
        state.submitStatus = "loading";
      })
      .addCase(submitLoanRequest.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.loans.push(action.payload.loan);
      })
      .addCase(submitLoanRequest.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLoans.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.loans = action.payload.loans;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default loansSlice.reducer;