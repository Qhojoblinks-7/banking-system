import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExchangeRates = createAsyncThunk(
  "exchangeRates/fetch",
  async () => {
    const response = await axios.get("/api/exchange-rates");
    return response.data;
  }
);

const exchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState: {
    trends: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trends = action.payload.trends;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default exchangeRatesSlice.reducer;
