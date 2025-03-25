import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "../store/authSlice"; // Import the selector

// Async thunk to fetch investment options
export const fetchInvestmentOptions = createAsyncThunk(
  "investments/fetchInvestmentOptions",
  async (_, { getState, rejectWithValue }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    try {
      // Replace this URL with your actual endpoint if needed
      const response = await axios.get("/api/investments/options", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token
        },
        withCredentials: true,
      });
      // Expected response format: { options: [...] }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Async thunk to add an investment
export const addInvestment = createAsyncThunk(
  "investments/addInvestment",
  async (investmentData, { getState, rejectWithValue }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    try {
      const response = await axios.post("/api/investments", investmentData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token
        },
        withCredentials: true,
      });
      // Expected response format: { investment: {...} }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  investmentOptions:[],
  investments:[],
  status: "idle",
  error: null,
};

const investmentsSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchInvestmentOptions cases
      .addCase(fetchInvestmentOptions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvestmentOptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.investmentOptions = action.payload.options; // Adjust based on your API structure
      })
      .addCase(fetchInvestmentOptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // addInvestment cases
      .addCase(addInvestment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assuming your API returns a new investment in the property `investment`
        state.investments.push(action.payload.investment);
      })
      .addCase(addInvestment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default investmentsSlice.reducer;